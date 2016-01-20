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
define(["require", "exports", 'vs/nls', 'vs/workbench/common/editor/logEditorInput', 'vs/workbench/parts/output/common/output', 'vs/platform/instantiation/common/instantiation', 'vs/workbench/services/editor/common/editorService'], function (require, exports, nls, logEditorInput_1, output_1, instantiation_1, editorService_1) {
    /**
     * Output Editor Input
     */
    var OutputEditorInput = (function (_super) {
        __extends(OutputEditorInput, _super);
        function OutputEditorInput(channel, instantiationService, editorService, outputService) {
            _super.call(this, nls.localize('output', "Output"), channel ? nls.localize('outputChannel', "for '{0}'", channel) : '', '', output_1.OUTPUT_MIME, true, instantiationService, editorService);
            this.outputService = outputService;
            this.channel = channel;
            this.toUnbind = [];
            var listenerUnbind = this.outputService.onOutput(this.onOutputReceived, this);
            this.toUnbind.push(function () { return listenerUnbind.dispose(); });
        }
        OutputEditorInput.getInstances = function () {
            return Object.keys(OutputEditorInput.instances).map(function (key) { return OutputEditorInput.instances[key]; });
        };
        OutputEditorInput.getInstance = function (instantiationService, channel) {
            if (OutputEditorInput.instances[channel]) {
                return OutputEditorInput.instances[channel];
            }
            OutputEditorInput.instances[channel] = instantiationService.createInstance(OutputEditorInput, channel);
            return OutputEditorInput.instances[channel];
        };
        OutputEditorInput.prototype.onOutputReceived = function (e) {
            if (this.outputSet && e.channel === this.channel) {
                if (e.output) {
                    this.append(e.output);
                    this.trim(OutputEditorInput.MAX_OUTPUT_LINES);
                }
                else if (e.output === null) {
                    this.clearValue(); // special output indicates we should clear
                }
            }
        };
        OutputEditorInput.prototype.getId = function () {
            return output_1.OUTPUT_EDITOR_INPUT_ID;
        };
        OutputEditorInput.prototype.resolve = function (refresh) {
            var _this = this;
            return _super.prototype.resolve.call(this, refresh).then(function (model) {
                // Just return model if output already set
                if (_this.outputSet) {
                    return model;
                }
                _this.setValue(_this.outputService.getOutput(_this.channel));
                _this.outputSet = true;
                return model;
            });
        };
        OutputEditorInput.prototype.clearOutput = function () {
            if (this.outputService) {
                this.outputService.clearOutput(this.channel);
            }
        };
        OutputEditorInput.prototype.getChannel = function () {
            return this.channel;
        };
        OutputEditorInput.prototype.matches = function (otherInput) {
            if (otherInput instanceof OutputEditorInput) {
                var otherOutputEditorInput = otherInput;
                if (otherOutputEditorInput.getChannel() === this.channel) {
                    return _super.prototype.matches.call(this, otherInput);
                }
                ;
            }
            return false;
        };
        OutputEditorInput.prototype.dispose = function () {
            while (this.toUnbind.length) {
                this.toUnbind.pop()();
            }
            _super.prototype.dispose.call(this);
        };
        OutputEditorInput.instances = Object.create(null);
        OutputEditorInput.MAX_OUTPUT_LINES = 10000; // Max. number of output lines to show in output
        OutputEditorInput = __decorate([
            __param(1, instantiation_1.IInstantiationService),
            __param(2, editorService_1.IWorkbenchEditorService),
            __param(3, output_1.IOutputService)
        ], OutputEditorInput);
        return OutputEditorInput;
    })(logEditorInput_1.LogEditorInput);
    exports.OutputEditorInput = OutputEditorInput;
});
//# sourceMappingURL=outputEditorInput.js.map