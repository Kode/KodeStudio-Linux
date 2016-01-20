/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
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
define(["require", "exports", 'vs/nls', 'vs/base/browser/dom', 'vs/base/browser/builder', 'vs/base/common/winjs.base', 'vs/base/common/errors', 'vs/base/common/lifecycle', 'vs/base/common/events', 'vs/workbench/browser/actionBarRegistry', 'vs/base/parts/tree/browser/treeImpl', 'vs/base/browser/ui/splitview/splitview', 'vs/workbench/common/memento', 'vs/workbench/browser/viewlet', 'vs/workbench/parts/debug/common/debug', 'vs/workbench/parts/debug/common/debugModel', 'vs/workbench/parts/debug/browser/debugViewer', 'vs/workbench/parts/debug/electron-browser/debugActions', 'vs/workbench/parts/debug/browser/debugActionItems', 'vs/platform/contextview/browser/contextView', 'vs/platform/instantiation/common/instantiation', 'vs/platform/progress/common/progress', 'vs/platform/workspace/common/workspace', 'vs/platform/telemetry/common/telemetry', 'vs/platform/message/common/message', 'vs/platform/storage/common/storage', 'vs/css!./media/debugViewlet'], function (require, exports, nls, dom, builder, winjs_base_1, errors, lifecycle, events, actionbarregistry, treeimpl, splitview, memento, viewlet, debug, model, viewer, dbgactions, dbgactionitems, contextView_1, instantiation_1, progress_1, workspace_1, telemetry_1, message_1, storage_1) {
    var IDebugService = debug.IDebugService;
    function renderViewTree(container) {
        var treeContainer = document.createElement('div');
        dom.addClass(treeContainer, 'debug-view-content');
        container.appendChild(treeContainer);
        return treeContainer;
    }
    var debugTreeOptions = {
        indentPixels: 8,
        twistiePixels: 20
    };
    var $ = builder.$;
    var VariablesView = (function (_super) {
        __extends(VariablesView, _super);
        function VariablesView(actionRunner, settings, messageService, contextMenuService, debugService, instantiationService) {
            _super.call(this, actionRunner, !!settings[VariablesView.MEMENTO], 'variablesView', messageService, contextMenuService);
            this.settings = settings;
            this.debugService = debugService;
            this.instantiationService = instantiationService;
        }
        VariablesView.prototype.renderHeader = function (container) {
            _super.prototype.renderHeader.call(this, container);
            var titleDiv = $('div.title').appendTo(container);
            $('span').text(nls.localize('variables', "Variables")).appendTo(titleDiv);
        };
        VariablesView.prototype.renderBody = function (container) {
            var _this = this;
            dom.addClass(container, 'debug-variables');
            this.treeContainer = renderViewTree(container);
            this.tree = new treeimpl.Tree(this.treeContainer, {
                dataSource: new viewer.VariablesDataSource(this.debugService),
                renderer: this.instantiationService.createInstance(viewer.VariablesRenderer),
                controller: new viewer.BaseDebugController(this.debugService, this.contextMenuService, new viewer.VariablesActionProvider(this.instantiationService))
            }, debugTreeOptions);
            var viewModel = this.debugService.getViewModel();
            this.tree.setInput(viewModel);
            var collapseAction = this.instantiationService.createInstance(viewlet.CollapseAction, this.tree, false, 'explorer-action collapse-explorer');
            this.toolBar.setActions(actionbarregistry.prepareActions([collapseAction]))();
            this.toDispose.push(viewModel.addListener2(debug.ViewModelEvents.FOCUSED_STACK_FRAME_UPDATED, function () { return _this.onFocusedStackFrameUpdated(); }));
            this.toDispose.push(this.debugService.addListener2(debug.ServiceEvents.STATE_CHANGED, function () {
                collapseAction.enabled = _this.debugService.getState() === debug.State.Running || _this.debugService.getState() === debug.State.Stopped;
            }));
        };
        VariablesView.prototype.onFocusedStackFrameUpdated = function () {
            var _this = this;
            this.tree.refresh().then(function () {
                var stackFrame = _this.debugService.getViewModel().getFocusedStackFrame();
                if (stackFrame) {
                    return stackFrame.getScopes(_this.debugService).then(function (scopes) {
                        if (scopes.length > 0) {
                            return _this.tree.expand(scopes[0]);
                        }
                    });
                }
            }).done(null, errors.onUnexpectedError);
        };
        VariablesView.prototype.shutdown = function () {
            this.settings[VariablesView.MEMENTO] = (this.state === splitview.CollapsibleState.COLLAPSED);
            _super.prototype.shutdown.call(this);
        };
        VariablesView.MEMENTO = 'variablesview.memento';
        VariablesView = __decorate([
            __param(2, message_1.IMessageService),
            __param(3, contextView_1.IContextMenuService),
            __param(4, IDebugService),
            __param(5, instantiation_1.IInstantiationService)
        ], VariablesView);
        return VariablesView;
    })(viewlet.CollapsibleViewletView);
    var WatchExpressionsView = (function (_super) {
        __extends(WatchExpressionsView, _super);
        function WatchExpressionsView(actionRunner, settings, messageService, contextMenuService, debugService, instantiationService) {
            var _this = this;
            _super.call(this, actionRunner, !!settings[WatchExpressionsView.MEMENTO], 'expressionsView', messageService, contextMenuService);
            this.settings = settings;
            this.debugService = debugService;
            this.instantiationService = instantiationService;
            this.toDispose.push(this.debugService.getModel().addListener2(debug.ModelEvents.WATCH_EXPRESSIONS_UPDATED, function (we) {
                // only expand when a new watch expression is added.
                if (we instanceof model.Expression) {
                    _this.expand();
                }
            }));
        }
        WatchExpressionsView.prototype.renderHeader = function (container) {
            _super.prototype.renderHeader.call(this, container);
            var titleDiv = $('div.title').appendTo(container);
            $('span').text(nls.localize('watch', "Watch")).appendTo(titleDiv);
        };
        WatchExpressionsView.prototype.renderBody = function (container) {
            var _this = this;
            dom.addClass(container, 'debug-watch');
            this.treeContainer = renderViewTree(container);
            var actionProvider = new viewer.WatchExpressionsActionProvider(this.instantiationService);
            this.tree = new treeimpl.Tree(this.treeContainer, {
                dataSource: new viewer.WatchExpressionsDataSource(this.debugService),
                renderer: this.instantiationService.createInstance(viewer.WatchExpressionsRenderer, actionProvider, this.actionRunner),
                controller: new viewer.WatchExpressionsController(this.debugService, this.contextMenuService, actionProvider)
            }, debugTreeOptions);
            this.tree.setInput(this.debugService.getModel());
            var addWatchExpressionAction = this.instantiationService.createInstance(dbgactions.AddWatchExpressionAction, dbgactions.AddWatchExpressionAction.ID, dbgactions.AddWatchExpressionAction.LABEL);
            var collapseAction = this.instantiationService.createInstance(viewlet.CollapseAction, this.tree, false, 'explorer-action collapse-explorer');
            var removeAllWatchExpressionsAction = this.instantiationService.createInstance(dbgactions.RemoveAllWatchExpressionsAction, dbgactions.RemoveAllWatchExpressionsAction.ID, dbgactions.RemoveAllWatchExpressionsAction.LABEL);
            this.toolBar.setActions(actionbarregistry.prepareActions([addWatchExpressionAction, collapseAction, removeAllWatchExpressionsAction]))();
            this.toDispose.push(this.debugService.getModel().addListener2(debug.ModelEvents.WATCH_EXPRESSIONS_UPDATED, function (we) { return _this.onWatchExpressionsUpdated(we); }));
            this.toDispose.push(this.debugService.getViewModel().addListener2(debug.ViewModelEvents.SELECTED_EXPRESSION_UPDATED, function (expression) {
                if (!expression || !(expression instanceof model.Expression)) {
                    return;
                }
                _this.tree.refresh(expression, false).then(function () {
                    _this.tree.setHighlight(expression);
                    var unbind = _this.tree.addListener(events.EventType.HIGHLIGHT, function (e) {
                        if (!e.highlight) {
                            _this.debugService.getViewModel().setSelectedExpression(null);
                            _this.tree.refresh(expression).done(null, errors.onUnexpectedError);
                            unbind();
                        }
                    });
                }).done(null, errors.onUnexpectedError);
            }));
        };
        WatchExpressionsView.prototype.onWatchExpressionsUpdated = function (we) {
            var _this = this;
            this.tree.refresh().done(function () {
                return we instanceof model.Expression ? _this.tree.reveal(we) : winjs_base_1.Promise.as(true);
            }, errors.onUnexpectedError);
        };
        WatchExpressionsView.prototype.shutdown = function () {
            this.settings[WatchExpressionsView.MEMENTO] = (this.state === splitview.CollapsibleState.COLLAPSED);
            _super.prototype.shutdown.call(this);
        };
        WatchExpressionsView.MEMENTO = 'watchexpressionsview.memento';
        WatchExpressionsView = __decorate([
            __param(2, message_1.IMessageService),
            __param(3, contextView_1.IContextMenuService),
            __param(4, IDebugService),
            __param(5, instantiation_1.IInstantiationService)
        ], WatchExpressionsView);
        return WatchExpressionsView;
    })(viewlet.CollapsibleViewletView);
    var CallStackView = (function (_super) {
        __extends(CallStackView, _super);
        function CallStackView(actionRunner, settings, messageService, contextMenuService, debugService, instantiationService) {
            _super.call(this, actionRunner, !!settings[CallStackView.MEMENTO], 'callStackView', messageService, contextMenuService);
            this.settings = settings;
            this.debugService = debugService;
            this.instantiationService = instantiationService;
        }
        CallStackView.prototype.renderHeader = function (container) {
            _super.prototype.renderHeader.call(this, container);
            var titleDiv = $('div.title').appendTo(container);
            $('span').text(nls.localize('callStack', "Call Stack")).appendTo(titleDiv);
        };
        CallStackView.prototype.renderBody = function (container) {
            var _this = this;
            dom.addClass(container, 'debug-call-stack');
            this.renderMessageBox(container);
            this.treeContainer = renderViewTree(container);
            this.tree = new treeimpl.Tree(this.treeContainer, {
                dataSource: new viewer.CallStackDataSource(),
                renderer: this.instantiationService.createInstance(viewer.CallStackRenderer)
            }, debugTreeOptions);
            var debugModel = this.debugService.getModel();
            this.tree.setInput(debugModel);
            this.toDispose.push(this.tree.addListener2('selection', function (e) {
                if (!e.selection.length) {
                    return;
                }
                var element = e.selection[0];
                if (!(element instanceof model.StackFrame)) {
                    return;
                }
                var stackFrame = element;
                _this.debugService.setFocusedStackFrameAndEvaluate(stackFrame);
                var isMouse = (e.payload.origin === 'mouse');
                var preserveFocus = isMouse;
                var originalEvent = e && e.payload && e.payload.originalEvent;
                if (originalEvent && isMouse && originalEvent.detail === 2) {
                    preserveFocus = false;
                    originalEvent.preventDefault(); // focus moves to editor, we need to prevent default
                }
                var sideBySide = (originalEvent && (originalEvent.ctrlKey || originalEvent.metaKey));
                _this.debugService.openOrRevealEditor(stackFrame.source, stackFrame.lineNumber, preserveFocus, sideBySide).done(null, errors.onUnexpectedError);
            }));
            this.toDispose.push(debugModel.addListener2(debug.ModelEvents.CALLSTACK_UPDATED, function () {
                _this.tree.refresh().done(null, errors.onUnexpectedError);
            }));
            this.toDispose.push(this.debugService.getViewModel().addListener2(debug.ViewModelEvents.FOCUSED_STACK_FRAME_UPDATED, function () {
                var focussedThread = _this.debugService.getModel().getThreads()[_this.debugService.getViewModel().getFocusedThreadId()];
                if (focussedThread && focussedThread.stoppedReason && focussedThread.stoppedReason !== 'step') {
                    _this.messageBox.textContent = nls.localize('debugStopped', "Paused on {0}.", focussedThread.stoppedReason);
                    focussedThread.stoppedReason === 'exception' ? _this.messageBox.classList.add('exception') : _this.messageBox.classList.remove('exception');
                    _this.messageBox.hidden = false;
                    return;
                }
                _this.messageBox.hidden = true;
            }));
            this.toDispose.push(this.debugService.getViewModel().addListener2(debug.ViewModelEvents.FOCUSED_STACK_FRAME_UPDATED, function () {
                var focused = _this.debugService.getViewModel().getFocusedStackFrame();
                if (focused) {
                    var threads = _this.debugService.getModel().getThreads();
                    for (var ref in threads) {
                        if (threads[ref].callStack.some(function (sf) { return sf === focused; })) {
                            _this.tree.expand(threads[ref]);
                        }
                    }
                    _this.tree.setFocus(focused);
                }
            }));
        };
        CallStackView.prototype.layoutBody = function (size) {
            var sizeWithRespectToMessageBox = this.messageBox && !this.messageBox.hidden ? size - 27 : size;
            _super.prototype.layoutBody.call(this, sizeWithRespectToMessageBox);
        };
        CallStackView.prototype.renderMessageBox = function (container) {
            this.messageBox = document.createElement('div');
            dom.addClass(this.messageBox, 'debug-message-box');
            this.messageBox.hidden = true;
            container.appendChild(this.messageBox);
        };
        CallStackView.prototype.shutdown = function () {
            this.settings[CallStackView.MEMENTO] = (this.state === splitview.CollapsibleState.COLLAPSED);
            _super.prototype.shutdown.call(this);
        };
        CallStackView.MEMENTO = 'callstackview.memento';
        CallStackView = __decorate([
            __param(2, message_1.IMessageService),
            __param(3, contextView_1.IContextMenuService),
            __param(4, IDebugService),
            __param(5, instantiation_1.IInstantiationService)
        ], CallStackView);
        return CallStackView;
    })(viewlet.CollapsibleViewletView);
    var BreakpointsView = (function (_super) {
        __extends(BreakpointsView, _super);
        function BreakpointsView(actionRunner, settings, messageService, contextMenuService, debugService, instantiationService) {
            var _this = this;
            _super.call(this, actionRunner, BreakpointsView.getExpandedBodySize(debugService.getModel().getBreakpoints().length + debugService.getModel().getFunctionBreakpoints().length + debugService.getModel().getExceptionBreakpoints().length), !!settings[BreakpointsView.MEMENTO], 'breakpointsView', messageService, contextMenuService);
            this.settings = settings;
            this.debugService = debugService;
            this.instantiationService = instantiationService;
            this.toDispose.push(this.debugService.getModel().addListener2(debug.ModelEvents.BREAKPOINTS_UPDATED, function () { return _this.onBreakpointsChange(); }));
        }
        BreakpointsView.prototype.renderHeader = function (container) {
            _super.prototype.renderHeader.call(this, container);
            var titleDiv = $('div.title').appendTo(container);
            $('span').text(nls.localize('breakpoints', "Breakpoints")).appendTo(titleDiv);
        };
        BreakpointsView.prototype.renderBody = function (container) {
            var _this = this;
            dom.addClass(container, 'debug-breakpoints');
            this.treeContainer = renderViewTree(container);
            var actionProvider = new viewer.BreakpointsActionProvider(this.instantiationService);
            this.tree = new treeimpl.Tree(this.treeContainer, {
                dataSource: new viewer.BreakpointsDataSource(),
                renderer: this.instantiationService.createInstance(viewer.BreakpointsRenderer, actionProvider, this.actionRunner),
                controller: new viewer.BreakpointsController(this.debugService, this.contextMenuService, actionProvider),
                sorter: {
                    compare: function (tree, element, otherElement) {
                        var first = element;
                        var second = otherElement;
                        if (first instanceof model.ExceptionBreakpoint) {
                            return -1;
                        }
                        if (second instanceof model.ExceptionBreakpoint) {
                            return 1;
                        }
                        if (first instanceof model.FunctionBreakpoint) {
                            return -1;
                        }
                        if (second instanceof model.FunctionBreakpoint) {
                            return 1;
                        }
                        if (first.source.uri.toString() !== second.source.uri.toString()) {
                            return first.source.uri.toString().localeCompare(second.source.uri.toString());
                        }
                        return first.desiredLineNumber - second.desiredLineNumber;
                    }
                }
            }, debugTreeOptions);
            var debugModel = this.debugService.getModel();
            this.tree.setInput(debugModel);
            this.toDispose.push(this.tree.addListener2('selection', function (e) {
                if (!e.selection.length) {
                    return;
                }
                var element = e.selection[0];
                if (!(element instanceof model.Breakpoint)) {
                    return;
                }
                var breakpoint = element;
                if (!breakpoint.source.inMemory) {
                    var isMouse = (e.payload.origin === 'mouse');
                    var preserveFocus = isMouse;
                    var originalEvent = e && e.payload && e.payload.originalEvent;
                    if (originalEvent && isMouse && originalEvent.detail === 2) {
                        preserveFocus = false;
                        originalEvent.preventDefault(); // focus moves to editor, we need to prevent default
                    }
                    var sideBySide = (originalEvent && (originalEvent.ctrlKey || originalEvent.metaKey));
                    _this.debugService.openOrRevealEditor(breakpoint.source, breakpoint.lineNumber, preserveFocus, sideBySide).done(null, errors.onUnexpectedError);
                }
            }));
        };
        BreakpointsView.prototype.getActions = function () {
            return [
                this.instantiationService.createInstance(dbgactions.AddFunctionBreakpointAction, dbgactions.AddFunctionBreakpointAction.ID, dbgactions.AddFunctionBreakpointAction.LABEL),
                this.instantiationService.createInstance(dbgactions.ReapplyBreakpointsAction, dbgactions.ReapplyBreakpointsAction.ID, dbgactions.ReapplyBreakpointsAction.LABEL),
                this.instantiationService.createInstance(dbgactions.ToggleBreakpointsActivatedAction, dbgactions.ToggleBreakpointsActivatedAction.ID, dbgactions.ToggleBreakpointsActivatedAction.LABEL),
                this.instantiationService.createInstance(dbgactions.RemoveAllBreakpointsAction, dbgactions.RemoveAllBreakpointsAction.ID, dbgactions.RemoveAllBreakpointsAction.LABEL)
            ];
        };
        BreakpointsView.prototype.onBreakpointsChange = function () {
            var model = this.debugService.getModel();
            this.expandedBodySize = BreakpointsView.getExpandedBodySize(model.getBreakpoints().length + model.getExceptionBreakpoints().length + model.getFunctionBreakpoints().length);
            if (this.tree) {
                this.tree.refresh();
            }
        };
        BreakpointsView.getExpandedBodySize = function (length) {
            return Math.min(BreakpointsView.MAX_VISIBLE_FILES, length) * 22;
        };
        BreakpointsView.prototype.shutdown = function () {
            this.settings[BreakpointsView.MEMENTO] = (this.state === splitview.CollapsibleState.COLLAPSED);
            _super.prototype.shutdown.call(this);
        };
        BreakpointsView.MAX_VISIBLE_FILES = 9;
        BreakpointsView.MEMENTO = 'breakopintsview.memento';
        BreakpointsView = __decorate([
            __param(2, message_1.IMessageService),
            __param(3, contextView_1.IContextMenuService),
            __param(4, IDebugService),
            __param(5, instantiation_1.IInstantiationService)
        ], BreakpointsView);
        return BreakpointsView;
    })(viewlet.AdaptiveCollapsibleViewletView);
    var DebugViewlet = (function (_super) {
        __extends(DebugViewlet, _super);
        function DebugViewlet(telemetryService, progressService, debugService, instantiationService, contextService, storageService) {
            var _this = this;
            _super.call(this, debug.VIEWLET_ID, telemetryService);
            this.progressService = progressService;
            this.debugService = debugService;
            this.instantiationService = instantiationService;
            this.contextService = contextService;
            this.progressRunner = null;
            this.viewletSettings = this.getMemento(storageService, memento.Scope.WORKSPACE);
            this.views = [];
            this.toDispose = [];
            this.toDispose.push(this.debugService.addListener2(debug.ServiceEvents.STATE_CHANGED, function () {
                _this.onDebugServiceStateChange();
            }));
        }
        // viewlet
        DebugViewlet.prototype.create = function (parent) {
            var _this = this;
            _super.prototype.create.call(this, parent);
            this.$el = parent.div().addClass('debug-viewlet');
            if (this.contextService.getWorkspace()) {
                var actionRunner = this.getActionRunner();
                this.views.push(this.instantiationService.createInstance(VariablesView, actionRunner, this.viewletSettings));
                this.views.push(this.instantiationService.createInstance(WatchExpressionsView, actionRunner, this.viewletSettings));
                this.views.push(this.instantiationService.createInstance(CallStackView, actionRunner, this.viewletSettings));
                this.views.push(this.instantiationService.createInstance(BreakpointsView, actionRunner, this.viewletSettings));
                this.splitView = new splitview.SplitView(this.$el.getHTMLElement());
                this.toDispose.push(this.splitView);
                this.views.forEach(function (v) { return _this.splitView.addView(v); });
            }
            else {
                this.$el.append($([
                    '<div class="noworkspace-view">',
                    '<p>', nls.localize('noWorkspace', "There is no currently opened folder."), '</p>',
                    '<p>', nls.localize('pleaseRestartToDebug', "Open a folder in order to start debugging."), '</p>',
                    '</div>'
                ].join('')));
            }
            return winjs_base_1.Promise.as(null);
        };
        DebugViewlet.prototype.layout = function (dimension) {
            if (this.splitView) {
                this.splitView.layout(dimension.height);
            }
        };
        DebugViewlet.prototype.getActions = function () {
            var _this = this;
            if (this.debugService.getState() === debug.State.Disabled) {
                return [];
            }
            if (!this.actions) {
                this.actions = [
                    this.instantiationService.createInstance(dbgactions.StartDebugAction, dbgactions.StartDebugAction.ID, dbgactions.StartDebugAction.LABEL),
                    this.instantiationService.createInstance(dbgactions.SelectConfigAction, dbgactions.SelectConfigAction.ID, dbgactions.SelectConfigAction.LABEL),
                    this.instantiationService.createInstance(dbgactions.ConfigureAction, dbgactions.ConfigureAction.ID, dbgactions.ConfigureAction.LABEL),
                    this.instantiationService.createInstance(dbgactions.OpenReplAction, dbgactions.OpenReplAction.ID, dbgactions.OpenReplAction.LABEL)
                ];
                this.actions.forEach(function (a) {
                    _this.toDispose.push(a);
                });
            }
            return this.actions;
        };
        DebugViewlet.prototype.getActionItem = function (action) {
            if (action.id === dbgactions.SelectConfigAction.ID) {
                return this.instantiationService.createInstance(dbgactionitems.SelectConfigActionItem, action);
            }
            return null;
        };
        DebugViewlet.prototype.getSecondaryActions = function () {
            return [];
        };
        DebugViewlet.prototype.onDebugServiceStateChange = function () {
            if (this.progressRunner) {
                this.progressRunner.done();
            }
            if (this.debugService.getState() === debug.State.Initializing) {
                this.progressRunner = this.progressService.show(true);
            }
            else {
                this.progressRunner = null;
            }
        };
        DebugViewlet.prototype.dispose = function () {
            this.toDispose = lifecycle.disposeAll(this.toDispose);
            _super.prototype.dispose.call(this);
        };
        DebugViewlet.prototype.shutdown = function () {
            this.views.forEach(function (v) { return v.shutdown(); });
            _super.prototype.shutdown.call(this);
        };
        DebugViewlet = __decorate([
            __param(0, telemetry_1.ITelemetryService),
            __param(1, progress_1.IProgressService),
            __param(2, IDebugService),
            __param(3, instantiation_1.IInstantiationService),
            __param(4, workspace_1.IWorkspaceContextService),
            __param(5, storage_1.IStorageService)
        ], DebugViewlet);
        return DebugViewlet;
    })(viewlet.Viewlet);
    exports.DebugViewlet = DebugViewlet;
});
//# sourceMappingURL=debugViewlet.js.map