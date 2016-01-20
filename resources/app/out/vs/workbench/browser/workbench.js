/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/base/common/winjs.base', 'vs/base/common/types', 'vs/base/common/lifecycle', 'vs/base/common/strings', 'vs/base/browser/dom', 'vs/base/browser/builder', 'vs/base/common/async', 'vs/base/common/assert', 'vs/base/common/timer', 'vs/base/common/errors', 'vs/platform/platform', 'vs/workbench/common/constants', 'vs/workbench/common/events', 'vs/workbench/common/contributions', 'vs/workbench/browser/parts/editor/baseEditor', 'vs/workbench/common/editor', 'vs/workbench/services/history/browser/history', 'vs/workbench/browser/parts/activitybar/activitybarPart', 'vs/workbench/browser/parts/editor/editorPart', 'vs/workbench/browser/parts/sidebar/sidebarPart', 'vs/workbench/browser/parts/statusbar/statusbarPart', 'vs/workbench/browser/layout', 'vs/workbench/browser/actionBarRegistry', 'vs/workbench/browser/viewlet', 'vs/workbench/browser/parts/quickopen/quickOpenController', 'vs/platform/instantiation/common/extensions', 'vs/platform/keybinding/browser/keybindingServiceImpl', 'vs/workbench/services/untitled/common/untitledEditorService', 'vs/workbench/services/editor/browser/editorService', 'vs/workbench/services/part/common/partService', 'vs/platform/theme/common/themes', 'vs/workbench/services/workspace/common/contextService', 'vs/platform/storage/common/storage', 'vs/platform/keybinding/common/keybindingService', 'vs/platform/contextview/browser/contextView', 'vs/workbench/services/activity/common/activityService', 'vs/workbench/services/viewlet/common/viewletService', 'vs/workbench/services/editor/common/editorService', 'vs/workbench/services/quickopen/common/quickOpenService', 'vs/workbench/services/history/common/history', 'vs/platform/event/common/event', 'vs/platform/lifecycle/common/lifecycle', 'vs/platform/message/common/message', 'vs/platform/telemetry/common/telemetry', 'vs/platform/thread/common/thread', 'vs/platform/plugins/common/plugins', 'vs/workbench/services/statusbar/common/statusbarService', 'vs/css!./media/workbench'], function (require, exports, winjs_base_1, types, lifecycle_1, strings, DOM, builder_1, async_1, assert, timer, errors, platform_1, constants_1, events_1, contributions_1, baseEditor_1, editor_1, history_1, activitybarPart_1, editorPart_1, sidebarPart_1, statusbarPart_1, layout_1, actionBarRegistry_1, viewlet_1, quickOpenController_1, extensions_1, keybindingServiceImpl_1, untitledEditorService_1, editorService_1, partService_1, themes_1, contextService_1, storage_1, keybindingService_1, contextView_1, activityService_1, viewletService_1, editorService_2, quickOpenService_1, history_2, event_1, lifecycle_2, message_1, telemetry_1, thread_1, plugins_1, statusbarService_1) {
    /**
     * The workbench creates and lays out all parts that make up the Monaco Workbench.
     */
    var Workbench = (function () {
        function Workbench(container, workspace, configuration, options, instantiationService) {
            var _this = this;
            this.serviceId = partService_1.IPartService;
            // Validate params
            this.validateParams(container, configuration, options);
            // If String passed in as container, try to find it in DOM
            if (types.isString(container)) {
                var element = builder_1.withElementById(container.toString());
                this.container = element.getHTMLElement();
            }
            else {
                this.container = container;
            }
            this.workbenchParams = {
                workspace: workspace,
                configuration: configuration,
                options: options || {},
                instantiationService: instantiationService
            };
            this.currentTheme = null;
            this.toDispose = [];
            this.toShutdown = [];
            this.editorBackgroundDelayer = new async_1.Delayer(50);
            this.creationPromise = new winjs_base_1.TPromise(function (c, e, p) {
                _this.creationPromiseComplete = c;
            });
        }
        Workbench.prototype.validateParams = function (container, configuration, options) {
            // Container
            assert.ok(container, 'Workbench requires a container to be created with');
            if (types.isString(container)) {
                var element = builder_1.withElementById(container.toString());
                assert.ok(element, strings.format('Can not find HTMLElement with id \'{0}\'.', container));
            }
        };
        /**
         * Starts the workbench and creates the HTML elements on the container. A workbench can only be started
         * once. Use the shutdown function to free up resources created by the workbench on startup.
         */
        Workbench.prototype.startup = function (callbacks) {
            var _this = this;
            assert.ok(!this.workbenchStarted, 'Can not start a workbench that was already started');
            assert.ok(!this.workbenchShutdown, 'Can not start a workbench that was shutdown');
            try {
                this.workbenchStarted = true;
                this.callbacks = callbacks;
                // Create Workbench
                this.createWorkbench();
                // Services
                this.initServices();
                if (this.callbacks && this.callbacks.onServicesCreated) {
                    this.callbacks.onServicesCreated();
                }
                // Register Listeners
                this.registerListeners();
                // Settings
                this.initSettings();
                // Create Workbench and Parts
                this.renderWorkbench();
                // Workbench Layout
                this.createWorkbenchLayout();
                // Register Emitters
                this.registerEmitters();
                // Load viewlet and editors in parallel
                var viewletAndEditorPromises = [];
                // Show default viewlet unless sidebar is hidden or we dont have a default viewlet
                var registry = platform_1.Registry.as(viewlet_1.Extensions.Viewlets);
                var viewletId = registry.getDefaultViewletId();
                if (!this.workbenchParams.configuration.env.isBuilt) {
                    viewletId = this.storageService.get(sidebarPart_1.SidebarPart.activeViewletSettingsKey, storage_1.StorageScope.WORKSPACE, registry.getDefaultViewletId()); // help developers and restore last view
                }
                if (!this.sideBarHidden && !!viewletId) {
                    var viewletTimerEvent = timer.start(timer.Topic.STARTUP, strings.format('Opening Viewlet: {0}', viewletId));
                    viewletAndEditorPromises.push(this.sidebarPart.openViewlet(viewletId, false).then(function () { return viewletTimerEvent.stop(); }));
                }
                // Check for configured options to open files on startup and resolve if any or open untitled for empty workbench
                var editorTimerEvent = timer.start(timer.Topic.STARTUP, strings.format('Restoring Editor(s)'));
                var resolveEditorInputsPromise = winjs_base_1.Promise.as(null);
                var options = [];
                // Files to open or create
                if ((this.workbenchParams.options.filesToCreate && this.workbenchParams.options.filesToCreate.length) || (this.workbenchParams.options.filesToOpen && this.workbenchParams.options.filesToOpen.length)) {
                    var inputs = [];
                    var filesToCreate = this.workbenchParams.options.filesToCreate || [];
                    var filesToOpen = this.workbenchParams.options.filesToOpen || [];
                    // Files to create
                    inputs.push.apply(inputs, filesToCreate.map(function (resourceInput) { return _this.untitledEditorService.createOrGet(resourceInput.resource); }));
                    options.push.apply(options, filesToCreate.map(function (r) { return null; })); // fill empty options for files to create because we dont have options there
                    // Files to open
                    resolveEditorInputsPromise = winjs_base_1.Promise.join(filesToOpen.map(function (resourceInput) { return _this.editorService.inputToType(resourceInput); })).then(function (inputsToOpen) {
                        inputs.push.apply(inputs, inputsToOpen);
                        options.push.apply(options, filesToOpen.map(function (resourceInput) { return editor_1.TextEditorOptions.from(resourceInput); }));
                        return inputs;
                    });
                }
                else if (!this.workbenchParams.workspace) {
                    resolveEditorInputsPromise = winjs_base_1.Promise.as([this.untitledEditorService.createOrGet()]);
                }
                // Restore editor state (either from last session or with given inputs)
                viewletAndEditorPromises.push(resolveEditorInputsPromise.then(function (inputs) {
                    return _this.editorPart.restoreEditorState(inputs, options).then(function () {
                        _this.onEditorOpenedOrClosed(); // make sure we show the proper background in the editor area
                        editorTimerEvent.stop();
                    });
                }));
                // Flag workbench as created once done
                winjs_base_1.Promise.join(viewletAndEditorPromises).then(function () {
                    _this.workbenchCreated = true;
                    _this.eventService.emit(events_1.EventType.WORKBENCH_CREATED);
                    _this.creationPromiseComplete(true);
                    if (_this.callbacks && _this.callbacks.onWorkbenchStarted) {
                        _this.callbacks.onWorkbenchStarted();
                    }
                }, errors.onUnexpectedError);
            }
            catch (error) {
                // Print out error
                console.error(errors.toErrorMessage(error, true));
                // Rethrow
                throw error;
            }
        };
        Workbench.prototype.initServices = function () {
            this.instantiationService = this.workbenchParams.instantiationService;
            // Services we expect
            this.eventService = this.instantiationService.getInstance(event_1.IEventService);
            this.storageService = this.instantiationService.getInstance(storage_1.IStorageService);
            this.keybindingService = this.instantiationService.getInstance(keybindingService_1.IKeybindingService);
            this.contextService = this.instantiationService.getInstance(contextService_1.IWorkspaceContextService);
            this.telemetryService = this.instantiationService.getInstance(telemetry_1.ITelemetryService);
            var messageService = this.instantiationService.getInstance(message_1.IMessageService);
            if (this.keybindingService instanceof keybindingServiceImpl_1.AbstractKeybindingService) {
                this.keybindingService.setMessageService(messageService);
            }
            var threadService = this.instantiationService.getInstance(thread_1.IThreadService);
            var pluginService = this.instantiationService.getInstance(plugins_1.IPluginService);
            this.lifecycleService = this.instantiationService.getInstance(lifecycle_2.ILifecycleService);
            this.toDispose.push(this.lifecycleService.onShutdown(this.shutdownComponents, this));
            var contextMenuService = this.instantiationService.getInstance(contextView_1.IContextMenuService);
            this.untitledEditorService = this.instantiationService.getInstance(untitledEditorService_1.IUntitledEditorService);
            // Services we contribute
            this.instantiationService.addSingleton(partService_1.IPartService, this);
            // Viewlet service (sidebar part)
            this.sidebarPart = new sidebarPart_1.SidebarPart(messageService, this.storageService, this.eventService, this.telemetryService, contextMenuService, this, this.keybindingService, constants_1.Identifiers.SIDEBAR_PART);
            this.toDispose.push(this.sidebarPart);
            this.toShutdown.push(this.sidebarPart);
            this.instantiationService.addSingleton(viewletService_1.IViewletService, this.sidebarPart);
            // Activity service (activitybar part)
            this.activitybarPart = new activitybarPart_1.ActivitybarPart(this.sidebarPart, messageService, this.telemetryService, this.eventService, contextMenuService, this.keybindingService, constants_1.Identifiers.ACTIVITYBAR_PART);
            this.toDispose.push(this.activitybarPart);
            this.toShutdown.push(this.activitybarPart);
            this.instantiationService.addSingleton(activityService_1.IActivityService, this.activitybarPart);
            // Editor service (editor part)
            this.editorPart = new editorPart_1.EditorPart(messageService, this.eventService, this.telemetryService, this.storageService, this, constants_1.Identifiers.EDITOR_PART);
            this.toDispose.push(this.editorPart);
            this.toShutdown.push(this.editorPart);
            this.editorService = new editorService_1.WorkbenchEditorService(this.editorPart, this.untitledEditorService);
            this.instantiationService.addSingleton(editorService_2.IWorkbenchEditorService, this.editorService);
            // Quick open service (quick open controller)
            this.quickOpen = new quickOpenController_1.QuickOpenController(this.eventService, this.storageService, this.editorService, this.sidebarPart, messageService, this.telemetryService, this.contextService, this.keybindingService);
            this.toDispose.push(this.quickOpen);
            this.toShutdown.push(this.quickOpen);
            this.instantiationService.addSingleton(quickOpenService_1.IQuickOpenService, this.quickOpen);
            // Status bar
            this.statusbarPart = new statusbarPart_1.StatusbarPart(constants_1.Identifiers.STATUSBAR_PART);
            this.toDispose.push(this.statusbarPart);
            this.toShutdown.push(this.statusbarPart);
            this.instantiationService.addSingleton(statusbarService_1.IStatusbarService, this.statusbarPart);
            // History
            this.instantiationService.addSingleton(history_2.IHistoryService, new history_1.HistoryService(this.eventService, this.editorService, this.contextService, this.quickOpen));
            // a new way to contribute services...
            var contributedServices = extensions_1.getServices();
            for (var _i = 0; _i < contributedServices.length; _i++) {
                var contributedService = contributedServices[_i];
                this.instantiationService.addSingleton(contributedService.id, contributedService.descriptor);
            }
            // Some services need to be set explicitly after all services are created
            threadService.setInstantiationService(this.instantiationService);
            this.telemetryService.setInstantiationService(this.instantiationService);
            messageService.setWorkbenchServices(this.quickOpen, this.statusbarPart);
            this.quickOpen.setInstantiationService(this.instantiationService);
            this.statusbarPart.setInstantiationService(this.instantiationService);
            this.activitybarPart.setInstantiationService(this.instantiationService);
            this.sidebarPart.setInstantiationService(this.instantiationService);
            this.editorPart.setInstantiationService(this.instantiationService);
            this.untitledEditorService.setInstantiationService(this.instantiationService);
            this.editorService.setInstantiationService(this.instantiationService);
            // Set the some services to registries that have been created eagerly
            this.keybindingService.setInstantiationService(this.instantiationService);
            platform_1.Registry.as(actionBarRegistry_1.Extensions.Actionbar).setInstantiationService(this.instantiationService);
            platform_1.Registry.as(contributions_1.Extensions.Workbench).setInstantiationService(this.instantiationService);
            platform_1.Registry.as(baseEditor_1.Extensions.Editors).setInstantiationService(this.instantiationService);
        };
        Workbench.prototype.initSettings = function () {
            // Sidebar visibility
            this.sideBarHidden = this.storageService.getBoolean(Workbench.sidebarHiddenSettingKey, storage_1.StorageScope.WORKSPACE, false);
            if (!!this.workbenchParams.options.singleFileMode) {
                this.sideBarHidden = true; // we hide sidebar in single-file-mode
            }
            var registry = platform_1.Registry.as(viewlet_1.Extensions.Viewlets);
            if (!registry.getDefaultViewletId()) {
                this.sideBarHidden = true; // can only hide sidebar if we dont have a default viewlet id
            }
            // Sidebar position
            var rawPosition = this.storageService.get(Workbench.sidebarPositionSettingKey, storage_1.StorageScope.GLOBAL, 'left');
            this.sideBarPosition = (rawPosition === 'left') ? partService_1.Position.LEFT : partService_1.Position.RIGHT;
        };
        /**
         * Returns whether the workbench has been started.
         */
        Workbench.prototype.isStarted = function () {
            return this.workbenchStarted && !this.workbenchShutdown;
        };
        /**
         * Returns whether the workbench has been fully created.
         */
        Workbench.prototype.isCreated = function () {
            return this.workbenchCreated && this.workbenchStarted;
        };
        Workbench.prototype.joinCreation = function () {
            return this.creationPromise;
        };
        Workbench.prototype.hasFocus = function (part) {
            var activeElement = document.activeElement;
            if (!activeElement) {
                return false;
            }
            var container = null;
            switch (part) {
                case partService_1.Parts.ACTIVITYBAR_PART:
                    container = this.activitybarPart.getContainer();
                    break;
                case partService_1.Parts.SIDEBAR_PART:
                    container = this.sidebarPart.getContainer();
                    break;
                case partService_1.Parts.EDITOR_PART:
                    container = this.editorPart.getContainer();
                    break;
                case partService_1.Parts.STATUSBAR_PART:
                    if (!this.statusbarPart) {
                        return false; // could be disabled by options
                    }
                    container = this.statusbarPart.getContainer();
                    break;
            }
            return DOM.isAncestor(activeElement, container.getHTMLElement());
        };
        Workbench.prototype.isVisible = function (part) {
            if (part === partService_1.Parts.SIDEBAR_PART) {
                return !this.sideBarHidden;
            }
            return true; // any other part cannot be hidden
        };
        Workbench.prototype.isSideBarHidden = function () {
            return this.sideBarHidden;
        };
        Workbench.prototype.setSideBarHidden = function (hidden, skipLayout) {
            this.sideBarHidden = hidden;
            // Adjust CSS
            if (hidden) {
                this.workbench.addClass('nosidebar');
            }
            else {
                this.workbench.removeClass('nosidebar');
            }
            // Layout
            if (!skipLayout) {
                this.workbenchLayout.layout(true);
            }
            // If sidebar becomes hidden, also hide the current active viewlet if any
            if (hidden && this.sidebarPart.getActiveViewlet()) {
                this.sidebarPart.hideActiveViewlet();
                // Pass Focus to Editor if Sidebar is now hidden
                var editor = this.editorPart.getActiveEditor();
                if (editor) {
                    editor.focus();
                }
            }
            else if (!hidden && !this.sidebarPart.getActiveViewlet()) {
                var registry = platform_1.Registry.as(viewlet_1.Extensions.Viewlets);
                var viewletToOpen = this.sidebarPart.getLastActiveViewletId() || registry.getDefaultViewletId();
                if (viewletToOpen) {
                    this.sidebarPart.openViewlet(viewletToOpen, true).done(null, errors.onUnexpectedError);
                }
            }
            // Remember in settings
            this.storageService.store(Workbench.sidebarHiddenSettingKey, hidden ? 'true' : 'false', storage_1.StorageScope.WORKSPACE);
        };
        Workbench.prototype.getSideBarPosition = function () {
            return this.sideBarPosition;
        };
        Workbench.prototype.setSideBarPosition = function (position) {
            if (this.sideBarHidden) {
                this.setSideBarHidden(false, true /* Skip Layout */);
            }
            var newPositionValue = (position === partService_1.Position.LEFT) ? 'left' : 'right';
            var oldPositionValue = (this.sideBarPosition === partService_1.Position.LEFT) ? 'left' : 'right';
            this.sideBarPosition = position;
            // Adjust CSS
            this.activitybarPart.getContainer().removeClass(oldPositionValue);
            this.sidebarPart.getContainer().removeClass(oldPositionValue);
            this.activitybarPart.getContainer().addClass(newPositionValue);
            this.sidebarPart.getContainer().addClass(newPositionValue);
            // Layout
            this.workbenchLayout.layout(true);
            // Remember in settings
            this.storageService.store(Workbench.sidebarPositionSettingKey, position === partService_1.Position.LEFT ? 'left' : 'right', storage_1.StorageScope.GLOBAL);
        };
        /**
         * Frees up resources of the workbench. Can only be called once and only on a workbench that was started. With the
         * optional parameter "force", the workbench can be shutdown ignoring any workbench components that might prevent
         * shutdown for user interaction (e.g. a dirty editor waiting for save to occur).
         */
        Workbench.prototype.shutdown = function (force) {
            if (this.isStarted()) {
                if (!force) {
                    this.shutdownComponents();
                }
                // Event
                this.eventService.emit(events_1.EventType.WORKBENCH_DISPOSING);
                this.workbenchShutdown = true;
                // Dispose
                this.dispose();
            }
            return null;
        };
        Workbench.prototype.dispose = function () {
            // Dispose all
            this.toDispose = lifecycle_1.disposeAll(this.toDispose);
            // Event
            this.eventService.emit(events_1.EventType.WORKBENCH_DISPOSED);
        };
        /**
         * Asks the workbench and all its UI components inside to lay out according to
         * the containers dimension the workbench is living in.
         */
        Workbench.prototype.layout = function () {
            if (this.isStarted()) {
                this.workbenchLayout.layout();
            }
        };
        Workbench.prototype.shutdownComponents = function () {
            // Pass shutdown on to each participant
            this.toShutdown.forEach(function (s) { return s.shutdown(); });
        };
        Workbench.prototype.registerEmitters = function () {
            // Part Emitters
            this.hookPartListeners(this.activitybarPart);
            this.hookPartListeners(this.editorPart);
            this.hookPartListeners(this.sidebarPart);
            // Storage Emitter
            this.toDispose.push(this.toDisposable(this.eventService.addEmitter(this.storageService)));
        };
        Workbench.prototype.hookPartListeners = function (part) {
            this.toDispose.push(this.toDisposable(this.eventService.addEmitter(part, part.getId())));
        };
        Workbench.prototype.registerListeners = function () {
            var _this = this;
            // Listen to Preference changes
            this.toDispose.push(this.toDisposable(this.eventService.addListener(storage_1.StorageEventType.STORAGE, function (e) {
                switch (e.key) {
                    case constants_1.Preferences.THEME:
                        _this.applyTheme(e.newValue);
                        break;
                }
            })));
            // Listen to editor changes
            this.toDispose.push(this.toDisposable(this.eventService.addListener(events_1.EventType.EDITOR_CLOSED, function () { return _this.onEditorOpenedOrClosed(); })));
            this.toDispose.push(this.toDisposable(this.eventService.addListener(events_1.EventType.EDITOR_OPENED, function () { return _this.onEditorOpenedOrClosed(); })));
        };
        Workbench.prototype.onEditorOpenedOrClosed = function () {
            var _this = this;
            var visibleEditors = this.editorService.getVisibleEditors().length;
            // We update the editorpart class to indicate if an editor is opened or not
            // through a delay to accomodate for fast editor switching
            if (visibleEditors === 0) {
                this.editorBackgroundDelayer.trigger(function () { return _this.editorPart.getContainer().addClass('empty'); });
            }
            else {
                this.editorBackgroundDelayer.trigger(function () { return _this.editorPart.getContainer().removeClass('empty'); });
            }
        };
        Workbench.prototype.toDisposable = function (fn) {
            return {
                dispose: function () {
                    fn();
                }
            };
        };
        Workbench.prototype.createWorkbenchLayout = function () {
            var options = new layout_1.LayoutOptions();
            options.setMargin(new builder_1.Box(0, 0, 0, 0));
            this.workbenchLayout = this.instantiationService.createInstance(layout_1.WorkbenchLayout, builder_1.$(this.container), // Parent
            this.workbench, // Workbench Container
            this.activitybarPart, // Activity Bar
            this.editorPart, // Editor
            this.sidebarPart, // Sidebar
            this.statusbarPart, // Statusbar
            this.quickOpen, // Quickopen
            options // Layout Options
            );
            this.toDispose.push(this.workbenchLayout);
        };
        Workbench.prototype.createWorkbench = function () {
            // Create Workbench DIV Off-DOM
            this.workbenchContainer = builder_1.$('.monaco-workbench-container');
            this.workbench = builder_1.$().div({ 'class': 'monaco-workbench', id: constants_1.Identifiers.WORKBENCH_CONTAINER }).appendTo(this.workbenchContainer);
        };
        Workbench.prototype.renderWorkbench = function () {
            // Apply sidebar state as CSS class
            if (this.sideBarHidden) {
                this.workbench.addClass('nosidebar');
            }
            // Apply readonly state as CSS class
            if (this.workbenchParams.options.readOnly) {
                this.workbench.addClass('readonly');
            }
            // Apply no-workspace state as CSS class
            if (!this.workbenchParams.workspace) {
                this.workbench.addClass('no-workspace');
            }
            // Create Parts
            this.createActivityBarPart();
            this.createSidebarPart();
            this.createEditorPart();
            this.createStatusbarPart();
            // Create QuickOpen
            this.createQuickOpen();
            // Check theme in preferences
            var currentTheme = this.storageService.get(constants_1.Preferences.THEME, storage_1.StorageScope.GLOBAL, themes_1.DEFAULT_THEME_ID);
            // Apply theme
            this.applyTheme(currentTheme);
            // Add Workbench to DOM
            this.workbenchContainer.build(this.container);
        };
        Workbench.prototype.applyTheme = function (theme) {
            if (this.currentTheme) {
                this.workbench.removeClass(this.currentTheme);
            }
            this.currentTheme = theme || null;
            if (this.currentTheme) {
                this.workbench.addClass(this.currentTheme);
            }
        };
        Workbench.prototype.createActivityBarPart = function () {
            var activitybarPartContainer = builder_1.$(this.workbench)
                .div({
                'class': ['part', 'activitybar', this.sideBarPosition === partService_1.Position.LEFT ? 'left' : 'right'],
                id: constants_1.Identifiers.ACTIVITYBAR_PART
            });
            this.activitybarPart.create(activitybarPartContainer);
        };
        Workbench.prototype.createSidebarPart = function () {
            var sidebarPartContainer = builder_1.$(this.workbench)
                .div({
                'class': ['part', 'sidebar', this.sideBarPosition === partService_1.Position.LEFT ? 'left' : 'right'],
                id: constants_1.Identifiers.SIDEBAR_PART
            });
            this.sidebarPart.create(sidebarPartContainer);
        };
        Workbench.prototype.createEditorPart = function () {
            var editorContainer = builder_1.$(this.workbench)
                .div({
                'class': ['part', 'editor', 'monaco-editor-background'],
                id: constants_1.Identifiers.EDITOR_PART
            });
            this.editorPart.create(editorContainer);
        };
        Workbench.prototype.createStatusbarPart = function () {
            var statusbarContainer = builder_1.$(this.workbench).div({
                'class': ['part', 'statusbar'],
                id: constants_1.Identifiers.STATUSBAR_PART
            });
            this.statusbarPart.create(statusbarContainer);
        };
        Workbench.prototype.createQuickOpen = function () {
            this.quickOpen.create();
        };
        Workbench.prototype.getEditorPart = function () {
            assert.ok(this.workbenchStarted, 'Workbench is not started. Call startup() first.');
            return this.editorPart;
        };
        Workbench.prototype.getSidebarPart = function () {
            assert.ok(this.workbenchStarted, 'Workbench is not started. Call startup() first.');
            return this.sidebarPart;
        };
        Workbench.prototype.getInstantiationService = function () {
            assert.ok(this.workbenchStarted, 'Workbench is not started. Call startup() first.');
            return this.instantiationService;
        };
        Workbench.prototype.addClass = function (clazz) {
            if (this.workbench) {
                this.workbench.addClass(clazz);
            }
        };
        Workbench.prototype.removeClass = function (clazz) {
            if (this.workbench) {
                this.workbench.removeClass(clazz);
            }
        };
        Workbench.sidebarPositionSettingKey = 'workbench.sidebar.position';
        Workbench.sidebarHiddenSettingKey = 'workbench.sidebar.hidden';
        return Workbench;
    })();
    exports.Workbench = Workbench;
});
//# sourceMappingURL=workbench.js.map