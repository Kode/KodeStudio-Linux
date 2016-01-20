/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
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
define(["require", "exports", 'vs/base/common/winjs.base', 'vs/base/common/strings', 'vs/base/common/event', 'vs/workbench/common/editor', 'vs/workbench/parts/output/common/output', 'vs/workbench/parts/output/common/outputEditorInput', 'vs/workbench/services/editor/common/editorService', 'vs/platform/event/common/event', 'vs/platform/lifecycle/common/lifecycle', 'vs/platform/instantiation/common/instantiation'], function (require, exports, winjs_base_1, strings, event_1, editor_1, output_1, outputEditorInput_1, editorService_1, event_2, lifecycle_1, instantiation_1) {
    var OutputService = (function () {
        function OutputService(instantiationService, eventService, editorService, lifecycleService) {
            this.instantiationService = instantiationService;
            this.eventService = eventService;
            this.editorService = editorService;
            this.lifecycleService = lifecycleService;
            this.serviceId = output_1.IOutputService;
            this._onOutput = new event_1.Emitter();
            this._onOutputChannel = new event_1.Emitter();
            this.receivedOutput = Object.create(null);
            this.bufferedOutput = Object.create(null);
            this.sendOutputEventsTimerId = -1;
            this.lastSentOutputEventsTime = -1;
            this.registerListeners();
        }
        Object.defineProperty(OutputService.prototype, "onOutput", {
            get: function () {
                return this._onOutput.event;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(OutputService.prototype, "onOutputChannel", {
            get: function () {
                return this._onOutputChannel.event;
            },
            enumerable: true,
            configurable: true
        });
        OutputService.prototype.registerListeners = function () {
            this.lifecycleService.onShutdown(this.dispose, this);
        };
        OutputService.prototype.append = function (channelOrOutput, output) {
            var channel = output_1.DEFAULT_OUTPUT_CHANNEL;
            if (output) {
                channel = channelOrOutput;
            }
            else {
                output = channelOrOutput;
            }
            this.doAppend(channel, output);
        };
        OutputService.prototype.doAppend = function (channel, output) {
            // Initialize
            if (!this.receivedOutput[channel]) {
                this.receivedOutput[channel] = '';
                this._onOutputChannel.fire(channel); // emit event that we have a new channel
            }
            // Sanitize
            output = strings.removeAnsiEscapeCodes(output);
            // Store
            if (output) {
                var curLength = this.receivedOutput[channel].length;
                var addLength = output.length;
                // Still below MAX_OUTPUT, so just add
                if (addLength + curLength <= OutputService.MAX_OUTPUT) {
                    this.receivedOutput[channel] += output;
                }
                else {
                    // New output exceeds MAX_OUTPUT, so trim beginning and use as received output
                    if (addLength > OutputService.MAX_OUTPUT) {
                        this.receivedOutput[channel] = '...' + output.substr(addLength - OutputService.MAX_OUTPUT);
                    }
                    else {
                        var diff = OutputService.MAX_OUTPUT - addLength;
                        this.receivedOutput[channel] = '...' + this.receivedOutput[channel].substr(curLength - diff) + output;
                    }
                }
                // Buffer
                var buffer = this.bufferedOutput[channel];
                if (!buffer) {
                    buffer = output;
                }
                else {
                    buffer += output;
                }
                this.bufferedOutput[channel] = buffer;
            }
            // Schedule emit delayed to prevent spam
            this.scheduleSendOutputEvent();
        };
        OutputService.prototype.scheduleSendOutputEvent = function () {
            var _this = this;
            if (this.sendOutputEventsTimerId !== -1) {
                return; // sending model events already scheduled
            }
            var elapsed = Date.now() - this.lastSentOutputEventsTime;
            if (elapsed >= OutputService.OUTPUT_DELAY) {
                this.sendOutputEvents(); // more than 300ms have passed since last events have been sent => send events now
            }
            else {
                this.sendOutputEventsTimerId = setTimeout(function () {
                    _this.sendOutputEventsTimerId = -1;
                    _this.sendOutputEvents();
                }, OutputService.OUTPUT_DELAY - elapsed);
            }
        };
        OutputService.prototype.sendOutputEvents = function () {
            this.lastSentOutputEventsTime = Date.now();
            for (var channel in this.bufferedOutput) {
                this._onOutput.fire({ output: this.bufferedOutput[channel], channel: channel });
            }
            this.bufferedOutput = Object.create(null);
        };
        OutputService.prototype.getOutput = function (channel) {
            if (channel === void 0) { channel = output_1.DEFAULT_OUTPUT_CHANNEL; }
            return this.receivedOutput[channel] || '';
        };
        OutputService.prototype.getChannels = function () {
            return Object.keys(this.receivedOutput);
        };
        OutputService.prototype.clearOutput = function (channel) {
            if (channel === void 0) { channel = output_1.DEFAULT_OUTPUT_CHANNEL; }
            this.receivedOutput[channel] = '';
            this._onOutput.fire({ channel: channel, output: null /* indicator to clear output */ });
        };
        OutputService.prototype.showOutput = function (channel, sideBySide, preserveFocus) {
            if (channel === void 0) { channel = output_1.DEFAULT_OUTPUT_CHANNEL; }
            // If already opened, focus it unless we want to preserve focus
            var existingOutputEditor = this.findOutputEditor(channel);
            if (existingOutputEditor) {
                if (!preserveFocus) {
                    return this.editorService.focusEditor(existingOutputEditor);
                }
                // Still reveal last line
                existingOutputEditor.input.revealLastLine();
                return winjs_base_1.Promise.as(existingOutputEditor);
            }
            // Otherwise open new
            return this.editorService.openEditor(outputEditorInput_1.OutputEditorInput.getInstance(this.instantiationService, channel), preserveFocus ? editor_1.EditorOptions.create({ preserveFocus: true }) : null, sideBySide);
        };
        OutputService.prototype.findOutputEditor = function (channel) {
            var editors = this.editorService.getVisibleEditors();
            for (var i = 0; i < editors.length; i++) {
                var editor = editors[i];
                if (editor.input instanceof outputEditorInput_1.OutputEditorInput && editor.input.getChannel() === channel && editor.input.getMime() === output_1.OUTPUT_MIME) {
                    return editor;
                }
            }
            return null;
        };
        OutputService.prototype.dispose = function () {
            if (this.sendOutputEventsTimerId !== -1) {
                clearTimeout(this.sendOutputEventsTimerId);
                this.sendOutputEventsTimerId = -1;
            }
        };
        OutputService.MAX_OUTPUT = 10000 /* Lines */ * 100 /* Guestimated chars per line */;
        OutputService.OUTPUT_DELAY = 300; // delay in ms to accumulate output before emitting an event about it
        OutputService = __decorate([
            __param(0, instantiation_1.IInstantiationService),
            __param(1, event_2.IEventService),
            __param(2, editorService_1.IWorkbenchEditorService),
            __param(3, lifecycle_1.ILifecycleService)
        ], OutputService);
        return OutputService;
    })();
    exports.OutputService = OutputService;
});
//# sourceMappingURL=outputServices.js.map