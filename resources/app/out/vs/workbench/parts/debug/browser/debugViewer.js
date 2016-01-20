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
define(["require", "exports", 'vs/nls', 'vs/base/common/winjs.base', 'vs/base/common/lifecycle', 'vs/base/common/keyCodes', 'vs/base/common/paths', 'vs/base/common/async', 'vs/base/common/errors', 'vs/base/common/strings', 'vs/base/common/platform', 'vs/base/browser/dom', 'vs/base/common/labels', 'vs/base/browser/ui/actionbar/actionbar', 'vs/base/browser/ui/inputbox/inputBox', 'vs/base/parts/tree/browser/treeDefaults', 'vs/workbench/parts/debug/common/debug', 'vs/workbench/parts/debug/common/debugModel', 'vs/workbench/parts/debug/common/debugViewModel', 'vs/workbench/parts/debug/electron-browser/debugActions', 'vs/platform/contextview/browser/contextView', 'vs/platform/workspace/common/workspace', 'vs/platform/message/common/message'], function (require, exports, nls, winjs_base_1, lifecycle, keyCodes_1, paths, async, errors, strings, platform_1, dom, labels, actionbar, inputbox, treedefaults, debug, model, viewmodel, debugactions, contextView_1, workspace_1, message_1) {
    var $ = dom.emmet;
    var booleanRegex = /^true|false$/i;
    var stringRegex = /^(['"]).*\1$/;
    function renderExpressionValue(arg2, debugInactive, container) {
        var value = typeof arg2 === 'string' ? arg2 : arg2.value;
        // remove stale classes
        container.className = 'value';
        // when resolving expressions we represent errors from the server as a variable with name === null.
        if (value === null || ((arg2 instanceof model.Expression || arg2 instanceof model.Variable) && !arg2.available)) {
            dom.addClass(container, 'unavailable');
            debugInactive ? dom.removeClass(container, 'error') : dom.addClass(container, 'error');
        }
        else if (!isNaN(+value)) {
            dom.addClass(container, 'number');
        }
        else if (booleanRegex.test(value)) {
            dom.addClass(container, 'boolean');
        }
        else if (stringRegex.test(value)) {
            dom.addClass(container, 'string');
        }
        container.textContent = value;
        container.title = value;
    }
    exports.renderExpressionValue = renderExpressionValue;
    function renderVariable(tree, variable, data, debugInactive, showChanged) {
        if (variable.available) {
            data.name.textContent = variable.name + ":";
        }
        if (variable.value) {
            renderExpressionValue(variable, debugInactive, data.value);
            if (variable.valueChanged && showChanged) {
                // value changed color has priority over other colors.
                data.value.className = 'value changed';
            }
        }
        else {
            data.value.textContent = '';
            data.value.title = '';
        }
    }
    exports.renderVariable = renderVariable;
    function renderRenameBox(debugService, contextViewService, tree, element, container, placeholder) {
        var inputBoxContainer = dom.append(container, $('.inputBoxContainer'));
        var inputBox = new inputbox.InputBox(inputBoxContainer, contextViewService, {
            validationOptions: {
                validation: null,
                showMessage: false
            },
            placeholder: placeholder
        });
        inputBox.value = element.name ? element.name : '';
        inputBox.focus();
        var disposed = false;
        var toDispose = [inputBox];
        var wrapUp = async.once(function (renamed) {
            if (!disposed) {
                disposed = true;
                if (element instanceof model.Expression && renamed && inputBox.value) {
                    debugService.renameWatchExpression(element.getId(), inputBox.value).done(null, errors.onUnexpectedError);
                }
                else if (element instanceof model.Expression && !element.name) {
                    debugService.clearWatchExpressions(element.getId());
                }
                else if (element instanceof model.FunctionBreakpoint && renamed && inputBox.value) {
                    debugService.renameFunctionBreakpoint(element.getId(), inputBox.value).done(null, errors.onUnexpectedError);
                }
                else if (element instanceof model.FunctionBreakpoint && !element.name) {
                    debugService.removeFunctionBreakpoints(element.getId()).done(null, errors.onUnexpectedError);
                }
                tree.clearHighlight();
                tree.DOMFocus();
                // need to remove the input box since this template will be reused.
                container.removeChild(inputBoxContainer);
                lifecycle.disposeAll(toDispose);
            }
        });
        toDispose.push(dom.addStandardDisposableListener(inputBox.inputElement, 'keydown', function (e) {
            var isEscape = e.equals(keyCodes_1.CommonKeybindings.ESCAPE);
            var isEnter = e.equals(keyCodes_1.CommonKeybindings.ENTER);
            if (isEscape || isEnter) {
                wrapUp(isEnter);
            }
        }));
        toDispose.push(dom.addDisposableListener(inputBox.inputElement, 'blur', function () {
            wrapUp(true);
        }));
    }
    var BaseDebugController = (function (_super) {
        __extends(BaseDebugController, _super);
        function BaseDebugController(debugService, contextMenuService, actionProvider, focusOnContextMenu) {
            if (focusOnContextMenu === void 0) { focusOnContextMenu = true; }
            _super.call(this);
            this.debugService = debugService;
            this.contextMenuService = contextMenuService;
            this.actionProvider = actionProvider;
            this.focusOnContextMenu = focusOnContextMenu;
            if (platform_1.isMacintosh) {
                this.downKeyBindingDispatcher.set(keyCodes_1.CommonKeybindings.CTRLCMD_BACKSPACE, this.onDelete.bind(this));
            }
            else {
                this.downKeyBindingDispatcher.set(keyCodes_1.CommonKeybindings.DELETE, this.onDelete.bind(this));
                this.downKeyBindingDispatcher.set(keyCodes_1.CommonKeybindings.SHIFT_DELETE, this.onDelete.bind(this));
            }
        }
        BaseDebugController.prototype.onContextMenu = function (tree, element, event) {
            var _this = this;
            if (event.target && event.target.tagName && event.target.tagName.toLowerCase() === 'input') {
                return false;
            }
            event.preventDefault();
            event.stopPropagation();
            if (this.focusOnContextMenu) {
                tree.setFocus(element);
            }
            if (this.actionProvider.hasSecondaryActions(tree, element)) {
                var anchor = { x: event.posx + 1, y: event.posy };
                this.contextMenuService.showContextMenu({
                    getAnchor: function () { return anchor; },
                    getActions: function () { return _this.actionProvider.getSecondaryActions(tree, element); },
                    onHide: function (wasCancelled) {
                        if (wasCancelled) {
                            tree.DOMFocus();
                        }
                    },
                    getActionsContext: function () { return element; }
                });
                return true;
            }
            return false;
        };
        BaseDebugController.prototype.onDelete = function (tree, event) {
            return false;
        };
        return BaseDebugController;
    })(treedefaults.DefaultController);
    exports.BaseDebugController = BaseDebugController;
    // call stack
    var CallStackDataSource = (function () {
        function CallStackDataSource() {
        }
        CallStackDataSource.prototype.getId = function (tree, element) {
            return element.getId();
        };
        CallStackDataSource.prototype.hasChildren = function (tree, element) {
            return element instanceof model.Model || element instanceof model.Thread;
        };
        CallStackDataSource.prototype.getChildren = function (tree, element) {
            if (element instanceof model.Thread) {
                return winjs_base_1.Promise.as(element.callStack);
            }
            var threads = element.getThreads();
            var threadsArray = [];
            Object.keys(threads).forEach(function (threadId) {
                threadsArray.push(threads[threadId]);
            });
            if (threadsArray.length === 1) {
                return winjs_base_1.Promise.as(threadsArray[0].callStack);
            }
            else {
                return winjs_base_1.Promise.as(threadsArray);
            }
        };
        CallStackDataSource.prototype.getParent = function (tree, element) {
            return winjs_base_1.Promise.as(null);
        };
        return CallStackDataSource;
    })();
    exports.CallStackDataSource = CallStackDataSource;
    var CallStackRenderer = (function () {
        function CallStackRenderer(contextService) {
            this.contextService = contextService;
            // noop
        }
        CallStackRenderer.prototype.getHeight = function (tree, element) {
            return 22;
        };
        CallStackRenderer.prototype.getTemplateId = function (tree, element) {
            if (element instanceof model.Thread) {
                return CallStackRenderer.THREAD_TEMPLATE_ID;
            }
            if (element instanceof model.StackFrame) {
                return CallStackRenderer.STACK_FRAME_TEMPLATE_ID;
            }
            return null;
        };
        CallStackRenderer.prototype.renderTemplate = function (tree, templateId, container) {
            if (templateId === CallStackRenderer.THREAD_TEMPLATE_ID) {
                var data_1 = Object.create(null);
                data_1.name = dom.append(container, $('.thread'));
                return data_1;
            }
            var data = Object.create(null);
            data.stackFrame = dom.append(container, $('.stack-frame'));
            data.label = dom.append(data.stackFrame, $('span.label'));
            data.file = dom.append(data.stackFrame, $('.file'));
            data.fileName = dom.append(data.file, $('span.file-name'));
            data.lineNumber = dom.append(data.file, $('span.line-number'));
            return data;
        };
        CallStackRenderer.prototype.renderElement = function (tree, element, templateId, templateData) {
            if (templateId === CallStackRenderer.THREAD_TEMPLATE_ID) {
                this.renderThread(element, templateData);
            }
            else {
                this.renderStackFrame(element, templateData);
            }
        };
        CallStackRenderer.prototype.renderThread = function (thread, data) {
            data.name.textContent = thread.name;
        };
        CallStackRenderer.prototype.renderStackFrame = function (stackFrame, data) {
            stackFrame.source.available ? dom.removeClass(data.stackFrame, 'disabled') : dom.addClass(data.stackFrame, 'disabled');
            data.file.title = stackFrame.source.uri.fsPath;
            data.label.textContent = stackFrame.name;
            if (stackFrame.source.inMemory) {
                data.fileName.textContent = stackFrame.source.name;
            }
            else {
                data.fileName.textContent = labels.getPathLabel(paths.basename(stackFrame.source.uri.fsPath), this.contextService);
            }
            data.lineNumber.textContent = stackFrame.lineNumber !== undefined ? "" + stackFrame.lineNumber : '';
        };
        CallStackRenderer.prototype.disposeTemplate = function (tree, templateId, templateData) {
            // noop
        };
        CallStackRenderer.THREAD_TEMPLATE_ID = 'thread';
        CallStackRenderer.STACK_FRAME_TEMPLATE_ID = 'stackFrame';
        CallStackRenderer = __decorate([
            __param(0, workspace_1.IWorkspaceContextService)
        ], CallStackRenderer);
        return CallStackRenderer;
    })();
    exports.CallStackRenderer = CallStackRenderer;
    // variables
    var VariablesActionProvider = (function () {
        function VariablesActionProvider(instantiationService) {
            this.instantiationService = instantiationService;
        }
        VariablesActionProvider.prototype.hasActions = function (tree, element) {
            return false;
        };
        VariablesActionProvider.prototype.getActions = function (tree, element) {
            return winjs_base_1.Promise.as([]);
        };
        VariablesActionProvider.prototype.hasSecondaryActions = function (tree, element) {
            return element instanceof model.Variable;
        };
        VariablesActionProvider.prototype.getSecondaryActions = function (tree, element) {
            var actions = [];
            var variable = element;
            actions.push(this.instantiationService.createInstance(debugactions.AddToWatchExpressionsAction, debugactions.AddToWatchExpressionsAction.ID, debugactions.AddToWatchExpressionsAction.LABEL, variable));
            if (variable.reference === 0) {
                actions.push(this.instantiationService.createInstance(debugactions.CopyValueAction, debugactions.CopyValueAction.ID, debugactions.CopyValueAction.LABEL, variable));
            }
            return winjs_base_1.Promise.as(actions);
        };
        VariablesActionProvider.prototype.getActionItem = function (tree, element, action) {
            return null;
        };
        return VariablesActionProvider;
    })();
    exports.VariablesActionProvider = VariablesActionProvider;
    var VariablesDataSource = (function () {
        function VariablesDataSource(debugService) {
            this.debugService = debugService;
            // noop
        }
        VariablesDataSource.prototype.getId = function (tree, element) {
            return element.getId();
        };
        VariablesDataSource.prototype.hasChildren = function (tree, element) {
            if (element instanceof viewmodel.ViewModel || element instanceof model.Scope) {
                return true;
            }
            var variable = element;
            return variable.reference !== 0 && !strings.equalsIgnoreCase(variable.value, 'null');
        };
        VariablesDataSource.prototype.getChildren = function (tree, element) {
            if (element instanceof viewmodel.ViewModel) {
                var focusedStackFrame = element.getFocusedStackFrame();
                return focusedStackFrame ? focusedStackFrame.getScopes(this.debugService) : winjs_base_1.Promise.as([]);
            }
            var scope = element;
            return scope.getChildren(this.debugService);
        };
        VariablesDataSource.prototype.getParent = function (tree, element) {
            return winjs_base_1.Promise.as(null);
        };
        return VariablesDataSource;
    })();
    exports.VariablesDataSource = VariablesDataSource;
    var VariablesRenderer = (function () {
        function VariablesRenderer(debugService) {
            this.debugService = debugService;
            // noop
        }
        VariablesRenderer.prototype.getHeight = function (tree, element) {
            return 22;
        };
        VariablesRenderer.prototype.getTemplateId = function (tree, element) {
            if (element instanceof model.Scope) {
                return VariablesRenderer.SCOPE_TEMPLATE_ID;
            }
            if (element instanceof model.Expression) {
                return VariablesRenderer.VARIABLE_TEMPLATE_ID;
            }
            return null;
        };
        VariablesRenderer.prototype.renderTemplate = function (tree, templateId, container) {
            if (templateId === VariablesRenderer.SCOPE_TEMPLATE_ID) {
                var data_2 = Object.create(null);
                data_2.name = dom.append(container, $('.scope'));
                return data_2;
            }
            var data = Object.create(null);
            data.expression = dom.append(container, $(platform_1.isMacintosh ? '.expression.mac' : '.expression.win-linux'));
            data.name = dom.append(data.expression, $('span.name'));
            data.value = dom.append(data.expression, $('span.value'));
            return data;
        };
        VariablesRenderer.prototype.renderElement = function (tree, element, templateId, templateData) {
            if (templateId === VariablesRenderer.SCOPE_TEMPLATE_ID) {
                this.renderScope(element, templateData);
            }
            else {
                renderVariable(tree, element, templateData, this.debugService.getState() === debug.State.Inactive, true);
            }
        };
        VariablesRenderer.prototype.renderScope = function (scope, data) {
            data.name.textContent = scope.name;
        };
        VariablesRenderer.prototype.disposeTemplate = function (tree, templateId, templateData) {
            // noop
        };
        VariablesRenderer.SCOPE_TEMPLATE_ID = 'scope';
        VariablesRenderer.VARIABLE_TEMPLATE_ID = 'variable';
        VariablesRenderer = __decorate([
            __param(0, debug.IDebugService)
        ], VariablesRenderer);
        return VariablesRenderer;
    })();
    exports.VariablesRenderer = VariablesRenderer;
    // watch expressions
    var WatchExpressionsActionProvider = (function () {
        function WatchExpressionsActionProvider(instantiationService) {
            this.instantiationService = instantiationService;
        }
        WatchExpressionsActionProvider.prototype.hasActions = function (tree, element) {
            return element instanceof model.Expression && element.name;
        };
        WatchExpressionsActionProvider.prototype.hasSecondaryActions = function (tree, element) {
            return true;
        };
        WatchExpressionsActionProvider.prototype.getActions = function (tree, element) {
            return winjs_base_1.Promise.as(this.getExpressionActions());
        };
        WatchExpressionsActionProvider.prototype.getExpressionActions = function () {
            return [this.instantiationService.createInstance(debugactions.RemoveWatchExpressionAction, debugactions.RemoveWatchExpressionAction.ID, debugactions.RemoveWatchExpressionAction.LABEL)];
        };
        WatchExpressionsActionProvider.prototype.getSecondaryActions = function (tree, element) {
            var actions = [];
            if (element instanceof model.Expression) {
                var expression = element;
                actions.push(this.instantiationService.createInstance(debugactions.AddWatchExpressionAction, debugactions.AddWatchExpressionAction.ID, debugactions.AddWatchExpressionAction.LABEL));
                actions.push(this.instantiationService.createInstance(debugactions.RenameWatchExpressionAction, debugactions.RenameWatchExpressionAction.ID, debugactions.RenameWatchExpressionAction.LABEL, expression));
                if (expression.reference === 0) {
                    actions.push(this.instantiationService.createInstance(debugactions.CopyValueAction, debugactions.CopyValueAction.ID, debugactions.CopyValueAction.LABEL, expression.value));
                }
                actions.push(new actionbar.Separator());
                actions.push(this.instantiationService.createInstance(debugactions.RemoveWatchExpressionAction, debugactions.RemoveWatchExpressionAction.ID, debugactions.RemoveWatchExpressionAction.LABEL));
                actions.push(this.instantiationService.createInstance(debugactions.RemoveAllWatchExpressionsAction, debugactions.RemoveAllWatchExpressionsAction.ID, debugactions.RemoveAllWatchExpressionsAction.LABEL));
            }
            else {
                actions.push(this.instantiationService.createInstance(debugactions.AddWatchExpressionAction, debugactions.AddWatchExpressionAction.ID, debugactions.AddWatchExpressionAction.LABEL));
                if (element instanceof model.Variable) {
                    var variable = element;
                    if (variable.reference === 0) {
                        actions.push(this.instantiationService.createInstance(debugactions.CopyValueAction, debugactions.CopyValueAction.ID, debugactions.CopyValueAction.LABEL, variable.value));
                    }
                    actions.push(new actionbar.Separator());
                }
                actions.push(this.instantiationService.createInstance(debugactions.RemoveAllWatchExpressionsAction, debugactions.RemoveAllWatchExpressionsAction.ID, debugactions.RemoveAllWatchExpressionsAction.LABEL));
            }
            return winjs_base_1.Promise.as(actions);
        };
        WatchExpressionsActionProvider.prototype.getActionItem = function (tree, element, action) {
            return null;
        };
        return WatchExpressionsActionProvider;
    })();
    exports.WatchExpressionsActionProvider = WatchExpressionsActionProvider;
    var WatchExpressionsDataSource = (function () {
        function WatchExpressionsDataSource(debugService) {
            this.debugService = debugService;
            // noop
        }
        WatchExpressionsDataSource.prototype.getId = function (tree, element) {
            return element.getId();
        };
        WatchExpressionsDataSource.prototype.hasChildren = function (tree, element) {
            if (element instanceof model.Model) {
                return true;
            }
            var watchExpression = element;
            return watchExpression.reference !== 0 && !strings.equalsIgnoreCase(watchExpression.value, 'null');
        };
        WatchExpressionsDataSource.prototype.getChildren = function (tree, element) {
            if (element instanceof model.Model) {
                return winjs_base_1.Promise.as(element.getWatchExpressions());
            }
            var expression = element;
            return expression.getChildren(this.debugService);
        };
        WatchExpressionsDataSource.prototype.getParent = function (tree, element) {
            return winjs_base_1.Promise.as(null);
        };
        return WatchExpressionsDataSource;
    })();
    exports.WatchExpressionsDataSource = WatchExpressionsDataSource;
    var WatchExpressionsRenderer = (function () {
        function WatchExpressionsRenderer(actionProvider, actionRunner, messageService, debugService, contextViewService) {
            this.actionRunner = actionRunner;
            this.messageService = messageService;
            this.debugService = debugService;
            this.contextViewService = contextViewService;
            this.toDispose = [];
            this.actionProvider = actionProvider;
        }
        WatchExpressionsRenderer.prototype.getHeight = function (tree, element) {
            return 22;
        };
        WatchExpressionsRenderer.prototype.getTemplateId = function (tree, element) {
            if (element instanceof model.Expression) {
                return WatchExpressionsRenderer.WATCH_EXPRESSION_TEMPLATE_ID;
            }
            return WatchExpressionsRenderer.VARIABLE_TEMPLATE_ID;
        };
        WatchExpressionsRenderer.prototype.renderTemplate = function (tree, templateId, container) {
            var data = Object.create(null);
            if (templateId === WatchExpressionsRenderer.WATCH_EXPRESSION_TEMPLATE_ID) {
                data.actionBar = new actionbar.ActionBar(container, { actionRunner: this.actionRunner });
                data.actionBar.push(this.actionProvider.getExpressionActions(), { icon: true, label: false });
            }
            data.expression = dom.append(container, $(platform_1.isMacintosh ? '.expression.mac' : '.expression.win-linux'));
            data.name = dom.append(data.expression, $('span.name'));
            data.value = dom.append(data.expression, $('span.value'));
            return data;
        };
        WatchExpressionsRenderer.prototype.renderElement = function (tree, element, templateId, templateData) {
            if (templateId === WatchExpressionsRenderer.WATCH_EXPRESSION_TEMPLATE_ID) {
                this.renderWatchExpression(tree, element, templateData);
            }
            else {
                this.renderExpression(tree, element, templateData);
            }
        };
        WatchExpressionsRenderer.prototype.renderWatchExpression = function (tree, watchExpression, data) {
            var selectedExpression = this.debugService.getViewModel().getSelectedExpression();
            if ((selectedExpression instanceof model.Expression && selectedExpression.getId() === watchExpression.getId()) || (watchExpression instanceof model.Expression && !watchExpression.name)) {
                renderRenameBox(this.debugService, this.contextViewService, tree, watchExpression, data.expression, nls.localize('watchExpressionPlaceholder', "Expression to watch"));
            }
            data.actionBar.context = watchExpression;
            this.renderExpression(tree, watchExpression, data);
        };
        WatchExpressionsRenderer.prototype.renderExpression = function (tree, expression, data) {
            data.name.textContent = expression.name + ":";
            if (expression.value) {
                renderExpressionValue(expression, this.debugService.getState() === debug.State.Inactive, data.value);
            }
        };
        WatchExpressionsRenderer.prototype.disposeTemplate = function (tree, templateId, templateData) {
            // noop
        };
        WatchExpressionsRenderer.prototype.dispose = function () {
            this.toDispose = lifecycle.disposeAll(this.toDispose);
        };
        WatchExpressionsRenderer.WATCH_EXPRESSION_TEMPLATE_ID = 'watchExpression';
        WatchExpressionsRenderer.VARIABLE_TEMPLATE_ID = 'variables';
        WatchExpressionsRenderer = __decorate([
            __param(2, message_1.IMessageService),
            __param(3, debug.IDebugService),
            __param(4, contextView_1.IContextViewService)
        ], WatchExpressionsRenderer);
        return WatchExpressionsRenderer;
    })();
    exports.WatchExpressionsRenderer = WatchExpressionsRenderer;
    var WatchExpressionsController = (function (_super) {
        __extends(WatchExpressionsController, _super);
        function WatchExpressionsController(debugService, contextMenuService, actionProvider) {
            _super.call(this, debugService, contextMenuService, actionProvider);
            if (platform_1.isMacintosh) {
                this.downKeyBindingDispatcher.set(keyCodes_1.CommonKeybindings.ENTER, this.onRename.bind(this));
            }
            else {
                this.downKeyBindingDispatcher.set(keyCodes_1.CommonKeybindings.F2, this.onRename.bind(this));
            }
        }
        /* protected */ WatchExpressionsController.prototype.onLeftClick = function (tree, element, event) {
            // double click on primitive value: open input box to be able to select and copy value.
            if (element instanceof model.Expression && event.detail === 2) {
                var expression = element;
                if (expression.reference === 0) {
                    this.debugService.getViewModel().setSelectedExpression(expression);
                }
                return true;
            }
            return _super.prototype.onLeftClick.call(this, tree, element, event);
        };
        WatchExpressionsController.prototype.onRename = function (tree, event) {
            var element = tree.getFocus();
            if (element instanceof model.Expression) {
                var watchExpression = element;
                if (watchExpression.reference === 0) {
                    this.debugService.getViewModel().setSelectedExpression(watchExpression);
                }
                return true;
            }
            return false;
        };
        WatchExpressionsController.prototype.onDelete = function (tree, event) {
            var element = tree.getFocus();
            if (element instanceof model.Expression) {
                var we = element;
                this.debugService.clearWatchExpressions(we.getId());
                return true;
            }
            return false;
        };
        return WatchExpressionsController;
    })(BaseDebugController);
    exports.WatchExpressionsController = WatchExpressionsController;
    // breakpoints
    var BreakpointsActionProvider = (function () {
        function BreakpointsActionProvider(instantiationService) {
            this.instantiationService = instantiationService;
            // noop
        }
        BreakpointsActionProvider.prototype.hasActions = function (tree, element) {
            return element instanceof model.Breakpoint;
        };
        BreakpointsActionProvider.prototype.hasSecondaryActions = function (tree, element) {
            return element instanceof model.Breakpoint || element instanceof model.ExceptionBreakpoint || element instanceof model.FunctionBreakpoint;
        };
        BreakpointsActionProvider.prototype.getActions = function (tree, element) {
            if (element instanceof model.Breakpoint) {
                return winjs_base_1.Promise.as(this.getBreakpointActions());
            }
            return winjs_base_1.Promise.as([]);
        };
        BreakpointsActionProvider.prototype.getBreakpointActions = function () {
            return [this.instantiationService.createInstance(debugactions.RemoveBreakpointAction, debugactions.RemoveBreakpointAction.ID, debugactions.RemoveBreakpointAction.LABEL)];
        };
        BreakpointsActionProvider.prototype.getSecondaryActions = function (tree, element) {
            var actions = [this.instantiationService.createInstance(debugactions.ToggleEnablementAction, debugactions.ToggleEnablementAction.ID, debugactions.ToggleEnablementAction.LABEL)];
            actions.push(new actionbar.Separator());
            actions.push(this.instantiationService.createInstance(debugactions.RemoveBreakpointAction, debugactions.RemoveBreakpointAction.ID, debugactions.RemoveBreakpointAction.LABEL));
            actions.push(this.instantiationService.createInstance(debugactions.RemoveAllBreakpointsAction, debugactions.RemoveAllBreakpointsAction.ID, debugactions.RemoveAllBreakpointsAction.LABEL));
            actions.push(new actionbar.Separator());
            actions.push(this.instantiationService.createInstance(debugactions.ToggleBreakpointsActivatedAction, debugactions.ToggleBreakpointsActivatedAction.ID, debugactions.ToggleBreakpointsActivatedAction.LABEL));
            actions.push(new actionbar.Separator());
            actions.push(this.instantiationService.createInstance(debugactions.EnableAllBreakpointsAction, debugactions.EnableAllBreakpointsAction.ID, debugactions.EnableAllBreakpointsAction.LABEL));
            actions.push(this.instantiationService.createInstance(debugactions.DisableAllBreakpointsAction, debugactions.DisableAllBreakpointsAction.ID, debugactions.DisableAllBreakpointsAction.LABEL));
            actions.push(new actionbar.Separator());
            actions.push(this.instantiationService.createInstance(debugactions.AddFunctionBreakpointAction, debugactions.AddFunctionBreakpointAction.ID, debugactions.AddFunctionBreakpointAction.LABEL));
            actions.push(new actionbar.Separator());
            actions.push(this.instantiationService.createInstance(debugactions.ReapplyBreakpointsAction, debugactions.ReapplyBreakpointsAction.ID, debugactions.ReapplyBreakpointsAction.LABEL));
            return winjs_base_1.Promise.as(actions);
        };
        BreakpointsActionProvider.prototype.getActionItem = function (tree, element, action) {
            return null;
        };
        return BreakpointsActionProvider;
    })();
    exports.BreakpointsActionProvider = BreakpointsActionProvider;
    var BreakpointsDataSource = (function () {
        function BreakpointsDataSource() {
        }
        BreakpointsDataSource.prototype.getId = function (tree, element) {
            return element.getId();
        };
        BreakpointsDataSource.prototype.hasChildren = function (tree, element) {
            return element instanceof model.Model;
        };
        BreakpointsDataSource.prototype.getChildren = function (tree, element) {
            var model = element;
            var exBreakpoints = model.getExceptionBreakpoints();
            return winjs_base_1.Promise.as(exBreakpoints.concat(model.getFunctionBreakpoints()).concat(model.getBreakpoints()));
        };
        BreakpointsDataSource.prototype.getParent = function (tree, element) {
            return winjs_base_1.Promise.as(null);
        };
        return BreakpointsDataSource;
    })();
    exports.BreakpointsDataSource = BreakpointsDataSource;
    var BreakpointsRenderer = (function () {
        function BreakpointsRenderer(actionProvider, actionRunner, messageService, contextService, debugService, contextViewService) {
            this.actionProvider = actionProvider;
            this.actionRunner = actionRunner;
            this.messageService = messageService;
            this.contextService = contextService;
            this.debugService = debugService;
            this.contextViewService = contextViewService;
            // noop
        }
        BreakpointsRenderer.prototype.getHeight = function (tree, element) {
            return 22;
        };
        BreakpointsRenderer.prototype.getTemplateId = function (tree, element) {
            if (element instanceof model.Breakpoint) {
                return BreakpointsRenderer.BREAKPOINT_TEMPLATE_ID;
            }
            if (element instanceof model.FunctionBreakpoint) {
                return BreakpointsRenderer.FUNCTION_BREAKPOINT_TEMPLATE_ID;
            }
            if (element instanceof model.ExceptionBreakpoint) {
                return BreakpointsRenderer.EXCEPTION_BREAKPOINT_TEMPLATE_ID;
            }
            return null;
        };
        BreakpointsRenderer.prototype.renderTemplate = function (tree, templateId, container) {
            var data = Object.create(null);
            if (templateId === BreakpointsRenderer.BREAKPOINT_TEMPLATE_ID || templateId === BreakpointsRenderer.FUNCTION_BREAKPOINT_TEMPLATE_ID) {
                data.actionBar = new actionbar.ActionBar(container, { actionRunner: this.actionRunner });
                data.actionBar.push(this.actionProvider.getBreakpointActions(), { icon: true, label: false });
            }
            data.breakpoint = dom.append(container, $('.breakpoint'));
            data.toDisposeBeforeRender = [];
            data.checkbox = $('input');
            data.checkbox.type = 'checkbox';
            data.checkbox.className = 'checkbox';
            dom.append(data.breakpoint, data.checkbox);
            data.name = dom.append(data.breakpoint, $('span.name'));
            if (templateId === BreakpointsRenderer.BREAKPOINT_TEMPLATE_ID) {
                data.lineNumber = dom.append(data.breakpoint, $('span.line-number'));
                data.filePath = dom.append(data.breakpoint, $('span.file-path'));
            }
            return data;
        };
        BreakpointsRenderer.prototype.renderElement = function (tree, element, templateId, templateData) {
            var _this = this;
            templateData.toDisposeBeforeRender = lifecycle.disposeAll(templateData.toDisposeBeforeRender);
            templateData.toDisposeBeforeRender.push(dom.addStandardDisposableListener(templateData.checkbox, 'change', function (e) {
                _this.debugService.toggleEnablement(element);
            }));
            if (templateId === BreakpointsRenderer.EXCEPTION_BREAKPOINT_TEMPLATE_ID) {
                this.renderExceptionBreakpoint(element, templateData);
            }
            else if (templateId === BreakpointsRenderer.FUNCTION_BREAKPOINT_TEMPLATE_ID) {
                this.renderFunctionBreakpoint(tree, element, templateData);
            }
            else {
                this.renderBreakpoint(tree, element, templateData);
            }
        };
        BreakpointsRenderer.prototype.renderExceptionBreakpoint = function (exceptionBreakpoint, data) {
            var namePascalCase = exceptionBreakpoint.name.charAt(0).toUpperCase() + exceptionBreakpoint.name.slice(1);
            data.name.textContent = namePascalCase + " exceptions";
            data.checkbox.checked = exceptionBreakpoint.enabled;
        };
        BreakpointsRenderer.prototype.renderFunctionBreakpoint = function (tree, functionBreakpoint, data) {
            if (!functionBreakpoint.name) {
                renderRenameBox(this.debugService, this.contextViewService, tree, functionBreakpoint, data.breakpoint, nls.localize('functionBreakpointPlaceholder', "Function to break on"));
            }
            else {
                this.debugService.getModel().areBreakpointsActivated() ? tree.removeTraits('disabled', [functionBreakpoint]) : tree.addTraits('disabled', [functionBreakpoint]);
                data.name.textContent = functionBreakpoint.name;
                data.checkbox.checked = functionBreakpoint.enabled;
            }
            data.actionBar.context = functionBreakpoint;
        };
        BreakpointsRenderer.prototype.renderBreakpoint = function (tree, breakpoint, data) {
            this.debugService.getModel().areBreakpointsActivated() ? tree.removeTraits('disabled', [breakpoint]) : tree.addTraits('disabled', [breakpoint]);
            data.name.textContent = labels.getPathLabel(paths.basename(breakpoint.source.uri.fsPath), this.contextService);
            data.lineNumber.textContent = breakpoint.desiredLineNumber !== breakpoint.lineNumber ? breakpoint.desiredLineNumber + ' \u2192 ' + breakpoint.lineNumber : '' + breakpoint.lineNumber;
            data.filePath.textContent = labels.getPathLabel(paths.dirname(breakpoint.source.uri.fsPath), this.contextService);
            data.checkbox.checked = breakpoint.enabled;
            data.actionBar.context = breakpoint;
            if (breakpoint.condition) {
                data.breakpoint.title = breakpoint.condition;
            }
        };
        BreakpointsRenderer.prototype.disposeTemplate = function (tree, templateId, templateData) {
            if (templateId === BreakpointsRenderer.BREAKPOINT_TEMPLATE_ID || templateId === BreakpointsRenderer.FUNCTION_BREAKPOINT_TEMPLATE_ID) {
                templateData.actionBar.dispose();
            }
        };
        BreakpointsRenderer.EXCEPTION_BREAKPOINT_TEMPLATE_ID = 'exceptionBreakpoint';
        BreakpointsRenderer.FUNCTION_BREAKPOINT_TEMPLATE_ID = 'functionBreakpoint';
        BreakpointsRenderer.BREAKPOINT_TEMPLATE_ID = 'breakpoint';
        BreakpointsRenderer = __decorate([
            __param(2, message_1.IMessageService),
            __param(3, workspace_1.IWorkspaceContextService),
            __param(4, debug.IDebugService),
            __param(5, contextView_1.IContextViewService)
        ], BreakpointsRenderer);
        return BreakpointsRenderer;
    })();
    exports.BreakpointsRenderer = BreakpointsRenderer;
    var BreakpointsController = (function (_super) {
        __extends(BreakpointsController, _super);
        function BreakpointsController() {
            _super.apply(this, arguments);
        }
        /* protected */ BreakpointsController.prototype.onLeftClick = function (tree, element, eventish, origin) {
            if (origin === void 0) { origin = 'mouse'; }
            if (element instanceof model.ExceptionBreakpoint) {
                return false;
            }
            return _super.prototype.onLeftClick.call(this, tree, element, eventish, origin);
        };
        /* protected */ BreakpointsController.prototype.onUp = function (tree, event) {
            return this.doNotFocusExceptionBreakpoint(tree, _super.prototype.onUp.call(this, tree, event));
        };
        /* protected */ BreakpointsController.prototype.onPageUp = function (tree, event) {
            return this.doNotFocusExceptionBreakpoint(tree, _super.prototype.onPageUp.call(this, tree, event));
        };
        BreakpointsController.prototype.doNotFocusExceptionBreakpoint = function (tree, upSucceeded) {
            if (upSucceeded) {
                var focus_1 = tree.getFocus();
                if (focus_1 instanceof model.ExceptionBreakpoint) {
                    tree.focusNth(2);
                }
            }
            return upSucceeded;
        };
        BreakpointsController.prototype.onDelete = function (tree, event) {
            var element = tree.getFocus();
            if (element instanceof model.Breakpoint) {
                var bp = element;
                this.debugService.toggleBreakpoint({ uri: bp.source.uri, lineNumber: bp.lineNumber }).done(null, errors.onUnexpectedError);
                return true;
            }
            else if (element instanceof model.FunctionBreakpoint) {
                var fbp = element;
                this.debugService.removeFunctionBreakpoints(fbp.getId()).done(null, errors.onUnexpectedError);
                return true;
            }
            return false;
        };
        return BreakpointsController;
    })(BaseDebugController);
    exports.BreakpointsController = BreakpointsController;
});
//# sourceMappingURL=debugViewer.js.map