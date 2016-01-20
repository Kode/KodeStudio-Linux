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
define(["require", "exports", 'vs/platform/platform', 'vs/base/common/uri', 'vs/workbench/browser/parts/editor/baseEditor', 'vs/workbench/parts/markdown/common/markdownEditorInput', 'vs/workbench/parts/markdown/browser/markdownExtension', 'vs/workbench/common/contributions', 'vs/platform/instantiation/common/instantiation'], function (require, exports, platform_1, uri_1, baseEditor_1, markdownEditorInput_1, markdownExtension_1, contributions_1, instantiation_1) {
    // Register Editor Input Factory
    var MarkdownInputFactory = (function () {
        function MarkdownInputFactory(ns) {
        }
        MarkdownInputFactory.prototype.serialize = function (editorInput) {
            var markdownInput = editorInput;
            return markdownInput.getResource().toString();
        };
        MarkdownInputFactory.prototype.deserialize = function (instantiationService, resourceRaw) {
            return instantiationService.createInstance(markdownEditorInput_1.MarkdownEditorInput, uri_1.default.parse(resourceRaw), void 0, void 0);
        };
        MarkdownInputFactory = __decorate([
            __param(0, instantiation_1.INullService)
        ], MarkdownInputFactory);
        return MarkdownInputFactory;
    })();
    platform_1.Registry.as(baseEditor_1.Extensions.Editors).registerEditorInputFactory(markdownEditorInput_1.MarkdownEditorInput.ID, MarkdownInputFactory);
    // Register Markdown File Tracker
    platform_1.Registry.as(contributions_1.Extensions.Workbench).registerWorkbenchContribution(markdownExtension_1.MarkdownFileTracker);
});
//# sourceMappingURL=markdown.contribution.js.map