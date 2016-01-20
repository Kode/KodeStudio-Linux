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
define(["require", "exports", 'vs/platform/markers/common/markers', 'vs/editor/common/services/resourceService', 'vs/editor/common/modes/linkComputer', 'vs/editor/common/diff/diffComputer', 'vs/editor/common/modes/modesFilters', 'vs/editor/common/model/textModel', 'vs/editor/common/modes/supports', 'vs/editor/common/worker/validationHelper', 'vs/base/common/winjs.base'], function (require, exports, markers_1, resourceService_1, linkComputer_1, diffComputer_1, modesFilters_1, textModel_1, supports_1, validationHelper_1, winjs_base_1) {
    var AbstractModeWorker = (function () {
        function AbstractModeWorker(mode, participants, resourceService, markerService) {
            var _this = this;
            this._participants = [];
            this._mode = mode;
            this._participants = participants;
            this.resourceService = resourceService;
            this.markerService = markerService;
            this._validationHelper = new validationHelper_1.ValidationHelper(this.resourceService, function (changed, notChanged, dueToConfigurationChange) { return _this._newValidate(changed, notChanged, dueToConfigurationChange); }, function (resource) { return _this._shouldIncludeModelInValidation(resource); }, 500);
            this.inplaceReplaceSupport = this._createInPlaceReplaceSupport();
        }
        AbstractModeWorker.prototype._createInPlaceReplaceSupport = function () {
            return new supports_1.WorkerInplaceReplaceSupport(this.resourceService);
        };
        AbstractModeWorker.prototype._getMode = function () {
            return this._mode;
        };
        AbstractModeWorker.prototype._getWorkerParticipants = function (select) {
            return this._participants.filter(select);
        };
        // ---- validation -----------------------------------------
        AbstractModeWorker.prototype._shouldIncludeModelInValidation = function (resource) {
            return resource.getMode().getId() === this._mode.getId();
        };
        AbstractModeWorker.prototype.enableValidator = function () {
            this._validationHelper.enable();
            return winjs_base_1.TPromise.as(null);
        };
        AbstractModeWorker.prototype._newValidate = function (changed, notChanged, dueToConfigurationChange) {
            this.doValidateOnChange(changed, notChanged, dueToConfigurationChange);
        };
        AbstractModeWorker.prototype._getContextForValidationParticipants = function (resource) {
            return null;
        };
        AbstractModeWorker.prototype.doValidateOnChange = function (changed, notChanged, dueToConfigurationChange) {
            if (dueToConfigurationChange) {
                for (var i = 0; i < changed.length; i++) {
                    this.doValidate(changed[i]);
                }
                for (var i = 0; i < notChanged.length; i++) {
                    this.doValidate(notChanged[i]);
                }
            }
            else {
                for (var i = 0; i < changed.length; i++) {
                    this.doValidate(changed[i]);
                }
            }
        };
        AbstractModeWorker.prototype.doValidate = function (resource) {
            return null;
        };
        // ---- suggestion ---------------------------------------------------------------------------------------
        AbstractModeWorker.prototype.suggest = function (resource, position) {
            var _this = this;
            return this.doSuggest(resource, position).then(function (value) {
                if (!value) {
                    return;
                }
                // filter suggestions
                var accept = _this.getSuggestionFilter(), result = [];
                result.push({
                    currentWord: value.currentWord,
                    suggestions: value.suggestions.filter(function (element) { return !!accept(value.currentWord, element); }),
                    incomplete: value.incomplete
                });
                return result;
            }, function (error) {
                return [{
                        currentWord: '',
                        suggestions: []
                    }];
            });
        };
        AbstractModeWorker.prototype._getSuggestContext = function (resource) {
            return winjs_base_1.TPromise.as(undefined);
        };
        AbstractModeWorker.prototype.doSuggest = function (resource, position) {
            var model = this.resourceService.get(resource), currentWord = model.getWordUntilPosition(position).word;
            var result = {
                currentWord: currentWord,
                suggestions: []
            };
            result.suggestions.push.apply(result.suggestions, this.suggestWords(resource, position, false));
            result.suggestions.push.apply(result.suggestions, this.suggestSnippets(resource, position));
            return winjs_base_1.TPromise.as(result);
        };
        AbstractModeWorker.prototype.suggestWords = function (resource, position, mustHaveCurrentWord) {
            var modelMirror = this.resourceService.get(resource);
            var currentWord = modelMirror.getWordUntilPosition(position).word;
            var allWords = modelMirror.getAllUniqueWords(currentWord);
            if (mustHaveCurrentWord && !currentWord) {
                return [];
            }
            return allWords.filter(function (word) {
                return !(/^-?\d*\.?\d/.test(word)); // filter out numbers
            }).map(function (word) {
                return {
                    type: 'text',
                    label: word,
                    codeSnippet: word,
                    noAutoAccept: true
                };
            });
        };
        AbstractModeWorker.prototype.suggestSnippets = function (resource, position) {
            return [];
        };
        AbstractModeWorker.prototype.getSuggestionFilter = function () {
            return AbstractModeWorker.filter;
        };
        // ---- diff --------------------------------------------------------------------------
        AbstractModeWorker.prototype.computeDiff = function (original, modified, ignoreTrimWhitespace) {
            var originalModel = this.resourceService.get(original);
            var modifiedModel = this.resourceService.get(modified);
            if (originalModel !== null && modifiedModel !== null) {
                var originalLines = originalModel.getLinesContent();
                var modifiedLines = modifiedModel.getLinesContent();
                var diffComputer = new diffComputer_1.DiffComputer(originalLines, modifiedLines, {
                    shouldPostProcessCharChanges: true,
                    shouldIgnoreTrimWhitespace: ignoreTrimWhitespace,
                    shouldConsiderTrimWhitespaceInEmptyCase: true
                });
                return winjs_base_1.TPromise.as(diffComputer.computeDiff());
            }
            return winjs_base_1.TPromise.as(null);
        };
        // ---- dirty diff --------------------------------------------------------------------
        AbstractModeWorker.prototype.computeDirtyDiff = function (resource, ignoreTrimWhitespace) {
            var model = this.resourceService.get(resource);
            var original = model.getProperty('original');
            if (original && model !== null) {
                var splitText = textModel_1.TextModel.toRawText(original);
                var originalLines = splitText.lines;
                var modifiedLines = model.getLinesContent();
                var diffComputer = new diffComputer_1.DiffComputer(originalLines, modifiedLines, {
                    shouldPostProcessCharChanges: false,
                    shouldIgnoreTrimWhitespace: ignoreTrimWhitespace,
                    shouldConsiderTrimWhitespaceInEmptyCase: false
                });
                return winjs_base_1.TPromise.as(diffComputer.computeDiff());
            }
            return winjs_base_1.TPromise.as([]);
        };
        // ---- link detection ------------------------------------------------------------------
        AbstractModeWorker.prototype.computeLinks = function (resource) {
            var model = this.resourceService.get(resource), links = linkComputer_1.computeLinks(model);
            return winjs_base_1.TPromise.as(links);
        };
        AbstractModeWorker.prototype.configure = function (options) {
            var _this = this;
            var p = this._doConfigure(options);
            if (p) {
                return p.then(function (shouldRevalidate) {
                    if (shouldRevalidate) {
                        _this._validationHelper.triggerDueToConfigurationChange();
                    }
                    return true;
                });
            }
        };
        /**
         * @return true if you want to revalidate your models
         */
        AbstractModeWorker.prototype._doConfigure = function (options) {
            return winjs_base_1.TPromise.as(true);
        };
        AbstractModeWorker.filter = modesFilters_1.DefaultFilter;
        AbstractModeWorker = __decorate([
            __param(2, resourceService_1.IResourceService),
            __param(3, markers_1.IMarkerService)
        ], AbstractModeWorker);
        return AbstractModeWorker;
    })();
    exports.AbstractModeWorker = AbstractModeWorker;
});
//# sourceMappingURL=abstractModeWorker.js.map