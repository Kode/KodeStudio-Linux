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
define(["require", "exports", 'vs/base/common/winjs.base', 'vs/nls', 'vs/platform/platform', 'vs/base/browser/builder', 'vs/base/common/uuid', 'vs/base/common/events', 'vs/base/common/timer', 'vs/base/common/strings', 'vs/base/common/types', 'vs/base/common/errors', 'vs/base/browser/ui/toolbar/toolbar', 'vs/base/browser/ui/actionbar/actionbar', 'vs/base/browser/ui/progressbar/progressbar', 'vs/workbench/browser/actionBarRegistry', 'vs/base/common/actions', 'vs/workbench/browser/part', 'vs/workbench/common/events', 'vs/workbench/browser/viewlet', 'vs/workbench/common/actionRegistry', 'vs/platform/actions/common/actions', 'vs/workbench/services/progress/browser/progressService', 'vs/workbench/services/viewlet/common/viewletService', 'vs/workbench/services/part/common/partService', 'vs/platform/storage/common/storage', 'vs/platform/message/common/message', 'vs/base/common/keyCodes', 'vs/css!./media/sidebarpart'], function (require, exports, winjs_base_1, nls, platform_1, builder_1, uuid, events, timer, strings, types, errors, toolbar_1, actionbar_1, progressbar_1, actionBarRegistry_1, actions_1, part_1, events_1, viewlet_1, actionRegistry_1, actions_2, progressService_1, viewletService_1, partService_1, storage_1, message_1, keyCodes_1) {
    var SidebarPart = (function (_super) {
        __extends(SidebarPart, _super);
        function SidebarPart(messageService, storageService, eventService, telemetryService, contextMenuService, partService, keybindingService, id) {
            _super.call(this, id);
            this.messageService = messageService;
            this.storageService = storageService;
            this.eventService = eventService;
            this.telemetryService = telemetryService;
            this.contextMenuService = contextMenuService;
            this.partService = partService;
            this.keybindingService = keybindingService;
            this.serviceId = viewletService_1.IViewletService;
            this.activeViewletListeners = [];
            this.instantiatedViewletListeners = [];
            this.mapViewletToViewletContainer = {};
            this.mapActionsBindingToViewlet = {};
            this.mapProgressServiceToViewlet = {};
            this.activeViewlet = null;
            this.instantiatedViewlets = [];
            this.viewletLoaderPromises = {};
            this.registry = platform_1.Registry.as(viewlet_1.Extensions.Viewlets);
        }
        SidebarPart.prototype.setInstantiationService = function (service) {
            this.instantiationService = service;
        };
        SidebarPart.prototype.openViewlet = function (id, focus) {
            if (this.blockOpeningViewlet) {
                return winjs_base_1.TPromise.as(null); // Workaround against a potential race condition
            }
            // First check if sidebar is hidden and show if so
            if (this.partService.isSideBarHidden()) {
                try {
                    this.blockOpeningViewlet = true;
                    this.partService.setSideBarHidden(false);
                }
                finally {
                    this.blockOpeningViewlet = false;
                }
            }
            // Check if viewlet already visible and just focus in that case
            if (this.activeViewlet && this.activeViewlet.getId() === id) {
                if (focus) {
                    this.activeViewlet.focus();
                }
                // Fullfill promise with viewlet that is being opened
                return winjs_base_1.TPromise.as(this.activeViewlet);
            }
            // Open
            return this.doOpenViewlet(id, focus);
        };
        SidebarPart.prototype.doOpenViewlet = function (id, focus) {
            var _this = this;
            var timerEvent = timer.start(timer.Topic.WORKBENCH, strings.format('Open Viewlet {0}', id.substr(id.lastIndexOf('.') + 1)));
            // Use a generated token to avoid race conditions from long running promises
            var currentViewletOpenToken = uuid.generateUuid();
            this.currentViewletOpenToken = currentViewletOpenToken;
            // Emit Viewlet Opening Event
            this.emit(events_1.EventType.VIEWLET_OPENING, new events_1.ViewletEvent(id));
            // Hide current
            var hidePromise;
            if (this.activeViewlet) {
                hidePromise = this.hideActiveViewlet();
            }
            else {
                hidePromise = winjs_base_1.TPromise.as(null);
            }
            return hidePromise.then(function () {
                // Update Title
                _this.updateTitle(id);
                // Create viewlet
                return _this.createViewlet(id, true).then(function (viewlet) {
                    // Check if another viewlet opened meanwhile and return in that case
                    if ((_this.currentViewletOpenToken !== currentViewletOpenToken) || (_this.activeViewlet && _this.activeViewlet.getId() !== viewlet.getId())) {
                        timerEvent.stop();
                        return winjs_base_1.TPromise.as(null);
                    }
                    // Check if viewlet already visible and just focus in that case
                    if (_this.activeViewlet && _this.activeViewlet.getId() === viewlet.getId()) {
                        if (focus) {
                            viewlet.focus();
                        }
                        timerEvent.stop();
                        // Fullfill promise with viewlet that is being opened
                        return winjs_base_1.TPromise.as(viewlet);
                    }
                    // Show Viewlet and Focus
                    return _this.showViewlet(viewlet).then(function () {
                        if (focus) {
                            viewlet.focus();
                        }
                        timerEvent.stop();
                        // Fullfill promise with viewlet that is being opened
                        return viewlet;
                    });
                });
            });
        };
        SidebarPart.prototype.createViewlet = function (id, isActive) {
            var _this = this;
            // Check if viewlet is already created
            for (var i = 0; i < this.instantiatedViewlets.length; i++) {
                if (this.instantiatedViewlets[i].getId() === id) {
                    return winjs_base_1.TPromise.as(this.instantiatedViewlets[i]);
                }
            }
            // Instantiate viewlet from registry otherwise
            var viewletDescriptor = this.registry.getViewlet(id);
            if (viewletDescriptor) {
                var loaderPromise = this.viewletLoaderPromises[id];
                if (!loaderPromise) {
                    var progressService = new progressService_1.WorkbenchProgressService(this.eventService, this.progressBar, viewletDescriptor.id, isActive);
                    var services = {
                        progressService: progressService
                    };
                    var viewletInstantiationService = this.instantiationService.createChild(services);
                    loaderPromise = viewletInstantiationService.createInstance(viewletDescriptor).then(function (viewlet) {
                        _this.mapProgressServiceToViewlet[viewlet.getId()] = progressService;
                        // Remember as Instantiated
                        _this.instantiatedViewlets.push(viewlet);
                        // Register to title area update events from the viewlet
                        _this.instantiatedViewletListeners.push(viewlet.addListener(viewlet_1.EventType.INTERNAL_VIEWLET_TITLE_AREA_UPDATE, function (e) { _this.onTitleAreaUpdate(e); }));
                        // Remove from Promises Cache since Loaded
                        delete _this.viewletLoaderPromises[id];
                        return viewlet;
                    });
                    // Report progress for slow loading viewlets
                    progressService.showWhile(loaderPromise, this.partService.isCreated() ? 800 : 3200 /* less ugly initial startup */);
                    // Add to Promise Cache until Loaded
                    this.viewletLoaderPromises[id] = loaderPromise;
                }
                return loaderPromise;
            }
            throw new Error(strings.format('Unable to find viewlet with id {0}', id));
        };
        SidebarPart.prototype.showViewlet = function (viewlet) {
            var _this = this;
            // Remember Viewlet
            this.activeViewlet = viewlet;
            // Store in preferences
            this.storageService.store(SidebarPart.activeViewletSettingsKey, this.activeViewlet.getId(), storage_1.StorageScope.WORKSPACE);
            // Remember
            this.lastActiveViewletId = this.activeViewlet.getId();
            // Register as Emitter to Workbench Bus
            this.activeViewletListeners.push(this.eventService.addEmitter(this.activeViewlet, this.activeViewlet.getId()));
            var createViewletPromise;
            // Viewlet created for the first time
            var viewletContainer = this.mapViewletToViewletContainer[viewlet.getId()];
            if (!viewletContainer) {
                // Build Container off-DOM
                viewletContainer = builder_1.$().div({
                    'class': 'viewlet',
                    id: viewlet.getId()
                }, function (div) {
                    createViewletPromise = viewlet.create(div);
                });
                // Remember viewlet container
                this.mapViewletToViewletContainer[viewlet.getId()] = viewletContainer;
            }
            else {
                createViewletPromise = winjs_base_1.TPromise.as(null);
            }
            // Report progress for slow loading viewlets (but only if we did not create the viewlet before already)
            var progressService = this.mapProgressServiceToViewlet[viewlet.getId()];
            if (progressService && !viewletContainer) {
                this.mapProgressServiceToViewlet[viewlet.getId()].showWhile(createViewletPromise, this.partService.isCreated() ? 800 : 3200 /* less ugly initial startup */);
            }
            // Fill Content and Actions
            return createViewletPromise.then(function () {
                // Make sure that the user meanwhile did not open another viewlet or closed the sidebar
                if (!_this.activeViewlet || viewlet.getId() !== _this.activeViewlet.getId()) {
                    return;
                }
                // Take Viewlet on-DOM and show
                viewletContainer.build(_this.getContentArea());
                viewletContainer.show();
                // Setup action runner
                _this.toolBar.actionRunner = viewlet.getActionRunner();
                // Update title with viewlet title if it differs from descriptor
                var descriptor = _this.registry.getViewlet(viewlet.getId());
                if (descriptor && descriptor.name !== viewlet.getTitle()) {
                    _this.updateTitle(viewlet.getId(), viewlet.getTitle());
                }
                // Handle Viewlet Actions
                var actionsBinding = _this.mapActionsBindingToViewlet[viewlet.getId()];
                if (!actionsBinding) {
                    actionsBinding = _this.collectViewletActions(viewlet);
                    _this.mapActionsBindingToViewlet[viewlet.getId()] = actionsBinding;
                }
                actionsBinding();
                if (_this.telemetryActionsListener) {
                    _this.telemetryActionsListener.dispose();
                    _this.telemetryActionsListener = null;
                }
                // Action Run Handling
                _this.telemetryActionsListener = _this.toolBar.actionRunner.addListener2(events.EventType.RUN, function (e) {
                    // Check for Error
                    if (e.error && !errors.isPromiseCanceledError(e.error)) {
                        _this.messageService.show(message_1.Severity.Error, e.error);
                    }
                    // Log in telemetry
                    if (_this.telemetryService) {
                        _this.telemetryService.publicLog('workbenchActionExecuted', { id: e.action.id, from: 'sideBar' });
                    }
                });
                // Indicate to viewlet that it is now visible
                return viewlet.setVisible(true).then(function () {
                    // Make sure that the user meanwhile did not open another viewlet or closed the sidebar
                    if (!_this.activeViewlet || viewlet.getId() !== _this.activeViewlet.getId()) {
                        return;
                    }
                    // Make sure the viewlet is layed out
                    if (_this.contentAreaSize) {
                        viewlet.layout(_this.contentAreaSize);
                    }
                    // Emit Viewlet Opened Event
                    _this.emit(events_1.EventType.VIEWLET_OPENED, new events_1.ViewletEvent(_this.activeViewlet.getId()));
                });
            }, function (error) { return _this.onError(error); });
        };
        SidebarPart.prototype.onTitleAreaUpdate = function (e) {
            // Active Viewlet
            if (this.activeViewlet && this.activeViewlet.getId() === e.viewletId) {
                // Title
                this.updateTitle(this.activeViewlet.getId(), this.activeViewlet.getTitle());
                // Actions
                var actionsBinding = this.collectViewletActions(this.activeViewlet);
                this.mapActionsBindingToViewlet[this.activeViewlet.getId()] = actionsBinding;
                actionsBinding();
            }
            else {
                delete this.mapActionsBindingToViewlet[e.viewletId];
            }
        };
        SidebarPart.prototype.updateTitle = function (viewletId, viewletTitle) {
            var _this = this;
            var viewletDescriptor = this.registry.getViewlet(viewletId);
            if (!viewletDescriptor) {
                return;
            }
            if (!viewletTitle) {
                viewletTitle = viewletDescriptor.name;
            }
            var keybinding = null;
            var keys = this.keybindingService.lookupKeybindings(viewletId).map(function (k) { return _this.keybindingService.getLabelFor(k); });
            if (keys && keys.length) {
                keybinding = keys[0];
            }
            this.titleLabel.safeInnerHtml(viewletTitle);
            this.titleLabel.title(keybinding ? nls.localize('viewletTitleTooltip', "{0} ({1})", viewletTitle, keybinding) : viewletTitle);
        };
        SidebarPart.prototype.collectViewletActions = function (viewlet) {
            // From Viewlet
            var primaryActions = viewlet.getActions();
            var secondaryActions = viewlet.getSecondaryActions();
            // From Contributions
            var actionBarRegistry = platform_1.Registry.as(actionBarRegistry_1.Extensions.Actionbar);
            primaryActions.push.apply(primaryActions, actionBarRegistry.getActionBarActionsForContext(actionBarRegistry_1.Scope.VIEW, viewlet));
            secondaryActions.push.apply(secondaryActions, actionBarRegistry.getSecondaryActionBarActionsForContext(actionBarRegistry_1.Scope.VIEW, viewlet));
            // Return fn to set into toolbar
            return this.toolBar.setActions(actionBarRegistry_1.prepareActions(primaryActions), actionBarRegistry_1.prepareActions(secondaryActions));
        };
        SidebarPart.prototype.getActiveViewlet = function () {
            return this.activeViewlet;
        };
        SidebarPart.prototype.getLastActiveViewletId = function () {
            return this.lastActiveViewletId;
        };
        SidebarPart.prototype.hideActiveViewlet = function () {
            var _this = this;
            if (!this.activeViewlet) {
                return winjs_base_1.TPromise.as(null); // Nothing to do
            }
            var viewlet = this.activeViewlet;
            this.activeViewlet = null;
            var viewletContainer = this.mapViewletToViewletContainer[viewlet.getId()];
            // Indicate to Viewlet
            return viewlet.setVisible(false).then(function () {
                // Take Container Off-DOM and hide
                viewletContainer.offDOM();
                viewletContainer.hide();
                // Clear any running Progress
                _this.progressBar.stop().getContainer().hide();
                // Empty Actions
                _this.toolBar.setActions([])();
                // Clear Listeners
                while (_this.activeViewletListeners.length) {
                    _this.activeViewletListeners.pop()();
                }
                // Emit Viewlet Closed Event
                _this.emit(events_1.EventType.VIEWLET_CLOSED, new events_1.ViewletEvent(viewlet.getId()));
            });
        };
        SidebarPart.prototype.createTitleArea = function (parent) {
            var _this = this;
            // Title Area Container
            var titleArea = builder_1.$(parent).div({
                'class': 'title'
            });
            // Right Actions Container
            builder_1.$(titleArea).div({
                'class': 'title-actions'
            }, function (div) {
                // Toolbar
                _this.toolBar = new toolbar_1.ToolBar(div.getHTMLElement(), _this.contextMenuService, {
                    actionItemProvider: function (action) { return _this.actionItemProvider(action); },
                    orientation: actionbar_1.ActionsOrientation.HORIZONTAL
                });
            });
            // Left Title Label
            builder_1.$(titleArea).div({
                'class': 'title-label'
            }, function (div) {
                _this.titleLabel = div.span();
            });
            return titleArea;
        };
        SidebarPart.prototype.actionItemProvider = function (action) {
            var actionItem;
            // Check Active Viewlet
            if (this.activeViewlet) {
                actionItem = this.activeViewlet.getActionItem(action);
            }
            // Check Registry
            if (!actionItem) {
                var actionBarRegistry = platform_1.Registry.as(actionBarRegistry_1.Extensions.Actionbar);
                actionItem = actionBarRegistry.getActionItemForContext(actionBarRegistry_1.Scope.VIEW, toolbar_1.CONTEXT, action);
            }
            return actionItem;
        };
        SidebarPart.prototype.createContentArea = function (parent) {
            var _this = this;
            return builder_1.$(parent).div({
                'class': 'content'
            }, function (div) {
                _this.progressBar = new progressbar_1.ProgressBar(div);
                _this.progressBar.getContainer().hide();
            });
        };
        SidebarPart.prototype.onError = function (error) {
            this.messageService.show(message_1.Severity.Error, types.isString(error) ? new Error(error) : error);
        };
        SidebarPart.prototype.layout = function (dimension) {
            // Pass to super
            var sizes = _super.prototype.layout.call(this, dimension);
            // Pass Contentsize to viewlet
            this.contentAreaSize = sizes[1];
            if (this.activeViewlet) {
                this.activeViewlet.layout(this.contentAreaSize);
            }
            return sizes;
        };
        SidebarPart.prototype.shutdown = function () {
            this.instantiatedViewlets.forEach(function (i) { return i.shutdown(); });
            _super.prototype.shutdown.call(this);
        };
        SidebarPart.prototype.dispose = function () {
            this.mapViewletToViewletContainer = null;
            this.mapProgressServiceToViewlet = null;
            this.mapActionsBindingToViewlet = null;
            for (var i = 0; i < this.instantiatedViewlets.length; i++) {
                this.instantiatedViewlets[i].dispose();
            }
            this.instantiatedViewlets = [];
            while (this.activeViewletListeners.length) {
                this.activeViewletListeners.pop()();
            }
            while (this.instantiatedViewletListeners.length) {
                this.instantiatedViewletListeners.pop()();
            }
            this.progressBar.dispose();
            this.toolBar.dispose();
            // Super Dispose
            _super.prototype.dispose.call(this);
        };
        SidebarPart.activeViewletSettingsKey = 'workbench.sidebar.activeviewletid';
        return SidebarPart;
    })(part_1.Part);
    exports.SidebarPart = SidebarPart;
    var FocusSideBarAction = (function (_super) {
        __extends(FocusSideBarAction, _super);
        function FocusSideBarAction(id, label, viewletService, partService) {
            _super.call(this, id, label);
            this.viewletService = viewletService;
            this.partService = partService;
        }
        FocusSideBarAction.prototype.run = function () {
            // Show side bar
            if (this.partService.isSideBarHidden()) {
                this.partService.setSideBarHidden(false);
            }
            else {
                var viewlet = this.viewletService.getActiveViewlet();
                if (viewlet) {
                    viewlet.focus();
                }
            }
            return winjs_base_1.TPromise.as(true);
        };
        FocusSideBarAction.ID = 'workbench.action.focusSideBar';
        FocusSideBarAction.LABEL = nls.localize('focusSideBar', "Focus into Side Bar");
        FocusSideBarAction = __decorate([
            __param(2, viewletService_1.IViewletService),
            __param(3, partService_1.IPartService)
        ], FocusSideBarAction);
        return FocusSideBarAction;
    })(actions_1.Action);
    exports.FocusSideBarAction = FocusSideBarAction;
    var registry = platform_1.Registry.as(actionRegistry_1.Extensions.WorkbenchActions);
    registry.registerWorkbenchAction(new actions_2.SyncActionDescriptor(FocusSideBarAction, FocusSideBarAction.ID, FocusSideBarAction.LABEL, {
        primary: keyCodes_1.KeyMod.CtrlCmd | keyCodes_1.KeyCode.KEY_0
    }), nls.localize('viewCategory', "View"));
});
//# sourceMappingURL=sidebarPart.js.map