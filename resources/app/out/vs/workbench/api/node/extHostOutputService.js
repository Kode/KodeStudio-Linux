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
define(["require", "exports", 'vs/base/common/errors', 'vs/platform/thread/common/thread', 'vs/workbench/parts/output/common/output', 'vs/workbench/services/editor/common/editorService', 'vs/workbench/api/node/extHostTypeConverters'], function (require, exports, errors_1, thread_1, output_1, editorService_1, TypeConverters) {
    var ExtHostOutputChannel = (function () {
        function ExtHostOutputChannel(name, proxy) {
            this._name = name;
            this._proxy = proxy;
        }
        Object.defineProperty(ExtHostOutputChannel.prototype, "name", {
            get: function () {
                return this._name;
            },
            enumerable: true,
            configurable: true
        });
        ExtHostOutputChannel.prototype.dispose = function () {
            var _this = this;
            if (!this._disposed) {
                this._proxy.clear(this._name).then(function () {
                    _this._disposed = true;
                });
            }
        };
        ExtHostOutputChannel.prototype.append = function (value) {
            this._proxy.append(this._name, value);
        };
        ExtHostOutputChannel.prototype.appendLine = function (value) {
            this.append(value + '\n');
        };
        ExtHostOutputChannel.prototype.clear = function () {
            this._proxy.clear(this._name);
        };
        ExtHostOutputChannel.prototype.show = function (column, preserveFocus) {
            this._proxy.reveal(this._name, TypeConverters.fromViewColumn(column), preserveFocus);
        };
        ExtHostOutputChannel.prototype.hide = function () {
            this._proxy.close(this._name);
        };
        return ExtHostOutputChannel;
    })();
    exports.ExtHostOutputChannel = ExtHostOutputChannel;
    var ExtHostOutputService = (function () {
        function ExtHostOutputService(threadService) {
            this._proxy = threadService.getRemotable(MainThreadOutputService);
        }
        ExtHostOutputService.prototype.createOutputChannel = function (name) {
            name = name.trim();
            if (!name) {
                throw new Error('illegal argument `name`. must not be falsy');
            }
            else {
                return new ExtHostOutputChannel(name, this._proxy);
            }
        };
        return ExtHostOutputService;
    })();
    exports.ExtHostOutputService = ExtHostOutputService;
    var MainThreadOutputService = (function () {
        function MainThreadOutputService(outputService, editorService) {
            this._outputService = outputService;
            this._editorService = editorService;
        }
        MainThreadOutputService.prototype.append = function (channel, value) {
            this._outputService.append(channel, value);
            return undefined;
        };
        MainThreadOutputService.prototype.clear = function (channel) {
            this._outputService.clearOutput(channel);
            return undefined;
        };
        MainThreadOutputService.prototype.reveal = function (channel, position, preserveFocus) {
            this._outputService.showOutput(channel, position, preserveFocus);
            return undefined;
        };
        MainThreadOutputService.prototype.close = function (channel) {
            var editors = this._editorService.getVisibleEditors();
            for (var _i = 0; _i < editors.length; _i++) {
                var editor = editors[_i];
                if (editor.input.getId() === output_1.OUTPUT_EDITOR_INPUT_ID) {
                    this._editorService.closeEditor(editor).done(null, errors_1.onUnexpectedError);
                    return undefined;
                }
            }
        };
        MainThreadOutputService = __decorate([
            thread_1.Remotable.MainContext('MainThreadOutputService'),
            __param(0, output_1.IOutputService),
            __param(1, editorService_1.IWorkbenchEditorService)
        ], MainThreadOutputService);
        return MainThreadOutputService;
    })();
    exports.MainThreadOutputService = MainThreadOutputService;
});
//# sourceMappingURL=extHostOutputService.js.map