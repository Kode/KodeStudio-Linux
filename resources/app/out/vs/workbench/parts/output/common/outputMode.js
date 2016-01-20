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
define(["require", "exports", 'vs/editor/common/modes/monarch/monarch', 'vs/editor/common/modes/monarch/monarchCompile', 'vs/platform/instantiation/common/descriptors', 'vs/platform/instantiation/common/instantiation', 'vs/platform/thread/common/thread', 'vs/editor/common/services/modelService', 'vs/editor/common/services/modeService'], function (require, exports, monarch_1, monarchCompile_1, descriptors_1, instantiation_1, thread_1, modelService_1, modeService_1) {
    exports.language = {
        displayName: 'Log',
        name: 'Log',
        defaultToken: '',
        ignoreCase: true,
        tokenizer: {
            root: [
                // Monaco log levels
                [/^\[trace.*?\]|trace:?/, 'debug-token.output'],
                [/^\[http.*?\]|http:?/, 'debug-token.output'],
                [/^\[debug.*?\]|debug:?/, 'debug-token.output'],
                [/^\[verbose.*?\]|verbose:?/, 'debug-token.output'],
                [/^\[information.*?\]|information:?/, 'info-token.output'],
                [/^\[info.*?\]|info:?/, 'info-token.output'],
                [/^\[warning.*?\]|warning:?/, 'warn-token.output'],
                [/^\[warn.*?\]|warn:?/, 'warn-token.output'],
                [/^\[error.*?\]|error:?/, 'error-token.output'],
                [/^\[fatal.*?\]|fatal:?/, 'error-token.output']
            ]
        }
    };
    var OutputMode = (function (_super) {
        __extends(OutputMode, _super);
        function OutputMode(descriptor, instantiationService, threadService, modeService, modelService) {
            _super.call(this, descriptor, monarchCompile_1.compile(exports.language), instantiationService, threadService, modeService, modelService);
        }
        OutputMode.prototype._getWorkerDescriptor = function () {
            return descriptors_1.createAsyncDescriptor2('vs/workbench/parts/output/common/outputWorker', 'OutputWorker');
        };
        OutputMode = __decorate([
            __param(1, instantiation_1.IInstantiationService),
            __param(2, thread_1.IThreadService),
            __param(3, modeService_1.IModeService),
            __param(4, modelService_1.IModelService)
        ], OutputMode);
        return OutputMode;
    })(monarch_1.MonarchMode);
    exports.OutputMode = OutputMode;
});
//# sourceMappingURL=outputMode.js.map