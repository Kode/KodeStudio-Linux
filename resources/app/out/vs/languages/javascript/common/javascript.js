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
define(["require", "exports", 'vs/base/common/winjs.base', 'vs/languages/typescript/common/features/tokenization', 'vs/languages/typescript/common/typescriptMode', 'vs/editor/common/modes', 'vs/editor/common/modes/supports', 'vs/languages/javascript/common/javascript.extensions', 'vs/editor/common/modes/abstractMode', 'vs/platform/instantiation/common/descriptors', 'vs/editor/common/modes/supports/onEnter', 'vs/platform/thread/common/thread', 'vs/platform/instantiation/common/instantiation', 'vs/platform/telemetry/common/telemetry'], function (require, exports, winjs, tokenization, typescriptMode, Modes, supports, extensions, abstractMode_1, descriptors_1, onEnter_1, thread_1, instantiation_1, telemetry_1) {
    var JSMode = (function (_super) {
        __extends(JSMode, _super);
        function JSMode(descriptor, instantiationService, threadService, telemetryService) {
            var _this = this;
            _super.call(this, descriptor, instantiationService, threadService, telemetryService);
            this.tokenizationSupport = tokenization.createTokenizationSupport(this, tokenization.Language.EcmaScript5);
            this.referenceSupport = new supports.ReferenceSupport(this, {
                tokens: [],
                findReferences: function (resource, position, includeDeclaration) { return _this.findReferences(resource, position, includeDeclaration); } });
            this.declarationSupport = new supports.DeclarationSupport(this, {
                tokens: [],
                findDeclaration: function (resource, position) { return _this.findDeclaration(resource, position); } });
            this.parameterHintsSupport = new supports.ParameterHintsSupport(this, {
                triggerCharacters: ['(', ','],
                excludeTokens: ['string.js', 'string.escape.js'],
                getParameterHints: function (resource, position) { return _this.getParameterHints(resource, position); } });
            this.electricCharacterSupport = new supports.BracketElectricCharacterSupport(this, {
                brackets: [
                    { tokenType: 'delimiter.bracket.js', open: '{', close: '}', isElectric: true },
                    { tokenType: 'delimiter.array.js', open: '[', close: ']', isElectric: true },
                    { tokenType: 'delimiter.parenthesis.js', open: '(', close: ')', isElectric: true }],
                docComment: { scope: 'comment.doc', open: '/**', lineStart: ' * ', close: ' */' }
            });
            this.characterPairSupport = new supports.CharacterPairSupport(this, {
                autoClosingPairs: [{ open: '{', close: '}' },
                    { open: '[', close: ']' },
                    { open: '(', close: ')' },
                    { open: '"', close: '"', notIn: ['string'] },
                    { open: '\'', close: '\'', notIn: ['string', 'comment'] }
                ] });
            this.onEnterSupport = new onEnter_1.OnEnterSupport(this.getId(), {
                brackets: [
                    { open: '(', close: ')' },
                    { open: '{', close: '}' },
                    { open: '[', close: ']' }
                ],
                regExpRules: [
                    {
                        // e.g. /** | */
                        beforeText: /^\s*\/\*\*(?!\/)([^\*]|\*(?!\/))*$/,
                        afterText: /^\s*\*\/$/,
                        action: { indentAction: Modes.IndentAction.IndentOutdent, appendText: ' * ' }
                    },
                    {
                        // e.g. /** ...|
                        beforeText: /^\s*\/\*\*(?!\/)([^\*]|\*(?!\/))*$/,
                        action: { indentAction: Modes.IndentAction.None, appendText: ' * ' }
                    },
                    {
                        // e.g.  * ...|
                        beforeText: /^(\t|(\ \ ))*\ \*(\ ([^\*]|\*(?!\/))*)?$/,
                        action: { indentAction: Modes.IndentAction.None, appendText: '* ' }
                    },
                    {
                        // e.g.  */|
                        beforeText: /^(\t|(\ \ ))*\ \*\/\s*$/,
                        action: { indentAction: Modes.IndentAction.None, removeText: 1 }
                    }
                ]
            });
            this.suggestSupport = new supports.SuggestSupport(this, {
                triggerCharacters: ['.'],
                excludeTokens: ['string', 'comment', 'number', 'numeric'],
                sortBy: [{ type: 'reference', partSeparator: '/' }],
                suggest: function (resource, position) { return _this.suggest(resource, position); },
                getSuggestionDetails: function (resource, position, suggestion) { return _this.getSuggestionDetails(resource, position, suggestion); } });
        }
        JSMode.prototype.asyncCtor = function () {
            var _this = this;
            if (!this._threadService.isInMainThread) {
                return new winjs.Promise(function (c, e, p) {
                    // TODO@Alex: workaround for missing `bundles` config, before instantiating the javascriptWorker, we ensure the typescriptWorker has been loaded
                    require(['vs/languages/typescript/common/typescriptWorker2'], function (worker) {
                        c(_this);
                    });
                });
            }
            else {
                return winjs.Promise.as(this);
            }
        };
        // ---- specialize by override
        JSMode.prototype._getProjectResolver = function () {
            return extensions.Extensions.getProjectResolver() || extensions.Defaults.ProjectResolver;
        };
        JSMode.prototype._shouldBeValidated = function (model) {
            return model.getMode() === this || /\.(d\.ts|js)$/.test(model.getAssociatedResource().fsPath);
        };
        JSMode.prototype._getWorkerDescriptor = function () {
            return descriptors_1.createAsyncDescriptor2('vs/languages/javascript/common/javascriptWorker', 'JavaScriptWorker');
        };
        JSMode.prototype.getCommentsConfiguration = function () {
            return { lineCommentTokens: ['//'], blockCommentStartToken: '/*', blockCommentEndToken: '*/' };
        };
        JSMode.prototype.getWordDefinition = function () {
            return JSMode.JS_WORD_DEFINITION;
        };
        Object.defineProperty(JSMode.prototype, "filter", {
            get: function () {
                return void 0;
            },
            enumerable: true,
            configurable: true
        });
        JSMode.JS_WORD_DEFINITION = abstractMode_1.createWordRegExp('$');
        JSMode = __decorate([
            __param(1, instantiation_1.IInstantiationService),
            __param(2, thread_1.IThreadService),
            __param(3, telemetry_1.ITelemetryService)
        ], JSMode);
        return JSMode;
    })(typescriptMode.TypeScriptMode);
    exports.JSMode = JSMode;
});
//# sourceMappingURL=javascript.js.map