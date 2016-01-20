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
define(["require", "exports", 'vs/base/common/objects', 'vs/base/common/arrays', 'vs/base/common/winjs.base', 'vs/languages/typescript/common/typescriptWorker2', 'vs/languages/typescript/common/options', 'vs/languages/typescript/common/js/rewriting', 'vs/languages/typescript/common/features/suggestions', 'vs/languages/typescript/common/features/parameterHints', 'vs/languages/typescript/common/features/occurrences', 'vs/languages/typescript/common/features/extraInfo', 'vs/languages/typescript/common/features/references', 'vs/languages/typescript/common/features/definitions', 'vs/languages/typescript/common/features/quickFix', 'vs/languages/typescript/common/features/diagnostics', 'vs/languages/typescript/common/features/rename', 'vs/languages/typescript/common/js/shebangRewriter', 'vs/platform/markers/common/markers', 'vs/editor/common/services/resourceService'], function (require, exports, objects, arrays, winjs, typeScriptWorker, Options, rewriter, suggestions, parameterHints, occurrences, extraInfo, references, definitions, quickFix, diagnostics, rename, ShebangRewriter, markers_1, resourceService_1) {
    var JavaScriptWorker = (function (_super) {
        __extends(JavaScriptWorker, _super);
        function JavaScriptWorker(mode, participants, resourceService, markerService) {
            var _this = this;
            _super.call(this, mode, participants, resourceService, markerService);
            // since we colorize the shebang we should also always handle it
            this._projectService.defaultRewriter = [new ShebangRewriter()];
            this._fancyRewriters = [new ShebangRewriter()];
            participants.forEach(function (participant) {
                if (typeof participant['computeEdits'] === 'function') {
                    _this._fancyRewriters.push(participant);
                }
            });
        }
        JavaScriptWorker.prototype._doConfigure = function (options) {
            return _super.prototype._doConfigure.call(this, options, Options.javaScriptOptions);
        };
        JavaScriptWorker.prototype.doValidateSemantics = function (resource) {
            var markers = [];
            // perform the semantic checks on the rewritten project and
            // filter/translate the error markers
            var missing = [];
            var project = this._projectService.getProject(resource, this._fancyRewriters);
            var result = diagnostics.getSemanticDiagnostics(project.languageService, resource, this._options);
            if (result) {
                var translator = project.translations.getTranslator(resource);
                result.markers.forEach(function (marker) {
                    var info = translator.info(marker);
                    if (info.origin) {
                        // put marker on orgin of this modification
                        objects.mixin(marker, info.origin, true);
                        markers.push(marker);
                    }
                    else if (!info.isInserted) {
                        // put marker on original position
                        objects.mixin(marker, translator.from(marker), true);
                        markers.push(marker);
                    }
                });
                this.markerService.changeOne("/" + this._getMode().getId() + "/semantic", resource, markers);
                return result.hasMissingFiles;
            }
        };
        JavaScriptWorker.prototype.doSuggest = function (resource, position) {
            var project = this._projectService.getProject(resource, this._fancyRewriters);
            position = project.translations.getTranslator(resource).to(position);
            var result = suggestions.computeSuggestions(project.languageService, resource, position, this._options);
            arrays.forEach(result.suggestions, function (suggestion, rm) {
                if (rewriter.containsEncodedVariableName(suggestion.label)) {
                    rm();
                }
            });
            return winjs.TPromise.as(result);
        };
        JavaScriptWorker.prototype.getSuggestionDetails = function (resource, position, suggestion) {
            var project = this._projectService.getProject(resource, this._fancyRewriters);
            position = project.translations.getTranslator(resource).to(position);
            var result = suggestions.getSuggestionDetails(project.languageService, resource, position, suggestion, this._options);
            result.typeLabel = rewriter.decodeVariableNames(result.typeLabel, project.translations.getOriginal(resource));
            return winjs.TPromise.as(result);
        };
        JavaScriptWorker.prototype.getParameterHints = function (resource, position) {
            var project = this._projectService.getProject(resource, this._fancyRewriters);
            position = project.translations.getTranslator(resource).to(position);
            var result = parameterHints.compute(project.languageService, resource, position);
            if (result) {
                var sourceFile = project.translations.getOriginal(resource);
                for (var _i = 0, _a = result.signatures; _i < _a.length; _i++) {
                    var signature = _a[_i];
                    signature.label = rewriter.decodeVariableNames(signature.label, sourceFile);
                    for (var _b = 0, _c = signature.parameters; _b < _c.length; _b++) {
                        var parameter = _c[_b];
                        parameter.label = rewriter.decodeVariableNames(parameter.label, sourceFile);
                        parameter.signatureLabelOffset = 0;
                        parameter.signatureLabelEnd = 0;
                    }
                }
                return winjs.TPromise.as(result);
            }
        };
        JavaScriptWorker.prototype.findOccurrences = function (resource, position, strict) {
            var project = this._projectService.getProject(resource, this._fancyRewriters);
            var translator = project.translations.getTranslator(resource);
            position = translator.to(position);
            var result = occurrences.compute(project.languageService, resource, position, strict);
            arrays.forEach(result, function (element, remove) {
                if (translator.info(element.range).isInserted) {
                    remove();
                }
                else {
                    element.range = project.translations.getTranslator(resource).from(element.range);
                }
            });
            return winjs.TPromise.as(result);
        };
        JavaScriptWorker.prototype._findTypeScriptDeclaration = function (resource, position) {
            var project = this._projectService.getProject(resource, this._fancyRewriters);
            position = project.translations.getTranslator(resource).to(position);
            var result = definitions.findDeclaration(project, resource, position);
            if (result) {
                var translator = project.translations.getTranslator(result.resource);
                if (!translator.info(result.range).isInserted) {
                    result.range = translator.from(result.range);
                    return winjs.TPromise.as(result);
                }
            }
        };
        JavaScriptWorker.prototype.findReferences = function (resource, position, includeDeclaration) {
            var project = this._projectService.getProject(resource, this._fancyRewriters);
            position = project.translations.getTranslator(resource).to(position);
            var result = references.find(project, resource, position, includeDeclaration);
            arrays.forEach(result, function (element, remove) {
                var translator = project.translations.getTranslator(element.resource);
                if (translator.info(element.range).isInserted) {
                    remove();
                }
                else {
                    element.range = translator.from(element.range);
                }
            });
            return winjs.TPromise.as(result);
        };
        JavaScriptWorker.prototype.computeInfo = function (resource, position) {
            var project = this._projectService.getProject(resource, this._fancyRewriters);
            position = project.translations.getTranslator(resource).to(position);
            var result = extraInfo.compute(project.languageService, resource, position);
            if (result) {
                result.range = project.translations.getTranslator(resource).from(result.range);
                rewriter.decodeVariableNames(result.htmlContent, project.translations.getOriginal(resource));
            }
            return winjs.TPromise.as(result);
        };
        JavaScriptWorker.prototype.runQuickFixAction = function (resource, range, id) {
            var project = this._projectService.getProject(resource, this._fancyRewriters);
            var translatedRange = project.translations.getTranslator(resource).to(range);
            objects.mixin(translatedRange, range, false);
            var result = quickFix.evaluate(project.languageService, resource, translatedRange, id);
            if (result) {
                for (var _i = 0, _a = result.edits; _i < _a.length; _i++) {
                    var edit = _a[_i];
                    edit.range = project.translations.getTranslator(edit.resource).from(edit.range);
                }
            }
            return winjs.TPromise.as(result);
        };
        JavaScriptWorker.prototype.getQuickFixes = function (resource, range) {
            var project = this._projectService.getProject(resource, this._fancyRewriters);
            var translatedRange = project.translations.getTranslator(resource).to(range);
            objects.mixin(translatedRange, range, false);
            var result = quickFix.compute(project.languageService, resource, translatedRange);
            return winjs.TPromise.as(result);
        };
        JavaScriptWorker.prototype.rename = function (resource, position, newName) {
            var project = this._projectService.getProject(resource, this._fancyRewriters);
            var result = rename(project, resource, project.translations.getTranslator(resource).to(position), newName);
            for (var i = 0; i < result.edits.length; i++) {
                var edit = result.edits[i];
                var translator = project.translations.getTranslator(edit.resource);
                var info = translator.info(edit.range);
                if (info.isInserted) {
                    // don't rename something that got inserted
                    result.edits.splice(i, 1);
                    i -= 1;
                }
                else if (info.isOverlapping) {
                    // stop if we overlap with an rewrite-edit
                    result.edits = [];
                    break;
                }
                // translate edit
                edit.range = translator.from(edit.range);
            }
            return winjs.TPromise.as(result);
        };
        JavaScriptWorker = __decorate([
            __param(2, resourceService_1.IResourceService),
            __param(3, markers_1.IMarkerService)
        ], JavaScriptWorker);
        return JavaScriptWorker;
    })(typeScriptWorker.TypeScriptWorker2);
    exports.JavaScriptWorker = JavaScriptWorker;
});
//# sourceMappingURL=javascriptWorker.js.map