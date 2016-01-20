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
define(["require", "exports", 'vs/platform/platform', 'vs/editor/common/modes/modesRegistry', 'vs/workbench/parts/output/common/outputServices', 'vs/workbench/parts/output/common/output', 'vs/workbench/parts/output/common/outputEditorInput', 'vs/workbench/browser/parts/editor/baseEditor', 'vs/platform/instantiation/common/instantiation', 'vs/platform/instantiation/common/extensions'], function (require, exports, platform_1, modesRegistry_1, outputServices_1, output_1, outputEditorInput_1, baseEditor_1, instantiation_1, extensions_1) {
    // Register Editor Input Factory
    var OutputInputFactory = (function () {
        function OutputInputFactory(ns) {
        }
        OutputInputFactory.prototype.serialize = function (editorInput) {
            var outputEditoInput = editorInput;
            return outputEditoInput.getChannel(); // use the channel to distinguish different output editor inputs
        };
        OutputInputFactory.prototype.deserialize = function (instantiationService, channel) {
            return outputEditorInput_1.OutputEditorInput.getInstance(instantiationService, channel);
        };
        OutputInputFactory = __decorate([
            __param(0, instantiation_1.INullService)
        ], OutputInputFactory);
        return OutputInputFactory;
    })();
    // Register Service
    extensions_1.registerSingleton(output_1.IOutputService, outputServices_1.OutputService);
    // Register Output Input Factory
    platform_1.Registry.as(baseEditor_1.Extensions.Editors).registerEditorInputFactory(output_1.OUTPUT_EDITOR_INPUT_ID, OutputInputFactory);
    // Register Output Mode
    modesRegistry_1.registerMode({
        id: output_1.OUTPUT_MODE_ID,
        extensions: [],
        aliases: [null],
        mimetypes: [output_1.OUTPUT_MIME],
        moduleId: 'vs/workbench/parts/output/common/outputMode',
        ctorName: 'OutputMode'
    });
});
//# sourceMappingURL=output.contribution.js.map