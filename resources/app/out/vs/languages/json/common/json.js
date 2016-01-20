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
define(["require", "exports", 'vs/editor/common/modes/supports', 'vs/platform/platform', 'vs/nls', 'vs/languages/json/common/features/tokenization', 'vs/editor/common/modes/abstractMode', 'vs/platform/thread/common/threadService', 'vs/platform/thread/common/thread', 'vs/platform/instantiation/common/descriptors', 'vs/editor/common/modes/supports/onEnter', 'vs/platform/jsonschemas/common/jsonContributionRegistry', 'vs/platform/instantiation/common/instantiation'], function (require, exports, supports, Platform, nls, tokenization, abstractMode_1, threadService_1, thread_1, descriptors_1, onEnter_1, jsonContributionRegistry_1, instantiation_1) {
    var JSONMode = (function (_super) {
        __extends(JSONMode, _super);
        function JSONMode(descriptor, instantiationService, threadService) {
            var _this = this;
            _super.call(this, descriptor, instantiationService, threadService);
            this.tokenizationSupport = tokenization.createTokenizationSupport(this, true);
            this.electricCharacterSupport = new supports.BracketElectricCharacterSupport(this, { brackets: [
                    { tokenType: 'delimiter.bracket.json', open: '{', close: '}', isElectric: true },
                    { tokenType: 'delimiter.array.json', open: '[', close: ']', isElectric: true }
                ] });
            this.extraInfoSupport = this;
            // Initialize Outline support
            this.outlineSupport = this;
            this.outlineGroupLabel = Object.create(null);
            this.outlineGroupLabel['object'] = nls.localize('object', "objects");
            this.outlineGroupLabel['array'] = nls.localize('array', "arrays");
            this.outlineGroupLabel['string'] = nls.localize('string', "strings");
            this.outlineGroupLabel['number'] = nls.localize('number', "numbers");
            this.outlineGroupLabel['boolean'] = nls.localize('boolean', "booleans");
            this.outlineGroupLabel['null'] = nls.localize('undefined', "undefined");
            this.formattingSupport = this;
            this.characterPairSupport = new supports.CharacterPairSupport(this, {
                autoClosingPairs: [{ open: '{', close: '}', notIn: ['string'] },
                    { open: '[', close: ']', notIn: ['string'] },
                    { open: '"', close: '"', notIn: ['string'] }
                ] });
            this.suggestSupport = new supports.SuggestSupport(this, {
                triggerCharacters: [],
                excludeTokens: ['comment.line.json', 'comment.block.json'],
                suggest: function (resource, position) { return _this.suggest(resource, position); } });
            this.onEnterSupport = new onEnter_1.OnEnterSupport(this.getId(), {
                brackets: [
                    { open: '{', close: '}' },
                    { open: '[', close: ']' }
                ]
            });
        }
        JSONMode.prototype.creationDone = function () {
            var _this = this;
            _super.prototype.creationDone.call(this);
            if (this._threadService.isInMainThread) {
                // Configure all workers
                this._configureWorkerSchemas(this.getSchemaConfiguration());
                var contributionRegistry = Platform.Registry.as(jsonContributionRegistry_1.Extensions.JSONContribution);
                contributionRegistry.addRegistryChangedListener(function (e) {
                    _this._configureWorkerSchemas(_this.getSchemaConfiguration());
                });
            }
        };
        JSONMode.prototype.getSchemaConfiguration = function () {
            var contributionRegistry = Platform.Registry.as(jsonContributionRegistry_1.Extensions.JSONContribution);
            return contributionRegistry.getSchemaContributions();
        };
        JSONMode.prototype.getSerializableState = function () {
            return this.getSchemaConfiguration();
        };
        JSONMode.prototype.setData = function (data) {
            // It is ok to not join the promise. Workers are managed using a special
            // worker promise and the next call to the worker will wait until this
            // call went through.
            this._worker(function (w) { return w.setSchemaContributions(data); });
        };
        JSONMode.prototype._getWorkerDescriptor = function () {
            return descriptors_1.createAsyncDescriptor2('vs/languages/json/common/jsonWorker', 'JSONWorker');
        };
        JSONMode.prototype._configureWorkerSchemas = function (data) {
            return this._worker(function (w) { return w.setSchemaContributions(data); });
        };
        JSONMode.prototype.computeInfo = function (resource, position) {
            return this._worker(function (w) { return w.computeInfo(resource, position); });
        };
        JSONMode.prototype.getOutline = function (resource) {
            return this._worker(function (w) { return w.getOutline(resource); });
        };
        JSONMode.prototype.formatDocument = function (resource, options) {
            return this._worker(function (w) { return w.format(resource, null, options); });
        };
        JSONMode.prototype.formatRange = function (resource, range, options) {
            return this._worker(function (w) { return w.format(resource, range, options); });
        };
        JSONMode.prototype.getCommentsConfiguration = function () {
            return {
                lineCommentTokens: ['//'],
                blockCommentStartToken: '/*',
                blockCommentEndToken: '*/'
            };
        };
        JSONMode.prototype.getWordDefinition = function () {
            return JSONMode.WORD_DEFINITION;
        };
        JSONMode.$_configureWorkerSchemas = threadService_1.AllWorkersAttr(JSONMode, JSONMode.prototype._configureWorkerSchemas);
        JSONMode.$computeInfo = threadService_1.OneWorkerAttr(JSONMode, JSONMode.prototype.computeInfo);
        JSONMode.$getOutline = threadService_1.OneWorkerAttr(JSONMode, JSONMode.prototype.getOutline);
        JSONMode.$formatDocument = threadService_1.OneWorkerAttr(JSONMode, JSONMode.prototype.formatDocument);
        JSONMode.$formatRange = threadService_1.OneWorkerAttr(JSONMode, JSONMode.prototype.formatRange);
        JSONMode.WORD_DEFINITION = abstractMode_1.createWordRegExp('.-');
        JSONMode = __decorate([
            __param(1, instantiation_1.IInstantiationService),
            __param(2, thread_1.IThreadService)
        ], JSONMode);
        return JSONMode;
    })(abstractMode_1.AbstractMode);
    exports.JSONMode = JSONMode;
});
//# sourceMappingURL=json.js.map