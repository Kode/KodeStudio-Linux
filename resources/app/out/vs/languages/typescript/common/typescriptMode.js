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
define(["require", "exports", 'vs/nls', 'vs/base/common/winjs.base', 'vs/base/common/uri', 'vs/editor/common/editorCommon', 'vs/editor/common/modes', 'vs/base/common/lifecycle', 'vs/base/common/async', 'vs/editor/common/modes/supports', 'vs/languages/typescript/common/features/tokenization', 'vs/languages/typescript/common/features/quickFixMainActions', 'vs/languages/typescript/common/typescript', 'vs/editor/common/modes/abstractMode', 'vs/editor/common/services/modelService', 'vs/platform/thread/common/threadService', 'vs/platform/instantiation/common/descriptors', 'vs/platform/telemetry/common/telemetry', 'vs/platform/thread/common/thread', 'vs/editor/common/modes/supports/onEnter', 'vs/platform/instantiation/common/instantiation'], function (require, exports, nls, WinJS, uri_1, EditorCommon, Modes, lifecycle, async, supports, tokenization, quickFixMainActions, typescript, abstractMode_1, modelService_1, threadService_1, descriptors_1, telemetry_1, thread_1, onEnter_1, instantiation_1) {
    var SemanticValidator = (function () {
        function SemanticValidator(mode, modelService) {
            var _this = this;
            this._listener = Object.create(null);
            this._lastValidationReq = 0;
            this._modelService = modelService;
            this._mode = mode;
            this._validation = new async.RunOnceScheduler(this._doValidate.bind(this), 750);
            if (this._modelService) {
                this._modelService.onModelAdded(this._onModelAdded, this);
                this._modelService.onModelRemoved(this._onModelRemoved, this);
                this._modelService.onModelModeChanged(function (event) {
                    // Handle a model mode changed as a remove + add
                    _this._onModelRemoved(event.model);
                    _this._onModelAdded(event.model);
                }, this);
                this._modelService.getModels().forEach(this._onModelAdded, this);
            }
        }
        SemanticValidator.prototype.dispose = function () {
            this._validation.dispose();
        };
        SemanticValidator.prototype.validateOpen = function () {
            this._scheduleValidation();
        };
        SemanticValidator.prototype._scheduleValidation = function (resource) {
            this._lastValidationReq += 1;
            this._lastChangedResource = resource;
            this._validation.schedule();
        };
        SemanticValidator.prototype._doValidate = function () {
            var _this = this;
            var resources = [];
            if (this._lastChangedResource) {
                resources.push(this._lastChangedResource);
            }
            for (var k in this._listener) {
                if (!this._lastChangedResource || k !== this._lastChangedResource.toString()) {
                    resources.push(uri_1.default.parse(k));
                }
            }
            var thisValidationReq = this._lastValidationReq;
            var validate = async.sequence(resources.map(function (r) {
                return function () {
                    if (!_this._modelService.getModel(r)) {
                        return WinJS.Promise.as(undefined);
                    }
                    if (thisValidationReq === _this._lastValidationReq) {
                        return _this._mode.performSemanticValidation(r);
                    }
                };
            }));
            validate.done(undefined, function (err) { return console.warn(err); });
        };
        SemanticValidator.prototype._onModelAdded = function (model) {
            var _this = this;
            if (!this._mode._shouldBeValidated(model)) {
                return;
            }
            var validate, unbind;
            validate = function () {
                _this._scheduleValidation(model.getAssociatedResource());
            };
            unbind = model.addListener(EditorCommon.EventType.ModelContentChanged2, function (_) { return validate(); });
            this._listener[model.getAssociatedResource().toString()] = unbind;
            validate();
        };
        SemanticValidator.prototype._onModelRemoved = function (model) {
            var unbind = this._listener[model.getAssociatedResource().toString()];
            if (unbind) {
                unbind();
                delete this._listener[model.getAssociatedResource().toString()];
            }
        };
        SemanticValidator = __decorate([
            __param(1, modelService_1.IModelService)
        ], SemanticValidator);
        return SemanticValidator;
    })();
    var TypeScriptMode = (function (_super) {
        __extends(TypeScriptMode, _super);
        function TypeScriptMode(descriptor, instantiationService, threadService, telemetryService) {
            var _this = this;
            _super.call(this, descriptor, instantiationService, threadService);
            this._disposables = [];
            this._telemetryService = telemetryService;
            if (this._threadService && this._threadService.isInMainThread) {
                // semantic validation from the client side
                this._semanticValidator = instantiationService.createInstance(SemanticValidator, this);
                this._disposables.push(this._semanticValidator);
                // create project resolver
                var desc = this._getProjectResolver();
                if (!desc) {
                    throw new Error('missing project resolver!');
                }
                if (desc instanceof descriptors_1.AsyncDescriptor) {
                    this._projectResolver = instantiationService.createInstance(desc, this).then(undefined, function (err) {
                        console.error(err);
                        return typescript.Defaults.ProjectResolver;
                    });
                }
                else {
                    this._projectResolver = WinJS.TPromise.as(desc);
                }
                this._projectResolver = this._projectResolver.then(function (instance) {
                    instance.setConsumer(_this);
                    return instance;
                });
            }
            this.extraInfoSupport = this;
            this.occurrencesSupport = this;
            this.formattingSupport = this;
            this.quickFixSupport = this;
            this.logicalSelectionSupport = this;
            this.outlineSupport = this;
            this.emitOutputSupport = this;
            this.renameSupport = this;
            this.tokenizationSupport = tokenization.createTokenizationSupport(this, tokenization.Language.TypeScript);
            this.electricCharacterSupport = new supports.BracketElectricCharacterSupport(this, {
                brackets: [
                    { tokenType: 'delimiter.bracket.ts', open: '{', close: '}', isElectric: true },
                    { tokenType: 'delimiter.array.ts', open: '[', close: ']', isElectric: true },
                    { tokenType: 'delimiter.parenthesis.ts', open: '(', close: ')', isElectric: true }
                ],
                docComment: { scope: 'comment.doc', open: '/**', lineStart: ' * ', close: ' */' } });
            this.referenceSupport = new supports.ReferenceSupport(this, {
                tokens: ['identifier.ts'],
                findReferences: function (resource, position, includeDeclaration) { return _this.findReferences(resource, position, includeDeclaration); } });
            this.declarationSupport = new supports.DeclarationSupport(this, {
                tokens: ['identifier.ts', 'string.ts', 'attribute.value.vs'],
                findDeclaration: function (resource, position) { return _this.findDeclaration(resource, position); } });
            this.parameterHintsSupport = new supports.ParameterHintsSupport(this, {
                triggerCharacters: ['(', ','],
                excludeTokens: ['string.ts'],
                getParameterHints: function (resource, position) { return _this.getParameterHints(resource, position); } });
            this.characterPairSupport = new supports.CharacterPairSupport(this, {
                autoClosingPairs: [{ open: '{', close: '}' },
                    { open: '[', close: ']' },
                    { open: '(', close: ')' },
                    { open: '"', close: '"', notIn: ['string'] },
                    { open: '\'', close: '\'', notIn: ['string', 'comment'] },
                    { open: '`', close: '`' }
                ] });
            this.suggestSupport = new supports.SuggestSupport(this, {
                triggerCharacters: ['.'],
                excludeTokens: ['string', 'comment', 'number'],
                sortBy: [{ type: 'reference', partSeparator: '/' }],
                suggest: function (resource, position) { return _this.suggest(resource, position); },
                getSuggestionDetails: function (resource, position, suggestion) { return _this.getSuggestionDetails(resource, position, suggestion); } });
            this.onEnterSupport = new onEnter_1.OnEnterSupport(this.getId(), {
                brackets: [
                    { open: '{', close: '}' },
                    { open: '[', close: ']' },
                    { open: '(', close: ')' },
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
        }
        TypeScriptMode.prototype.dispose = function () {
            this._disposables = lifecycle.disposeAll(this._disposables);
        };
        TypeScriptMode.prototype._shouldBeValidated = function (model) {
            return model.getMode() === this || /\.ts$/.test(model.getAssociatedResource().fsPath);
        };
        // ---- project sync
        TypeScriptMode.prototype._getProjectResolver = function () {
            return typescript.Extensions.getProjectResolver() || typescript.Defaults.ProjectResolver;
        };
        TypeScriptMode.prototype.acceptProjectChanges = function (changes) {
            this._semanticValidator.validateOpen();
            return this._doAcceptProjectChanges(changes);
        };
        TypeScriptMode.prototype._doAcceptProjectChanges = function (changes) {
            return this._worker(function (worker) { return worker.acceptProjectChanges(changes); });
        };
        TypeScriptMode.prototype.acceptFileChanges = function (changes) {
            var _this = this;
            var newLengthTotal = 0;
            for (var _i = 0; _i < changes.length; _i++) {
                var change = changes[_i];
                if (change.content) {
                    newLengthTotal += change.content.length;
                }
            }
            return this._canAcceptFileChanges(newLengthTotal).then(function (canAccept) {
                if (canAccept === false) {
                    return WinJS.TPromise.wrapError(nls.localize('err.tooMuchData', "Sorry, but there are too many JavaScript source files for VS Code. Consider using the exclude-property in jsconfig.json."));
                }
                return _this._doAcceptFileChanges(changes).then(function (accepted) {
                    _this._semanticValidator.validateOpen();
                    return accepted;
                });
            });
        };
        TypeScriptMode.prototype._canAcceptFileChanges = function (length) {
            return this._worker(function (worker) { return worker.canAcceptFileChanges(length); });
        };
        TypeScriptMode.prototype._doAcceptFileChanges = function (changes) {
            return this._worker(function (worker) { return worker.acceptFileChanges(changes); });
        };
        TypeScriptMode.prototype._defaultLib = function () {
            var _this = this;
            if (!this._defaultLibPromise) {
                var fileChanges = [];
                var p1 = new WinJS.TPromise(function (c, e) { return require([typescript.defaultLib.path.substr(1)], c, e); }).then(function (content) {
                    fileChanges.push({
                        kind: typescript.ChangeKind.Added,
                        resource: typescript.defaultLib,
                        content: content
                    });
                });
                var p2 = new WinJS.TPromise(function (c, e) { return require([typescript.defaultLibES6.path.substr(1)], c, e); }).then(function (content) {
                    fileChanges.push({
                        kind: typescript.ChangeKind.Added,
                        resource: typescript.defaultLibES6,
                        content: content
                    });
                });
                this._defaultLibPromise = WinJS.TPromise.join([p1, p2]).then(function (values) { return _this.acceptFileChanges(fileChanges); });
            }
            return new async.ShallowCancelThenPromise(this._defaultLibPromise);
        };
        TypeScriptMode.prototype._syncProjects = function () {
            var _this = this;
            if (this._projectResolver) {
                return this._defaultLib()
                    .then(function (_) { return _this._projectResolver; })
                    .then(function (r) { return r.resolveProjects(); });
            }
        };
        TypeScriptMode.prototype.configure = function (options) {
            var _this = this;
            var ret = _super.prototype.configure.call(this, options);
            if (this._semanticValidator) {
                ret.then(function (validate) { return validate && _this._semanticValidator.validateOpen(); });
            }
            return ret;
        };
        // ---- worker talk
        TypeScriptMode.prototype._getWorkerDescriptor = function () {
            return descriptors_1.createAsyncDescriptor2('vs/languages/typescript/common/typescriptWorker2', 'TypeScriptWorker2');
        };
        TypeScriptMode.prototype.getCommentsConfiguration = function () {
            return { lineCommentTokens: ['//'], blockCommentStartToken: '/*', blockCommentEndToken: '*/' };
        };
        TypeScriptMode.prototype._pickAWorkerToValidate = function () {
            return this._worker(function (w) { return w.enableValidator(); });
        };
        TypeScriptMode.prototype.performSemanticValidation = function (resource) {
            var _this = this;
            return this.doValidateSemantics(resource).then(function (missesFiles) {
                if (!missesFiles) {
                    return;
                }
                return _this.getMissingFiles().then(function (missing) {
                    if (missing) {
                        // console.log(`${resource.fsPath} misses ~${missing.length} resources`);
                        return _this._projectResolver.then(function (resolver) {
                            return resolver.resolveFiles(missing);
                        });
                    }
                });
            });
        };
        TypeScriptMode.prototype.doValidateSemantics = function (resource) {
            return this._worker(function (w) { return w.doValidateSemantics(resource); });
        };
        TypeScriptMode.prototype.getMissingFiles = function () {
            return this._worker(function (w) { return w.getMissingFiles(); });
        };
        TypeScriptMode.prototype.getOutline = function (resource) {
            return this._worker(function (w) { return w.getOutline(resource); });
        };
        TypeScriptMode.prototype.findOccurrences = function (resource, position, strict) {
            if (strict === void 0) { strict = false; }
            return this._worker(function (w) { return w.findOccurrences(resource, position, strict); });
        };
        TypeScriptMode.prototype.suggest = function (resource, position) {
            return this._worker(function (w) { return w.suggest(resource, position); });
        };
        TypeScriptMode.prototype.getSuggestionDetails = function (resource, position, suggestion) {
            return this._worker(function (w) { return w.getSuggestionDetails(resource, position, suggestion); });
        };
        TypeScriptMode.prototype.getParameterHints = function (resource, position) {
            return this._worker(function (w) { return w.getParameterHints(resource, position); });
        };
        TypeScriptMode.prototype.getEmitOutput = function (resource, type) {
            if (type === void 0) { type = undefined; }
            return this._worker(function (w) { return w.getEmitOutput(resource, type); });
        };
        TypeScriptMode.prototype.getWordDefinition = function () {
            return TypeScriptMode.WORD_DEFINITION;
        };
        TypeScriptMode.prototype.findReferences = function (resource, position, includeDeclaration) {
            return this._worker(function (w) { return w.findReferences(resource, position, includeDeclaration); });
        };
        Object.defineProperty(TypeScriptMode.prototype, "filter", {
            get: function () {
                return ['identifier.ts', 'string.ts'];
            },
            enumerable: true,
            configurable: true
        });
        TypeScriptMode.prototype.rename = function (resource, position, newName) {
            return this._worker(function (w) { return w.rename(resource, position, newName); });
        };
        TypeScriptMode.prototype.runQuickFixAction = function (resource, range, id) {
            var _this = this;
            var quickFixMainSupport = this._instantiationService.createInstance(quickFixMainActions.QuickFixMainActions);
            return quickFixMainSupport.evaluate(resource, range, id).then(function (action) {
                if (action) {
                    return action;
                }
                return _this.runQuickFixActionInWorker(resource, range, id);
            });
        };
        TypeScriptMode.prototype.runQuickFixActionInWorker = function (resource, range, id) {
            return this._worker(function (w) { return w.runQuickFixAction(resource, range, id); });
        };
        TypeScriptMode.prototype.getQuickFixes = function (resource, range) {
            return this._worker(function (w) { return w.getQuickFixes(resource, range); });
        };
        TypeScriptMode.prototype.getRangesToPosition = function (resource, position) {
            return this._worker(function (w) { return w.getRangesToPosition(resource, position); });
        };
        TypeScriptMode.prototype.findDeclaration = function (resource, position) {
            return this._worker(function (w) { return w.findDeclaration(resource, position); });
        };
        TypeScriptMode.prototype.computeInfo = function (resource, position) {
            return this._worker(function (w) { return w.computeInfo(resource, position); });
        };
        Object.defineProperty(TypeScriptMode.prototype, "autoFormatTriggerCharacters", {
            get: function () {
                return [';', '}', '\n'];
            },
            enumerable: true,
            configurable: true
        });
        TypeScriptMode.prototype.formatDocument = function (resource, options) {
            return this._worker(function (w) { return w.formatDocument(resource, options); });
        };
        TypeScriptMode.prototype.formatRange = function (resource, range, options) {
            return this._worker(function (w) { return w.formatRange(resource, range, options); });
        };
        TypeScriptMode.prototype.formatAfterKeystroke = function (resource, position, ch, options) {
            return this._worker(function (w) { return w.formatAfterKeystroke(resource, position, ch, options); });
        };
        TypeScriptMode.$_doAcceptProjectChanges = threadService_1.AllWorkersAttr(TypeScriptMode, TypeScriptMode.prototype._doAcceptProjectChanges);
        TypeScriptMode.$_canAcceptFileChanges = threadService_1.OneWorkerAttr(TypeScriptMode, TypeScriptMode.prototype._canAcceptFileChanges);
        TypeScriptMode.$_doAcceptFileChanges = threadService_1.AllWorkersAttr(TypeScriptMode, TypeScriptMode.prototype._doAcceptFileChanges);
        TypeScriptMode.$_pickAWorkerToValidate = threadService_1.OneWorkerAttr(TypeScriptMode, TypeScriptMode.prototype._pickAWorkerToValidate, TypeScriptMode.prototype._syncProjects, thread_1.ThreadAffinity.Group3);
        TypeScriptMode.$doValidateSemantics = threadService_1.OneWorkerAttr(TypeScriptMode, TypeScriptMode.prototype.doValidateSemantics, TypeScriptMode.prototype._syncProjects, thread_1.ThreadAffinity.Group3);
        TypeScriptMode.$getMissingFiles = threadService_1.OneWorkerAttr(TypeScriptMode, TypeScriptMode.prototype.getMissingFiles, TypeScriptMode.prototype._syncProjects, thread_1.ThreadAffinity.Group3);
        TypeScriptMode.$getOutline = threadService_1.OneWorkerAttr(TypeScriptMode, TypeScriptMode.prototype.getOutline, TypeScriptMode.prototype._syncProjects, thread_1.ThreadAffinity.Group1);
        TypeScriptMode.$findOccurrences = threadService_1.OneWorkerAttr(TypeScriptMode, TypeScriptMode.prototype.findOccurrences, TypeScriptMode.prototype._syncProjects, thread_1.ThreadAffinity.Group2);
        TypeScriptMode.$suggest = threadService_1.OneWorkerAttr(TypeScriptMode, TypeScriptMode.prototype.suggest, TypeScriptMode.prototype._syncProjects, thread_1.ThreadAffinity.Group2);
        TypeScriptMode.$getSuggestionDetails = threadService_1.OneWorkerAttr(TypeScriptMode, TypeScriptMode.prototype.getSuggestionDetails, TypeScriptMode.prototype._syncProjects, thread_1.ThreadAffinity.Group2);
        TypeScriptMode.$getParameterHints = threadService_1.OneWorkerAttr(TypeScriptMode, TypeScriptMode.prototype.getParameterHints, TypeScriptMode.prototype._syncProjects, thread_1.ThreadAffinity.Group2);
        TypeScriptMode.$getEmitOutput = threadService_1.OneWorkerAttr(TypeScriptMode, TypeScriptMode.prototype.getEmitOutput, TypeScriptMode.prototype._syncProjects, thread_1.ThreadAffinity.Group3);
        TypeScriptMode.WORD_DEFINITION = abstractMode_1.createWordRegExp('$');
        TypeScriptMode.$findReferences = threadService_1.OneWorkerAttr(TypeScriptMode, TypeScriptMode.prototype.findReferences, TypeScriptMode.prototype._syncProjects, thread_1.ThreadAffinity.Group3);
        TypeScriptMode.$rename = threadService_1.OneWorkerAttr(TypeScriptMode, TypeScriptMode.prototype.rename, TypeScriptMode.prototype._syncProjects, thread_1.ThreadAffinity.Group2);
        TypeScriptMode.$runQuickFixActionInWorker = threadService_1.OneWorkerAttr(TypeScriptMode, TypeScriptMode.prototype.runQuickFixActionInWorker, TypeScriptMode.prototype._syncProjects, thread_1.ThreadAffinity.Group2);
        TypeScriptMode.$getQuickFixes = threadService_1.OneWorkerAttr(TypeScriptMode, TypeScriptMode.prototype.getQuickFixes, TypeScriptMode.prototype._syncProjects, thread_1.ThreadAffinity.Group2);
        TypeScriptMode.$getRangesToPosition = threadService_1.OneWorkerAttr(TypeScriptMode, TypeScriptMode.prototype.getRangesToPosition, TypeScriptMode.prototype._syncProjects, thread_1.ThreadAffinity.Group1);
        TypeScriptMode.$findDeclaration = threadService_1.OneWorkerAttr(TypeScriptMode, TypeScriptMode.prototype.findDeclaration, TypeScriptMode.prototype._syncProjects, thread_1.ThreadAffinity.Group2);
        TypeScriptMode.$computeInfo = threadService_1.OneWorkerAttr(TypeScriptMode, TypeScriptMode.prototype.computeInfo, TypeScriptMode.prototype._syncProjects, thread_1.ThreadAffinity.Group2);
        TypeScriptMode.$formatDocument = threadService_1.OneWorkerAttr(TypeScriptMode, TypeScriptMode.prototype.formatDocument, TypeScriptMode.prototype._syncProjects, thread_1.ThreadAffinity.Group1);
        TypeScriptMode.$formatRange = threadService_1.OneWorkerAttr(TypeScriptMode, TypeScriptMode.prototype.formatRange, TypeScriptMode.prototype._syncProjects, thread_1.ThreadAffinity.Group1);
        TypeScriptMode.$formatAfterKeystroke = threadService_1.OneWorkerAttr(TypeScriptMode, TypeScriptMode.prototype.formatAfterKeystroke, TypeScriptMode.prototype._syncProjects, thread_1.ThreadAffinity.Group1);
        TypeScriptMode = __decorate([
            __param(1, instantiation_1.IInstantiationService),
            __param(2, thread_1.IThreadService),
            __param(3, telemetry_1.ITelemetryService)
        ], TypeScriptMode);
        return TypeScriptMode;
    })(abstractMode_1.AbstractMode);
    exports.TypeScriptMode = TypeScriptMode;
});
//# sourceMappingURL=typescriptMode.js.map