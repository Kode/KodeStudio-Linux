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
define(["require", "exports", 'vs/nls', 'vs/base/common/actions', 'vs/base/common/lifecycle', 'vs/base/common/winjs.base', 'vs/workbench/browser/parts/editor/baseEditor', 'vs/editor/common/editorAction', 'vs/workbench/parts/debug/common/debug', 'vs/workbench/parts/debug/common/debugModel', 'vs/workbench/services/viewlet/common/viewletService', 'vs/platform/keybinding/common/keybindingService', 'electron'], function (require, exports, nls, actions, lifecycle, winjs_base_1, baseeditor, editorAction_1, debug, model, viewletService_1, keybindingService_1, electron_1) {
    var IDebugService = debug.IDebugService;
    var AbstractDebugAction = (function (_super) {
        __extends(AbstractDebugAction, _super);
        function AbstractDebugAction(id, label, cssClass, debugService, keybindingService) {
            var _this = this;
            _super.call(this, id, label, cssClass, false);
            this.debugService = debugService;
            this.keybindingService = keybindingService;
            this.toDispose = [];
            this.toDispose.push(this.debugService.addListener2(debug.ServiceEvents.STATE_CHANGED, function () { return _this.updateEnablement(); }));
            var keybinding = null;
            var keys = this.keybindingService.lookupKeybindings(id).map(function (k) { return _this.keybindingService.getLabelFor(k); });
            if (keys && keys.length) {
                keybinding = keys[0];
            }
            if (keybinding) {
                this.label = nls.localize('debugActionLabelAndKeybinding', "{0} ({1})", label, keybinding);
            }
            else {
                this.label = label;
            }
            this.updateEnablement();
        }
        AbstractDebugAction.prototype.run = function (e) {
            throw new Error('implement me');
        };
        AbstractDebugAction.prototype.updateEnablement = function () {
            this.enabled = this.isEnabled();
        };
        AbstractDebugAction.prototype.isEnabled = function () {
            return this.debugService.getState() !== debug.State.Disabled;
        };
        AbstractDebugAction.prototype.dispose = function () {
            this.debugService = null;
            this.toDispose = lifecycle.disposeAll(this.toDispose);
            _super.prototype.dispose.call(this);
        };
        AbstractDebugAction = __decorate([
            __param(3, IDebugService),
            __param(4, keybindingService_1.IKeybindingService)
        ], AbstractDebugAction);
        return AbstractDebugAction;
    })(actions.Action);
    exports.AbstractDebugAction = AbstractDebugAction;
    var ConfigureAction = (function (_super) {
        __extends(ConfigureAction, _super);
        function ConfigureAction(id, label, debugService, keybindingService) {
            _super.call(this, id, label, 'debug-action configure', debugService, keybindingService);
        }
        ConfigureAction.prototype.run = function (event) {
            var sideBySide = !!(event && (event.ctrlKey || event.metaKey));
            return this.debugService.openConfigFile(sideBySide);
        };
        ConfigureAction.ID = 'workbench.action.debug.configure';
        ConfigureAction.LABEL = nls.localize('configureDebug', "launch.json");
        ConfigureAction = __decorate([
            __param(2, IDebugService),
            __param(3, keybindingService_1.IKeybindingService)
        ], ConfigureAction);
        return ConfigureAction;
    })(AbstractDebugAction);
    exports.ConfigureAction = ConfigureAction;
    var SelectConfigAction = (function (_super) {
        __extends(SelectConfigAction, _super);
        function SelectConfigAction(id, label, debugService, keybindingService) {
            _super.call(this, id, label, 'debug-action select-active-config', debugService, keybindingService);
        }
        SelectConfigAction.prototype.run = function (configName) {
            return this.debugService.setConfiguration(configName);
        };
        SelectConfigAction.prototype.isEnabled = function () {
            return _super.prototype.isEnabled.call(this) && this.debugService.getState() === debug.State.Inactive;
        };
        SelectConfigAction.ID = 'workbench.debug.action.setActiveConfig';
        SelectConfigAction.LABEL = nls.localize('selectConfig', "Select Configuration");
        SelectConfigAction = __decorate([
            __param(2, IDebugService),
            __param(3, keybindingService_1.IKeybindingService)
        ], SelectConfigAction);
        return SelectConfigAction;
    })(AbstractDebugAction);
    exports.SelectConfigAction = SelectConfigAction;
    var StartDebugAction = (function (_super) {
        __extends(StartDebugAction, _super);
        function StartDebugAction(id, label, debugService, keybindingService) {
            _super.call(this, id, label, 'debug-action start', debugService, keybindingService);
            this.updateEnablement();
        }
        StartDebugAction.prototype.run = function () {
            return this.debugService.createSession();
        };
        StartDebugAction.prototype.isEnabled = function () {
            return _super.prototype.isEnabled.call(this) && this.debugService.getState() === debug.State.Inactive;
        };
        StartDebugAction.ID = 'workbench.action.debug.start';
        StartDebugAction.LABEL = nls.localize('startDebug', "Start");
        StartDebugAction = __decorate([
            __param(2, IDebugService),
            __param(3, keybindingService_1.IKeybindingService)
        ], StartDebugAction);
        return StartDebugAction;
    })(AbstractDebugAction);
    exports.StartDebugAction = StartDebugAction;
    var RestartDebugAction = (function (_super) {
        __extends(RestartDebugAction, _super);
        function RestartDebugAction(id, label, debugService, keybindingService) {
            var _this = this;
            _super.call(this, id, label, 'debug-action restart', debugService, keybindingService);
            this.updateEnablement();
            this.toDispose.push(this.debugService.addListener2(debug.ServiceEvents.STATE_CHANGED, function () {
                var session = _this.debugService.getActiveSession();
                if (session) {
                    _this.label = session.isAttach ? RestartDebugAction.RECONNECT_LABEL : RestartDebugAction.LABEL;
                }
            }));
        }
        RestartDebugAction.prototype.run = function () {
            return this.debugService.restartSession();
        };
        RestartDebugAction.prototype.isEnabled = function () {
            return _super.prototype.isEnabled.call(this) && this.debugService.getState() !== debug.State.Inactive;
        };
        RestartDebugAction.ID = 'workbench.action.debug.restart';
        RestartDebugAction.LABEL = nls.localize('restartDebug', "Restart");
        RestartDebugAction.RECONNECT_LABEL = nls.localize('reconnectDebug', "Reconnect");
        RestartDebugAction = __decorate([
            __param(2, IDebugService),
            __param(3, keybindingService_1.IKeybindingService)
        ], RestartDebugAction);
        return RestartDebugAction;
    })(AbstractDebugAction);
    exports.RestartDebugAction = RestartDebugAction;
    var StepOverDebugAction = (function (_super) {
        __extends(StepOverDebugAction, _super);
        function StepOverDebugAction(id, label, debugService, keybindingService) {
            _super.call(this, id, label, 'debug-action step-over', debugService, keybindingService);
        }
        StepOverDebugAction.prototype.run = function () {
            return this.debugService.getActiveSession().next({ threadId: this.debugService.getViewModel().getFocusedThreadId() });
        };
        StepOverDebugAction.prototype.isEnabled = function () {
            return _super.prototype.isEnabled.call(this) && this.debugService.getState() === debug.State.Stopped;
        };
        StepOverDebugAction.ID = 'workbench.action.debug.stepOver';
        StepOverDebugAction.LABEL = nls.localize('stepOverDebug', "Step Over");
        StepOverDebugAction = __decorate([
            __param(2, IDebugService),
            __param(3, keybindingService_1.IKeybindingService)
        ], StepOverDebugAction);
        return StepOverDebugAction;
    })(AbstractDebugAction);
    exports.StepOverDebugAction = StepOverDebugAction;
    var StepIntoDebugAction = (function (_super) {
        __extends(StepIntoDebugAction, _super);
        function StepIntoDebugAction(id, label, debugService, keybindingService) {
            _super.call(this, id, label, 'debug-action step-into', debugService, keybindingService);
        }
        StepIntoDebugAction.prototype.run = function () {
            return this.debugService.getActiveSession().stepIn({ threadId: this.debugService.getViewModel().getFocusedThreadId() });
        };
        StepIntoDebugAction.prototype.isEnabled = function () {
            return _super.prototype.isEnabled.call(this) && this.debugService.getState() === debug.State.Stopped;
        };
        StepIntoDebugAction.ID = 'workbench.action.debug.stepInto';
        StepIntoDebugAction.LABEL = nls.localize('stepIntoDebug', "Step Into");
        StepIntoDebugAction = __decorate([
            __param(2, IDebugService),
            __param(3, keybindingService_1.IKeybindingService)
        ], StepIntoDebugAction);
        return StepIntoDebugAction;
    })(AbstractDebugAction);
    exports.StepIntoDebugAction = StepIntoDebugAction;
    var StepOutDebugAction = (function (_super) {
        __extends(StepOutDebugAction, _super);
        function StepOutDebugAction(id, label, debugService, keybindingService) {
            _super.call(this, id, label, 'debug-action step-out', debugService, keybindingService);
        }
        StepOutDebugAction.prototype.run = function () {
            return this.debugService.getActiveSession().stepOut({ threadId: this.debugService.getViewModel().getFocusedThreadId() });
        };
        StepOutDebugAction.prototype.isEnabled = function () {
            return _super.prototype.isEnabled.call(this) && this.debugService.getState() === debug.State.Stopped;
        };
        StepOutDebugAction.ID = 'workbench.action.debug.stepOut';
        StepOutDebugAction.LABEL = nls.localize('stepOutDebug', "Step Out");
        StepOutDebugAction = __decorate([
            __param(2, IDebugService),
            __param(3, keybindingService_1.IKeybindingService)
        ], StepOutDebugAction);
        return StepOutDebugAction;
    })(AbstractDebugAction);
    exports.StepOutDebugAction = StepOutDebugAction;
    var StopDebugAction = (function (_super) {
        __extends(StopDebugAction, _super);
        function StopDebugAction(id, label, debugService, keybindingService) {
            var _this = this;
            _super.call(this, id, label, 'debug-action stop', debugService, keybindingService);
            this.toDispose.push(this.debugService.addListener2(debug.ServiceEvents.STATE_CHANGED, function () {
                var session = _this.debugService.getActiveSession();
                if (session) {
                    _this.label = session.isAttach ? StopDebugAction.DISCONNECT_LABEL : StopDebugAction.LABEL;
                }
            }));
        }
        StopDebugAction.prototype.run = function () {
            var session = this.debugService.getActiveSession();
            return session ? session.disconnect(false, true) : winjs_base_1.Promise.as(null);
        };
        StopDebugAction.prototype.isEnabled = function () {
            return _super.prototype.isEnabled.call(this) && this.debugService.getState() !== debug.State.Inactive;
        };
        StopDebugAction.ID = 'workbench.action.debug.stop';
        StopDebugAction.LABEL = nls.localize('stopDebug', "Stop");
        StopDebugAction.DISCONNECT_LABEL = nls.localize('disconnectDebug', "Disconnect");
        StopDebugAction = __decorate([
            __param(2, IDebugService),
            __param(3, keybindingService_1.IKeybindingService)
        ], StopDebugAction);
        return StopDebugAction;
    })(AbstractDebugAction);
    exports.StopDebugAction = StopDebugAction;
    var ContinueAction = (function (_super) {
        __extends(ContinueAction, _super);
        function ContinueAction(id, label, debugService, keybindingService) {
            _super.call(this, id, label, 'debug-action continue', debugService, keybindingService);
        }
        ContinueAction.prototype.run = function () {
            return this.debugService.getActiveSession().continue({ threadId: this.debugService.getViewModel().getFocusedThreadId() });
        };
        ContinueAction.prototype.isEnabled = function () {
            return _super.prototype.isEnabled.call(this) && this.debugService.getState() === debug.State.Stopped;
        };
        ContinueAction.ID = 'workbench.action.debug.continue';
        ContinueAction.LABEL = nls.localize('continueDebug', "Continue");
        ContinueAction = __decorate([
            __param(2, IDebugService),
            __param(3, keybindingService_1.IKeybindingService)
        ], ContinueAction);
        return ContinueAction;
    })(AbstractDebugAction);
    exports.ContinueAction = ContinueAction;
    var PauseAction = (function (_super) {
        __extends(PauseAction, _super);
        function PauseAction(id, label, debugService, keybindingService) {
            _super.call(this, id, label, 'debug-action pause', debugService, keybindingService);
        }
        PauseAction.prototype.run = function () {
            return this.debugService.getActiveSession().pause({ threadId: this.debugService.getViewModel().getFocusedThreadId() });
        };
        PauseAction.prototype.isEnabled = function () {
            return _super.prototype.isEnabled.call(this) && this.debugService.getState() === debug.State.Running;
        };
        PauseAction.ID = 'workbench.action.debug.pause';
        PauseAction.LABEL = nls.localize('pauseDebug', "Pause");
        PauseAction = __decorate([
            __param(2, IDebugService),
            __param(3, keybindingService_1.IKeybindingService)
        ], PauseAction);
        return PauseAction;
    })(AbstractDebugAction);
    exports.PauseAction = PauseAction;
    var RemoveBreakpointAction = (function (_super) {
        __extends(RemoveBreakpointAction, _super);
        function RemoveBreakpointAction(id, label, debugService, keybindingService) {
            _super.call(this, id, label, 'debug-action remove', debugService, keybindingService);
            this.updateEnablement();
        }
        RemoveBreakpointAction.prototype.run = function (breakpoint) {
            return breakpoint instanceof model.Breakpoint ? this.debugService.toggleBreakpoint({ uri: breakpoint.source.uri, lineNumber: breakpoint.lineNumber })
                : this.debugService.removeFunctionBreakpoints(breakpoint.getId());
        };
        RemoveBreakpointAction.ID = 'workbench.debug.viewlet.action.removeBreakpoint';
        RemoveBreakpointAction.LABEL = nls.localize('removeBreakpoint', "Remove Breakpoint");
        RemoveBreakpointAction = __decorate([
            __param(2, IDebugService),
            __param(3, keybindingService_1.IKeybindingService)
        ], RemoveBreakpointAction);
        return RemoveBreakpointAction;
    })(AbstractDebugAction);
    exports.RemoveBreakpointAction = RemoveBreakpointAction;
    var RemoveAllBreakpointsAction = (function (_super) {
        __extends(RemoveAllBreakpointsAction, _super);
        function RemoveAllBreakpointsAction(id, label, debugService, keybindingService) {
            var _this = this;
            _super.call(this, id, label, 'debug-action remove', debugService, keybindingService);
            this.toDispose.push(this.debugService.getModel().addListener2(debug.ModelEvents.BREAKPOINTS_UPDATED, function () { return _this.updateEnablement(); }));
        }
        RemoveAllBreakpointsAction.prototype.run = function () {
            return winjs_base_1.Promise.join([this.debugService.removeAllBreakpoints(), this.debugService.removeFunctionBreakpoints()]);
        };
        RemoveAllBreakpointsAction.prototype.isEnabled = function () {
            return _super.prototype.isEnabled.call(this) && (this.debugService.getModel().getBreakpoints().length > 0 || this.debugService.getModel().getFunctionBreakpoints().length > 0);
        };
        RemoveAllBreakpointsAction.ID = 'workbench.debug.viewlet.action.removeAllBreakpoints';
        RemoveAllBreakpointsAction.LABEL = nls.localize('removeAllBreakpoints', "Remove All Breakpoints");
        RemoveAllBreakpointsAction = __decorate([
            __param(2, IDebugService),
            __param(3, keybindingService_1.IKeybindingService)
        ], RemoveAllBreakpointsAction);
        return RemoveAllBreakpointsAction;
    })(AbstractDebugAction);
    exports.RemoveAllBreakpointsAction = RemoveAllBreakpointsAction;
    var ToggleEnablementAction = (function (_super) {
        __extends(ToggleEnablementAction, _super);
        function ToggleEnablementAction(id, label, debugService, keybindingService) {
            _super.call(this, id, label, 'debug-action toggle-enablement', debugService, keybindingService);
        }
        ToggleEnablementAction.prototype.run = function (element) {
            return this.debugService.toggleEnablement(element);
        };
        ToggleEnablementAction.ID = 'workbench.debug.viewlet.action.toggleBreakpointEnablement';
        ToggleEnablementAction.LABEL = nls.localize('toggleEnablement', "Enable/Disable Breakpoint");
        ToggleEnablementAction = __decorate([
            __param(2, IDebugService),
            __param(3, keybindingService_1.IKeybindingService)
        ], ToggleEnablementAction);
        return ToggleEnablementAction;
    })(AbstractDebugAction);
    exports.ToggleEnablementAction = ToggleEnablementAction;
    var EnableAllBreakpointsAction = (function (_super) {
        __extends(EnableAllBreakpointsAction, _super);
        function EnableAllBreakpointsAction(id, label, debugService, keybindingService) {
            var _this = this;
            _super.call(this, id, label, 'debug-action enable-all-breakpoints', debugService, keybindingService);
            this.toDispose.push(this.debugService.getModel().addListener2(debug.ModelEvents.BREAKPOINTS_UPDATED, function () { return _this.updateEnablement(); }));
        }
        EnableAllBreakpointsAction.prototype.run = function () {
            return this.debugService.enableOrDisableAllBreakpoints(true);
        };
        EnableAllBreakpointsAction.prototype.isEnabled = function () {
            var model = this.debugService.getModel();
            return _super.prototype.isEnabled.call(this) && model.getBreakpoints().concat(model.getFunctionBreakpoints()).concat(model.getExceptionBreakpoints()).some(function (bp) { return !bp.enabled; });
        };
        EnableAllBreakpointsAction.ID = 'workbench.debug.viewlet.action.enableAllBreakpoints';
        EnableAllBreakpointsAction.LABEL = nls.localize('enableAllBreakpoints', "Enable All Breakpoints");
        EnableAllBreakpointsAction = __decorate([
            __param(2, IDebugService),
            __param(3, keybindingService_1.IKeybindingService)
        ], EnableAllBreakpointsAction);
        return EnableAllBreakpointsAction;
    })(AbstractDebugAction);
    exports.EnableAllBreakpointsAction = EnableAllBreakpointsAction;
    var DisableAllBreakpointsAction = (function (_super) {
        __extends(DisableAllBreakpointsAction, _super);
        function DisableAllBreakpointsAction(id, label, debugService, keybindingService) {
            var _this = this;
            _super.call(this, id, label, 'debug-action disable-all-breakpoints', debugService, keybindingService);
            this.toDispose.push(this.debugService.getModel().addListener2(debug.ModelEvents.BREAKPOINTS_UPDATED, function () { return _this.updateEnablement(); }));
        }
        DisableAllBreakpointsAction.prototype.run = function () {
            return this.debugService.enableOrDisableAllBreakpoints(false);
        };
        DisableAllBreakpointsAction.prototype.isEnabled = function () {
            var model = this.debugService.getModel();
            return _super.prototype.isEnabled.call(this) && model.getBreakpoints().concat(model.getFunctionBreakpoints()).concat(model.getExceptionBreakpoints()).some(function (bp) { return bp.enabled; });
        };
        DisableAllBreakpointsAction.ID = 'workbench.debug.viewlet.action.disableAllBreakpoints';
        DisableAllBreakpointsAction.LABEL = nls.localize('disableAllBreakpoints', "Disable All Breakpoints");
        DisableAllBreakpointsAction = __decorate([
            __param(2, IDebugService),
            __param(3, keybindingService_1.IKeybindingService)
        ], DisableAllBreakpointsAction);
        return DisableAllBreakpointsAction;
    })(AbstractDebugAction);
    exports.DisableAllBreakpointsAction = DisableAllBreakpointsAction;
    var ToggleBreakpointsActivatedAction = (function (_super) {
        __extends(ToggleBreakpointsActivatedAction, _super);
        function ToggleBreakpointsActivatedAction(id, label, debugService, keybindingService) {
            var _this = this;
            _super.call(this, id, label, 'debug-action breakpoints-activate', debugService, keybindingService);
            this.updateLabel();
            this.toDispose.push(this.debugService.getModel().addListener2(debug.ModelEvents.BREAKPOINTS_UPDATED, function () {
                _this.updateLabel();
            }));
        }
        ToggleBreakpointsActivatedAction.prototype.updateLabel = function () {
            this.label = this.debugService.getModel().areBreakpointsActivated() ? ToggleBreakpointsActivatedAction.DEACTIVATE_LABEL : ToggleBreakpointsActivatedAction.ACTIVATE_LABEL;
        };
        ToggleBreakpointsActivatedAction.prototype.run = function () {
            return this.debugService.toggleBreakpointsActivated();
        };
        ToggleBreakpointsActivatedAction.ID = 'workbench.debug.viewlet.action.toggleBreakpointsActivatedAction';
        ToggleBreakpointsActivatedAction.ACTIVATE_LABEL = nls.localize('activateBreakpoints', "Activate Breakpoints");
        ToggleBreakpointsActivatedAction.DEACTIVATE_LABEL = nls.localize('deactivateBreakpoints', "Deactivate Breakpoints");
        ToggleBreakpointsActivatedAction = __decorate([
            __param(2, IDebugService),
            __param(3, keybindingService_1.IKeybindingService)
        ], ToggleBreakpointsActivatedAction);
        return ToggleBreakpointsActivatedAction;
    })(AbstractDebugAction);
    exports.ToggleBreakpointsActivatedAction = ToggleBreakpointsActivatedAction;
    var ReapplyBreakpointsAction = (function (_super) {
        __extends(ReapplyBreakpointsAction, _super);
        function ReapplyBreakpointsAction(id, label, debugService, keybindingService) {
            var _this = this;
            _super.call(this, id, label, 'debug-action refresh', debugService, keybindingService);
            this.toDispose.push(this.debugService.getModel().addListener2(debug.ModelEvents.BREAKPOINTS_UPDATED, function () { return _this.updateEnablement(); }));
        }
        ReapplyBreakpointsAction.prototype.run = function () {
            return this.debugService.sendAllBreakpoints();
        };
        ReapplyBreakpointsAction.prototype.isEnabled = function () {
            return _super.prototype.isEnabled.call(this) && !!this.debugService.getActiveSession() && this.debugService.getModel().getBreakpoints().length > 0;
        };
        ReapplyBreakpointsAction.ID = 'workbench.debug.viewlet.action.reapplyBreakpointsAction';
        ReapplyBreakpointsAction.LABEL = nls.localize('reapplyAllBreakpoints', "Reapply All Breakpoints");
        ReapplyBreakpointsAction = __decorate([
            __param(2, IDebugService),
            __param(3, keybindingService_1.IKeybindingService)
        ], ReapplyBreakpointsAction);
        return ReapplyBreakpointsAction;
    })(AbstractDebugAction);
    exports.ReapplyBreakpointsAction = ReapplyBreakpointsAction;
    var AddFunctionBreakpointAction = (function (_super) {
        __extends(AddFunctionBreakpointAction, _super);
        function AddFunctionBreakpointAction(id, label, debugService, keybindingService) {
            _super.call(this, id, label, 'debug-action add-function-breakpoint', debugService, keybindingService);
        }
        AddFunctionBreakpointAction.prototype.run = function () {
            this.debugService.addFunctionBreakpoint();
            return winjs_base_1.Promise.as(null);
        };
        AddFunctionBreakpointAction.ID = 'workbench.debug.viewlet.action.addFunctionBreakpointAction';
        AddFunctionBreakpointAction.LABEL = nls.localize('addFunctionBreakpoint', "Add Function Breakpoint");
        AddFunctionBreakpointAction = __decorate([
            __param(2, IDebugService),
            __param(3, keybindingService_1.IKeybindingService)
        ], AddFunctionBreakpointAction);
        return AddFunctionBreakpointAction;
    })(AbstractDebugAction);
    exports.AddFunctionBreakpointAction = AddFunctionBreakpointAction;
    var AddConditionalBreakpointAction = (function (_super) {
        __extends(AddConditionalBreakpointAction, _super);
        function AddConditionalBreakpointAction(id, label, editor, lineNumber, debugService, keybindingService) {
            _super.call(this, id, label, null, debugService, keybindingService);
            this.editor = editor;
            this.lineNumber = lineNumber;
        }
        AddConditionalBreakpointAction.prototype.run = function () {
            return this.debugService.editBreakpoint(this.editor, this.lineNumber);
        };
        AddConditionalBreakpointAction.ID = 'workbench.debug.viewlet.action.addConditionalBreakpointAction';
        AddConditionalBreakpointAction.LABEL = nls.localize('addConditionalBreakpoint', "Add Conditional Breakpoint");
        AddConditionalBreakpointAction = __decorate([
            __param(4, IDebugService),
            __param(5, keybindingService_1.IKeybindingService)
        ], AddConditionalBreakpointAction);
        return AddConditionalBreakpointAction;
    })(AbstractDebugAction);
    exports.AddConditionalBreakpointAction = AddConditionalBreakpointAction;
    var EditConditionalBreakpointAction = (function (_super) {
        __extends(EditConditionalBreakpointAction, _super);
        function EditConditionalBreakpointAction(id, label, editor, lineNumber, debugService, keybindingService) {
            _super.call(this, id, label, null, debugService, keybindingService);
            this.editor = editor;
            this.lineNumber = lineNumber;
        }
        EditConditionalBreakpointAction.prototype.run = function (breakpoint) {
            return this.debugService.editBreakpoint(this.editor, this.lineNumber);
        };
        EditConditionalBreakpointAction.ID = 'workbench.debug.viewlet.action.editConditionalBreakpointAction';
        EditConditionalBreakpointAction.LABEL = nls.localize('editConditionalBreakpoint', "Edit Breakpoint");
        EditConditionalBreakpointAction = __decorate([
            __param(4, IDebugService),
            __param(5, keybindingService_1.IKeybindingService)
        ], EditConditionalBreakpointAction);
        return EditConditionalBreakpointAction;
    })(AbstractDebugAction);
    exports.EditConditionalBreakpointAction = EditConditionalBreakpointAction;
    var ToggleBreakpointAction = (function (_super) {
        __extends(ToggleBreakpointAction, _super);
        function ToggleBreakpointAction(descriptor, editor, debugService) {
            _super.call(this, descriptor, editor, editorAction_1.Behaviour.TextFocus);
            this.debugService = debugService;
        }
        ToggleBreakpointAction.prototype.run = function () {
            if (this.debugService.getState() !== debug.State.Disabled) {
                var lineNumber = this.editor.getPosition().lineNumber;
                var modelUrl = this.editor.getModel().getAssociatedResource();
                if (this.debugService.canSetBreakpointsIn(this.editor.getModel(), lineNumber)) {
                    return this.debugService.toggleBreakpoint({ uri: modelUrl, lineNumber: lineNumber });
                }
            }
            return winjs_base_1.TPromise.as(null);
        };
        ToggleBreakpointAction.ID = 'editor.debug.action.toggleBreakpoint';
        ToggleBreakpointAction = __decorate([
            __param(2, IDebugService)
        ], ToggleBreakpointAction);
        return ToggleBreakpointAction;
    })(editorAction_1.EditorAction);
    exports.ToggleBreakpointAction = ToggleBreakpointAction;
    var CopyValueAction = (function (_super) {
        __extends(CopyValueAction, _super);
        function CopyValueAction(id, label, value, debugService, keybindingService) {
            _super.call(this, id, label, 'debug-action copy-value', debugService, keybindingService);
            this.value = value;
        }
        CopyValueAction.prototype.run = function () {
            var _this = this;
            if (this.value instanceof model.Variable) {
                var frameId = this.debugService.getViewModel().getFocusedStackFrame().frameId;
                var session = this.debugService.getActiveSession();
                return session.evaluate({ expression: model.getFullExpressionName(this.value, session.getType()), frameId: frameId }).then(function (result) {
                    electron_1.clipboard.writeText(result.body.result);
                }, function (err) { return electron_1.clipboard.writeText(_this.value.value); });
            }
            electron_1.clipboard.writeText(this.value);
            return winjs_base_1.Promise.as(null);
        };
        CopyValueAction.ID = 'workbench.debug.viewlet.action.copyValue';
        CopyValueAction.LABEL = nls.localize('copyValue', "Copy Value");
        CopyValueAction = __decorate([
            __param(3, IDebugService),
            __param(4, keybindingService_1.IKeybindingService)
        ], CopyValueAction);
        return CopyValueAction;
    })(AbstractDebugAction);
    exports.CopyValueAction = CopyValueAction;
    var RunToCursorAction = (function (_super) {
        __extends(RunToCursorAction, _super);
        function RunToCursorAction(descriptor, editor, debugService) {
            _super.call(this, descriptor, editor, editorAction_1.Behaviour.TextFocus);
            this.debugService = debugService;
        }
        RunToCursorAction.prototype.run = function () {
            var _this = this;
            var lineNumber = this.editor.getPosition().lineNumber;
            var uri = this.editor.getModel().getAssociatedResource();
            this.debugService.getActiveSession().addOneTimeListener(debug.SessionEvents.STOPPED, function () {
                _this.debugService.toggleBreakpoint({ uri: uri, lineNumber: lineNumber });
            });
            return this.debugService.toggleBreakpoint({ uri: uri, lineNumber: lineNumber }).then(function () {
                return _this.debugService.getActiveSession().continue({ threadId: _this.debugService.getViewModel().getFocusedThreadId() }).then(function (response) {
                    return response.success;
                });
            });
        };
        RunToCursorAction.prototype.getGroupId = function () {
            return '1_debug/1_continue';
        };
        RunToCursorAction.prototype.shouldShowInContextMenu = function () {
            if (this.debugService.getState() !== debug.State.Stopped) {
                return false;
            }
            var lineNumber = this.editor.getPosition().lineNumber;
            var uri = this.editor.getModel().getAssociatedResource();
            var bps = this.debugService.getModel().getBreakpoints().filter(function (bp) { return bp.lineNumber === lineNumber && bp.source.uri.toString() === uri.toString(); });
            // breakpoint must not be on position (no need for this action).
            return bps.length === 0;
        };
        RunToCursorAction.ID = 'editor.debug.action.runToCursor';
        RunToCursorAction = __decorate([
            __param(2, IDebugService)
        ], RunToCursorAction);
        return RunToCursorAction;
    })(editorAction_1.EditorAction);
    exports.RunToCursorAction = RunToCursorAction;
    var AddWatchExpressionAction = (function (_super) {
        __extends(AddWatchExpressionAction, _super);
        function AddWatchExpressionAction(id, label, debugService, keybindingService) {
            var _this = this;
            _super.call(this, id, label, 'debug-action add-watch-expression', debugService, keybindingService);
            this.toDispose.push(this.debugService.getModel().addListener2(debug.ModelEvents.WATCH_EXPRESSIONS_UPDATED, function () { return _this.updateEnablement(); }));
        }
        AddWatchExpressionAction.prototype.run = function () {
            return this.debugService.addWatchExpression();
        };
        AddWatchExpressionAction.prototype.isEnabled = function () {
            return _super.prototype.isEnabled.call(this) && this.debugService.getModel().getWatchExpressions().every(function (we) { return !!we.name; });
        };
        AddWatchExpressionAction.ID = 'workbench.debug.viewlet.action.addWatchExpression';
        AddWatchExpressionAction.LABEL = nls.localize('addWatchExpression', "Add Expression");
        AddWatchExpressionAction = __decorate([
            __param(2, IDebugService),
            __param(3, keybindingService_1.IKeybindingService)
        ], AddWatchExpressionAction);
        return AddWatchExpressionAction;
    })(AbstractDebugAction);
    exports.AddWatchExpressionAction = AddWatchExpressionAction;
    var SelectionToWatchExpressionsAction = (function (_super) {
        __extends(SelectionToWatchExpressionsAction, _super);
        function SelectionToWatchExpressionsAction(descriptor, editor, debugService, viewletService) {
            _super.call(this, descriptor, editor, editorAction_1.Behaviour.TextFocus);
            this.debugService = debugService;
            this.viewletService = viewletService;
        }
        SelectionToWatchExpressionsAction.prototype.run = function () {
            var _this = this;
            var text = this.editor.getModel().getValueInRange(this.editor.getSelection());
            return this.viewletService.openViewlet(debug.VIEWLET_ID).then(function () { return _this.debugService.addWatchExpression(text); });
        };
        SelectionToWatchExpressionsAction.prototype.getGroupId = function () {
            return '1_debug/3_selection_to_watch';
        };
        SelectionToWatchExpressionsAction.prototype.shouldShowInContextMenu = function () {
            var selection = this.editor.getSelection();
            var text = this.editor.getModel().getValueInRange(selection);
            return !!selection && !selection.isEmpty() && this.debugService.getState() !== debug.State.Inactive && text && /\S/.test(text);
        };
        SelectionToWatchExpressionsAction.ID = 'editor.debug.action.selectionToWatch';
        SelectionToWatchExpressionsAction = __decorate([
            __param(2, IDebugService),
            __param(3, viewletService_1.IViewletService)
        ], SelectionToWatchExpressionsAction);
        return SelectionToWatchExpressionsAction;
    })(editorAction_1.EditorAction);
    exports.SelectionToWatchExpressionsAction = SelectionToWatchExpressionsAction;
    var SelectionToReplAction = (function (_super) {
        __extends(SelectionToReplAction, _super);
        function SelectionToReplAction(descriptor, editor, debugService) {
            _super.call(this, descriptor, editor, editorAction_1.Behaviour.TextFocus);
            this.debugService = debugService;
        }
        SelectionToReplAction.prototype.run = function () {
            var _this = this;
            var text = this.editor.getModel().getValueInRange(this.editor.getSelection());
            return this.debugService.addReplExpression(text).then(function () { return _this.debugService.revealRepl(); });
        };
        SelectionToReplAction.prototype.getGroupId = function () {
            return '1_debug/2_selection_to_repl';
        };
        SelectionToReplAction.prototype.shouldShowInContextMenu = function () {
            var selection = this.editor.getSelection();
            return !!selection && !selection.isEmpty() && this.debugService.getState() === debug.State.Stopped;
        };
        SelectionToReplAction.ID = 'editor.debug.action.selectionToRepl';
        SelectionToReplAction = __decorate([
            __param(2, IDebugService)
        ], SelectionToReplAction);
        return SelectionToReplAction;
    })(editorAction_1.EditorAction);
    exports.SelectionToReplAction = SelectionToReplAction;
    var AddToWatchExpressionsAction = (function (_super) {
        __extends(AddToWatchExpressionsAction, _super);
        function AddToWatchExpressionsAction(id, label, expression, debugService, keybindingService) {
            _super.call(this, id, label, 'debug-action add-to-watch', debugService, keybindingService);
            this.expression = expression;
        }
        AddToWatchExpressionsAction.prototype.run = function () {
            return this.debugService.addWatchExpression(model.getFullExpressionName(this.expression, this.debugService.getActiveSession().getType()));
        };
        AddToWatchExpressionsAction.ID = 'workbench.debug.viewlet.action.addToWatchExpressions';
        AddToWatchExpressionsAction.LABEL = nls.localize('addToWatchExpressions', "Add to Watch");
        AddToWatchExpressionsAction = __decorate([
            __param(3, IDebugService),
            __param(4, keybindingService_1.IKeybindingService)
        ], AddToWatchExpressionsAction);
        return AddToWatchExpressionsAction;
    })(AbstractDebugAction);
    exports.AddToWatchExpressionsAction = AddToWatchExpressionsAction;
    var RenameWatchExpressionAction = (function (_super) {
        __extends(RenameWatchExpressionAction, _super);
        function RenameWatchExpressionAction(id, label, expression, debugService, keybindingService) {
            _super.call(this, id, label, 'debug-action rename', debugService, keybindingService);
            this.expression = expression;
        }
        RenameWatchExpressionAction.prototype.run = function () {
            this.debugService.getViewModel().setSelectedExpression(this.expression);
            return winjs_base_1.Promise.as(null);
        };
        RenameWatchExpressionAction.ID = 'workbench.debug.viewlet.action.renameWatchExpression';
        RenameWatchExpressionAction.LABEL = nls.localize('renameWatchExpression', "Rename Expression");
        RenameWatchExpressionAction = __decorate([
            __param(3, IDebugService),
            __param(4, keybindingService_1.IKeybindingService)
        ], RenameWatchExpressionAction);
        return RenameWatchExpressionAction;
    })(AbstractDebugAction);
    exports.RenameWatchExpressionAction = RenameWatchExpressionAction;
    var RemoveWatchExpressionAction = (function (_super) {
        __extends(RemoveWatchExpressionAction, _super);
        function RemoveWatchExpressionAction(id, label, debugService, keybindingService) {
            _super.call(this, id, label, 'debug-action remove', debugService, keybindingService);
        }
        RemoveWatchExpressionAction.prototype.run = function (expression) {
            this.debugService.clearWatchExpressions(expression.getId());
            return winjs_base_1.Promise.as(null);
        };
        RemoveWatchExpressionAction.ID = 'workbench.debug.viewlet.action.removeWatchExpression';
        RemoveWatchExpressionAction.LABEL = nls.localize('removeWatchExpression', "Remove Expression");
        RemoveWatchExpressionAction = __decorate([
            __param(2, IDebugService),
            __param(3, keybindingService_1.IKeybindingService)
        ], RemoveWatchExpressionAction);
        return RemoveWatchExpressionAction;
    })(AbstractDebugAction);
    exports.RemoveWatchExpressionAction = RemoveWatchExpressionAction;
    var RemoveAllWatchExpressionsAction = (function (_super) {
        __extends(RemoveAllWatchExpressionsAction, _super);
        function RemoveAllWatchExpressionsAction(id, label, debugService, keybindingService) {
            var _this = this;
            _super.call(this, id, label, 'debug-action remove', debugService, keybindingService);
            this.toDispose.push(this.debugService.getModel().addListener2(debug.ModelEvents.WATCH_EXPRESSIONS_UPDATED, function () { return _this.updateEnablement(); }));
        }
        RemoveAllWatchExpressionsAction.prototype.run = function () {
            this.debugService.clearWatchExpressions();
            return winjs_base_1.Promise.as(null);
        };
        RemoveAllWatchExpressionsAction.prototype.isEnabled = function () {
            return _super.prototype.isEnabled.call(this) && this.debugService.getModel().getWatchExpressions().length > 0;
        };
        RemoveAllWatchExpressionsAction.ID = 'workbench.debug.viewlet.action.removeAllWatchExpressions';
        RemoveAllWatchExpressionsAction.LABEL = nls.localize('removeAllWatchExpressions', "Remove All Expressions");
        RemoveAllWatchExpressionsAction = __decorate([
            __param(2, IDebugService),
            __param(3, keybindingService_1.IKeybindingService)
        ], RemoveAllWatchExpressionsAction);
        return RemoveAllWatchExpressionsAction;
    })(AbstractDebugAction);
    exports.RemoveAllWatchExpressionsAction = RemoveAllWatchExpressionsAction;
    var OpenReplAction = (function (_super) {
        __extends(OpenReplAction, _super);
        function OpenReplAction(id, label, debugService) {
            _super.call(this, id, label, 'debug-action open-repl', true);
            this.debugService = debugService;
            this.enabled = this.debugService.getState() !== debug.State.Disabled;
        }
        OpenReplAction.prototype.run = function () {
            return this.debugService.revealRepl();
        };
        OpenReplAction.ID = 'workbench.debug.action.openRepl';
        OpenReplAction.LABEL = nls.localize('openRepl', "Open Console");
        OpenReplAction = __decorate([
            __param(2, IDebugService)
        ], OpenReplAction);
        return OpenReplAction;
    })(actions.Action);
    exports.OpenReplAction = OpenReplAction;
    var ClearReplAction = (function (_super) {
        __extends(ClearReplAction, _super);
        function ClearReplAction(debugService) {
            _super.call(this, 'editor.action.clearRepl', nls.localize('clearRepl', "Clear Console"), 'debug-action clear-repl');
            this.debugService = debugService;
        }
        ClearReplAction.prototype.run = function () {
            this.debugService.clearReplExpressions();
            this.debugService.revealRepl(); // focus back to repl
            return winjs_base_1.Promise.as(null);
        };
        ClearReplAction = __decorate([
            __param(0, IDebugService)
        ], ClearReplAction);
        return ClearReplAction;
    })(baseeditor.EditorInputAction);
    exports.ClearReplAction = ClearReplAction;
});
//# sourceMappingURL=debugActions.js.map