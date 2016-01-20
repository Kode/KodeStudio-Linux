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
define(["require", "exports", 'vs/base/common/winjs.base', 'vs/nls', 'vs/platform/platform', 'vs/base/common/errors', 'vs/base/common/arrays', 'vs/base/common/actions', 'vs/editor/common/editorAction', 'vs/workbench/browser/parts/editor/baseEditor', 'vs/workbench/parts/output/common/output', 'vs/workbench/parts/output/common/outputEditorInput', 'vs/base/browser/ui/actionbar/actionbar', 'vs/workbench/services/editor/common/editorService', 'vs/workbench/services/quickopen/common/quickOpenService', 'vs/platform/instantiation/common/instantiation'], function (require, exports, winjs_base_1, nls, platform_1, errors, arrays, actions_1, editorAction_1, baseEditor_1, output_1, outputEditorInput_1, actionbar_1, editorService_1, quickOpenService_1, instantiation_1) {
    var GlobalShowOutputAction = (function (_super) {
        __extends(GlobalShowOutputAction, _super);
        function GlobalShowOutputAction(id, label, outputService, editorService, quickOpenService) {
            _super.call(this, id, label);
            this.outputService = outputService;
            this.editorService = editorService;
            this.quickOpenService = quickOpenService;
            this.order = 20; // Allow other actions to position before or after
            this.class = 'output-action showoutput';
        }
        GlobalShowOutputAction.prototype.run = function (event) {
            var _this = this;
            var channelToOpen = null;
            // Check for previously opened output
            var channels = this.quickOpenService.getEditorHistory().filter(function (i) { return i instanceof outputEditorInput_1.OutputEditorInput; });
            if (channels.length > 0) {
                // See if output is already opened and just focus it
                var editors = this.editorService.getVisibleEditors();
                if (editors.some(function (e) {
                    if (e.input instanceof outputEditorInput_1.OutputEditorInput) {
                        _this.editorService.focusEditor(e);
                        return true;
                    }
                    return false;
                })) {
                    return winjs_base_1.Promise.as(null);
                }
                // Otherwise pick a channel from the list
                channelToOpen = channels[0].getChannel();
            }
            else {
                channelToOpen = platform_1.Registry.as(output_1.Extensions.OutputChannels).getChannels()[0];
            }
            var sideBySide = !!(event && (event.ctrlKey || event.metaKey));
            return this.outputService.showOutput(channelToOpen, sideBySide, false /* Do not preserve Focus */);
        };
        GlobalShowOutputAction.ID = 'workbench.action.output.showOutput';
        GlobalShowOutputAction.LABEL = nls.localize('showOutput', "Show Output");
        GlobalShowOutputAction = __decorate([
            __param(2, output_1.IOutputService),
            __param(3, editorService_1.IWorkbenchEditorService),
            __param(4, quickOpenService_1.IQuickOpenService)
        ], GlobalShowOutputAction);
        return GlobalShowOutputAction;
    })(actions_1.Action);
    exports.GlobalShowOutputAction = GlobalShowOutputAction;
    var ToggleOutputAction = (function (_super) {
        __extends(ToggleOutputAction, _super);
        function ToggleOutputAction(id, label, quickOpenService, editorService, instantiationService) {
            _super.call(this, id, label);
            this.quickOpenService = quickOpenService;
            this.editorService = editorService;
            this.instantiationService = instantiationService;
        }
        ToggleOutputAction.prototype.run = function (event) {
            var activeInput = this.editorService.getActiveEditorInput();
            // Restore Previous Non-Output Editor
            if (activeInput instanceof outputEditorInput_1.OutputEditorInput) {
                var history_1 = this.quickOpenService.getEditorHistory();
                for (var i = 1; i < history_1.length; i++) {
                    if (!(history_1[i] instanceof outputEditorInput_1.OutputEditorInput)) {
                        return this.editorService.openEditor(history_1[i]);
                    }
                }
            }
            else {
                var action = this.instantiationService.createInstance(GlobalShowOutputAction, GlobalShowOutputAction.ID, GlobalShowOutputAction.LABEL);
                action.run().done(function () { return action.dispose(); }, errors.onUnexpectedError);
            }
            return winjs_base_1.Promise.as(true);
        };
        ToggleOutputAction.ID = 'workbench.action.output.toggleOutput';
        ToggleOutputAction.LABEL = nls.localize('toggleOutput', "Toggle Output");
        ToggleOutputAction = __decorate([
            __param(2, quickOpenService_1.IQuickOpenService),
            __param(3, editorService_1.IWorkbenchEditorService),
            __param(4, instantiation_1.IInstantiationService)
        ], ToggleOutputAction);
        return ToggleOutputAction;
    })(actions_1.Action);
    exports.ToggleOutputAction = ToggleOutputAction;
    var ClearOutputAction = (function (_super) {
        __extends(ClearOutputAction, _super);
        function ClearOutputAction(ns) {
            _super.call(this, 'workbench.output.action.clearOutput', nls.localize('clearOutput', "Clear Output"), 'output-action clear-output');
        }
        ClearOutputAction.prototype.run = function () {
            var outputEditorInput = this.input;
            outputEditorInput.clearOutput();
            return winjs_base_1.Promise.as(true);
        };
        ClearOutputAction = __decorate([
            __param(0, instantiation_1.INullService)
        ], ClearOutputAction);
        return ClearOutputAction;
    })(baseEditor_1.EditorInputAction);
    exports.ClearOutputAction = ClearOutputAction;
    var ClearOutputEditorAction = (function (_super) {
        __extends(ClearOutputEditorAction, _super);
        function ClearOutputEditorAction(descriptor, editor, myEditorService) {
            _super.call(this, descriptor, editor, editorAction_1.Behaviour.WidgetFocus | editorAction_1.Behaviour.ShowInContextMenu);
            this.myEditorService = myEditorService;
        }
        ClearOutputEditorAction.prototype.getGroupId = function () {
            return 'clear';
        };
        ClearOutputEditorAction.prototype.isSupported = function () {
            var model = this.editor.getModel();
            var mode = model && model.getMode();
            return mode && mode.getId() === output_1.OUTPUT_MODE_ID && _super.prototype.isSupported.call(this);
        };
        ClearOutputEditorAction.prototype.run = function () {
            var input = this.myEditorService.getActiveEditorInput();
            if (input && input.getId() === output_1.OUTPUT_EDITOR_INPUT_ID) {
                var outputEditorInput = input;
                outputEditorInput.clearOutput();
                return winjs_base_1.Promise.as(true);
            }
            return winjs_base_1.TPromise.as(false);
        };
        ClearOutputEditorAction.ID = 'editor.action.clearoutput';
        ClearOutputEditorAction = __decorate([
            __param(2, editorService_1.IWorkbenchEditorService)
        ], ClearOutputEditorAction);
        return ClearOutputEditorAction;
    })(editorAction_1.EditorAction);
    exports.ClearOutputEditorAction = ClearOutputEditorAction;
    var SwitchOutputAction = (function (_super) {
        __extends(SwitchOutputAction, _super);
        function SwitchOutputAction(outputService) {
            _super.call(this, SwitchOutputAction.ID, nls.localize('switchToOutput.label', "Switch to Output"));
            this.outputService = outputService;
            this.class = 'output-action switch-to-output';
        }
        SwitchOutputAction.prototype.isEnabled = function () {
            return _super.prototype.isEnabled.call(this) && this.input instanceof outputEditorInput_1.OutputEditorInput;
        };
        SwitchOutputAction.prototype.run = function (channel) {
            return this.outputService.showOutput(channel);
        };
        SwitchOutputAction.ID = 'workbench.output.action.switchBetweenOutputs';
        SwitchOutputAction = __decorate([
            __param(0, output_1.IOutputService)
        ], SwitchOutputAction);
        return SwitchOutputAction;
    })(baseEditor_1.EditorInputAction);
    exports.SwitchOutputAction = SwitchOutputAction;
    var SwitchOutputActionItem = (function (_super) {
        __extends(SwitchOutputActionItem, _super);
        function SwitchOutputActionItem(action, input, outputService) {
            _super.call(this, null, action, SwitchOutputActionItem.getChannels(outputService, input), SwitchOutputActionItem.getChannels(outputService, input).indexOf(input.getChannel()));
            this.outputService = outputService;
            this.input = input;
            this.outputListenerDispose = this.outputService.onOutputChannel(this.onOutputChannel, this);
        }
        SwitchOutputActionItem.prototype.onOutputChannel = function () {
            var channels = SwitchOutputActionItem.getChannels(this.outputService, this.input);
            var selected = channels.indexOf(this.input.getChannel());
            this.setOptions(channels, selected);
        };
        SwitchOutputActionItem.getChannels = function (outputService, input) {
            var contributedChannels = platform_1.Registry.as(output_1.Extensions.OutputChannels).getChannels();
            var usedChannels = outputService.getChannels();
            usedChannels.push(input.getChannel());
            return arrays.distinct(contributedChannels.concat(usedChannels)).sort(); // sort by name
        };
        SwitchOutputActionItem.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            if (this.outputListenerDispose) {
                this.outputListenerDispose.dispose();
                delete this.outputListenerDispose;
            }
            delete this.input;
        };
        SwitchOutputActionItem = __decorate([
            __param(2, output_1.IOutputService)
        ], SwitchOutputActionItem);
        return SwitchOutputActionItem;
    })(actionbar_1.SelectActionItem);
    exports.SwitchOutputActionItem = SwitchOutputActionItem;
});
//# sourceMappingURL=outputActions.js.map