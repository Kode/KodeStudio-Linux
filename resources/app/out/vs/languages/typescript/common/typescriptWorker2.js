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
define(["require", "exports", 'vs/base/common/winjs.base', 'vs/base/common/paths', 'vs/base/common/uri', 'vs/base/common/lifecycle', 'vs/editor/common/modes/abstractModeWorker', 'vs/base/common/objects', 'vs/languages/typescript/common/options', 'vs/languages/typescript/common/typescript', 'vs/editor/common/modes/supports', 'vs/languages/typescript/common/project/projectService', 'vs/languages/typescript/common/features/format', 'vs/languages/typescript/common/features/logicalSelection', 'vs/languages/typescript/common/features/extraInfo', 'vs/languages/typescript/common/features/outline', 'vs/languages/typescript/common/features/occurrences', 'vs/languages/typescript/common/features/definitions', 'vs/languages/typescript/common/features/references', 'vs/languages/typescript/common/features/parameterHints', 'vs/languages/typescript/common/features/suggestions', 'vs/languages/typescript/common/features/quickFix', 'vs/languages/typescript/common/features/diagnostics', 'vs/languages/typescript/common/features/emitting', 'vs/languages/typescript/common/features/rename', 'vs/editor/common/services/resourceService', 'vs/platform/markers/common/markers'], function (require, exports, winjs, paths, uri_1, lifecycle, abstractModeWorker_1, objects, Options, typescript, supports, projectService, format, logicalSelection, extraInfo, outline, occurrences, definitions, references, parameterHints, suggestions, quickFix, diagnostics, emitting, rename, resourceService_1, markers_1) {
    var TypeScriptWorker2 = (function (_super) {
        __extends(TypeScriptWorker2, _super);
        function TypeScriptWorker2(mode, participants, resourceService, markerService) {
            var _this = this;
            _super.call(this, mode, participants, resourceService, markerService);
            this._modelListener = Object.create(null);
            this._disposables = [];
            this._projectService = new projectService.ProjectService();
            this._disposables.push(this.resourceService.addListener2_(resourceService_1.ResourceEvents.ADDED, this._onResourceAdded.bind(this)));
            this._disposables.push(this.resourceService.addListener2_(resourceService_1.ResourceEvents.REMOVED, this._onResourceRemoved.bind(this)));
            this.resourceService.all()
                .forEach(function (element) { return _this._onResourceAdded({ url: element.getAssociatedResource(), addedElement: element }); });
        }
        TypeScriptWorker2.prototype.dispose = function () {
            for (var key in this._modelListener) {
                this._modelListener[key]();
                delete this._modelListener[key];
            }
            this._disposables = lifecycle.disposeAll(this._disposables);
        };
        // ---- typescript project
        TypeScriptWorker2.prototype._isInterestingModel = function (element) {
            return (/\.(ts|js)$/.test(element.getAssociatedResource().fsPath) ||
                element.getMode() === this._getMode());
        };
        TypeScriptWorker2.prototype._onResourceAdded = function (event) {
            var _this = this;
            if (this._isInterestingModel(event.addedElement)) {
                var model = event.addedElement, resource = event.url, unbind, onChanged;
                onChanged = function () { return _this._projectService._syncFile(typescript.ChangeKind.Changed, resource, model.getValue()); };
                unbind = model.addListener('changed', function () { return onChanged(); });
                this._modelListener[resource.toString()] = unbind;
                onChanged();
            }
        };
        TypeScriptWorker2.prototype._onResourceRemoved = function (event) {
            var resource = event.url;
            var unbind = this._modelListener[resource.toString()];
            if (unbind) {
                delete this._modelListener[resource.toString()];
                unbind();
                // despite a file being removed from the resource service
                // we keep it in the project service because other files
                // might still depend on it.
                if (resource.scheme !== 'file') {
                    this._projectService._syncFile(typescript.ChangeKind.Removed, resource, undefined);
                }
            }
        };
        TypeScriptWorker2.prototype.canAcceptFileChanges = function (newLength) {
            var newTotal = this._projectService.getTotalLength() + newLength;
            // console.log('~' + Math.round(newTotal / (1024 * 1024)) + 'MB');
            return newTotal < 1024 * 1024 * 35;
        };
        TypeScriptWorker2.prototype.acceptFileChanges = function (changes) {
            for (var i = 0, len = changes.length; i < len; i++) {
                if (!this.resourceService.get(changes[i].resource)) {
                    this._projectService._syncFile(changes[i].kind, changes[i].resource, changes[i].content);
                }
            }
            return true;
        };
        TypeScriptWorker2.prototype.acceptProjectChanges = function (changes) {
            for (var i = 0, len = changes.length; i < len; i++) {
                this._projectService._syncProject(changes[i].kind, changes[i].resource, changes[i].files, changes[i].options);
            }
            // trigger validation for all files
            this._validationHelper.triggerDueToConfigurationChange();
            // return a project map
            var projects = Object.create(null);
            this._projectService.projects().forEach(function (project) { return projects[paths.dirname(project.resource.fsPath)] = project.resource; });
            return projects;
        };
        TypeScriptWorker2.prototype._doConfigure = function (options, defaults) {
            if (defaults === void 0) { defaults = Options.typeScriptOptions; }
            // very long ago options.validate could be an
            // array or an object. since this was only used
            // for selfhosting the migration story is to
            // delete such a configuration object...
            if (options && Array.isArray(options.validate)) {
                delete options.validate;
            }
            var optionsWithDefaults = Options.withDefaultOptions(options, defaults);
            if (!objects.equals(optionsWithDefaults, this._options)) {
                this._options = optionsWithDefaults;
                return winjs.TPromise.as(true);
            }
        };
        // ---- Implementation of various IXYZSupports
        TypeScriptWorker2.prototype._createInPlaceReplaceSupport = function () {
            return new supports.WorkerInplaceReplaceSupport(this.resourceService, this);
        };
        TypeScriptWorker2.prototype.doValidate = function (resource) {
            var project = this._projectService.getProject(resource);
            var markers = [];
            markers.push.apply(markers, diagnostics.getSyntacticDiagnostics(project.languageService, resource, project.host.getCompilationSettings(), this._options, this.resourceService.get(resource).getMode().getId() === 'javascript'));
            markers.push.apply(markers, diagnostics.getExtraDiagnostics(project.languageService, resource, this._options));
            this.markerService.changeOne("/" + this._getMode().getId() + "/syntactic", resource, markers);
        };
        TypeScriptWorker2.prototype.doValidateSemantics = function (resource) {
            var project = this._projectService.getProject(resource);
            var result = diagnostics.getSemanticDiagnostics(project.languageService, resource, this._options);
            if (result) {
                this.markerService.changeOne("/" + this._getMode().getId() + "/semantic", resource, result.markers);
                return result.hasMissingFiles;
            }
        };
        TypeScriptWorker2.prototype.getMissingFiles = function () {
            var fileNames = this._projectService.getMissingScriptNamesSinceLastTime();
            return fileNames && fileNames.map(uri_1.default.parse);
        };
        TypeScriptWorker2.prototype._getContextForValidationParticipants = function (resource) {
            // var project = this._findProject(resource);
            // return project.languageService.getSourceFile(resource.toString());
            return null;
        };
        TypeScriptWorker2.prototype.doSuggest = function (resource, position) {
            var project = this._projectService.getProject(resource);
            var result = suggestions.computeSuggestions(project.languageService, resource, position, this._options);
            return winjs.TPromise.as(result);
        };
        TypeScriptWorker2.prototype._getSuggestContext = function (resource) {
            return winjs.TPromise.as(this._projectService);
        };
        TypeScriptWorker2.prototype.getSuggestionDetails = function (resource, position, suggestion) {
            var project = this._projectService.getProject(resource);
            var result = suggestions.getSuggestionDetails(project.languageService, resource, position, suggestion, this._options);
            return winjs.TPromise.as(result);
        };
        TypeScriptWorker2.prototype.runQuickFixAction = function (resource, range, id) {
            var project = this._projectService.getProject(resource);
            var result = quickFix.evaluate(project.languageService, resource, range, id);
            return winjs.TPromise.as(result);
        };
        TypeScriptWorker2.prototype.getQuickFixes = function (resource, range) {
            var project = this._projectService.getProject(resource);
            var result = quickFix.compute(project.languageService, resource, range);
            return winjs.TPromise.as(result);
        };
        TypeScriptWorker2.prototype.getEmitOutput = function (resource, type) {
            var project = this._projectService.getProject(resource);
            var result = emitting.getEmitOutput(project.languageService, resource, type);
            return winjs.TPromise.as(result);
        };
        TypeScriptWorker2.prototype.getParameterHints = function (resource, position) {
            var project = this._projectService.getProject(resource);
            var result = parameterHints.compute(project.languageService, resource, position);
            return winjs.TPromise.as(result);
        };
        TypeScriptWorker2.prototype.findDeclaration = function (resource, position) {
            // return winjs.TPromise.join([
            // 	this._findLinkTarget(resource, position),
            // 	this._findTypeScriptDeclaration(resource, position)
            // ]).then((results:Modes.IReference[]) => {
            // 	return arrays.coalesce(results)[0] || null;
            // });
            return this._findTypeScriptDeclaration(resource, position);
        };
        // public _findLinkTarget(resource: URI, position: EditorCommon.IPosition): winjs.TPromise<Modes.IReference> {
        // 	var project = this._findProject(resource);
        // 	return this.resolveDependenciesAndRun(resource, (project) => {
        // 		var filename = resource.toString(),
        // 			syntaxTree = project.syntaxLanguageService().getSourceFile(filename);
        // 		return moduleLinks.findLink(syntaxTree, filename, position, project.semanticLanguageService().host, project.root());
        // 	});
        // }
        TypeScriptWorker2.prototype._findTypeScriptDeclaration = function (resource, position) {
            var project = this._projectService.getProject(resource);
            var result = definitions.findDeclaration(project, resource, position);
            return winjs.TPromise.as(result);
        };
        TypeScriptWorker2.prototype.textReplace = function (value, up) {
            var valueSets = [
                ['true', 'false'],
                ['string', 'number', 'boolean', 'void', 'any'],
                ['private', 'public']
            ];
            return supports.ReplaceSupport.valueSetsReplace(valueSets, value, up);
        };
        TypeScriptWorker2.prototype.findReferences = function (resource, position, includeDeclaration) {
            var project = this._projectService.getProject(resource);
            var result = references.find(project, resource, position, includeDeclaration);
            return winjs.TPromise.as(result);
        };
        TypeScriptWorker2.prototype.computeInfo = function (resource, position) {
            var project = this._projectService.getProject(resource);
            var result = extraInfo.compute(project.languageService, resource, position);
            return winjs.TPromise.as(result);
        };
        TypeScriptWorker2.prototype.findOccurrences = function (resource, position, strict) {
            var project = this._projectService.getProject(resource);
            var result = occurrences.compute(project.languageService, resource, position, strict);
            return winjs.TPromise.as(result);
        };
        TypeScriptWorker2.prototype.getOutline = function (resource) {
            var project = this._projectService.getProject(resource);
            return outline.compute(project.languageService, resource);
        };
        TypeScriptWorker2.prototype.formatDocument = function (resource, options) {
            var project = this._projectService.getProject(resource);
            return format.formatDocument(project.languageService, resource, options);
        };
        TypeScriptWorker2.prototype.formatRange = function (resource, range, options) {
            var project = this._projectService.getProject(resource);
            return format.formatRange(project.languageService, resource, range, options);
        };
        TypeScriptWorker2.prototype.formatAfterKeystroke = function (resource, position, ch, options) {
            var project = this._projectService.getProject(resource);
            return format.formatAfterKeystroke(project.languageService, resource, position, ch, options);
        };
        TypeScriptWorker2.prototype.getRangesToPosition = function (resource, position) {
            var project = this._projectService.getProject(resource);
            return logicalSelection.compute(project.languageService, resource, position);
        };
        TypeScriptWorker2.prototype.rename = function (resource, position, newName) {
            var project = this._projectService.getProject(resource);
            var result = rename(project, resource, position, newName);
            return winjs.TPromise.as(result);
        };
        TypeScriptWorker2 = __decorate([
            __param(2, resourceService_1.IResourceService),
            __param(3, markers_1.IMarkerService)
        ], TypeScriptWorker2);
        return TypeScriptWorker2;
    })(abstractModeWorker_1.AbstractModeWorker);
    exports.TypeScriptWorker2 = TypeScriptWorker2;
});
//# sourceMappingURL=typescriptWorker2.js.map