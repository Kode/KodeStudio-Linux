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
define(["require", "exports", 'vs/base/common/winjs.base', 'vs/editor/common/services/modeService', 'vs/editor/common/modes/supports', 'vs/editor/common/modes/abstractMode', 'vs/editor/common/modes/languageExtensionPoint', 'vs/base/common/errors', 'vs/platform/thread/common/thread', 'vs/base/common/objects', 'vs/editor/common/modes/monarch/monarchDefinition', 'vs/editor/common/modes/monarch/monarchLexer', 'vs/editor/common/modes/monarch/monarchCompile', 'vs/platform/platform', 'vs/editor/common/modes/modesRegistry', 'vs/editor/common/modes/supports/onEnter', 'vs/base/common/lifecycle'], function (require, exports, winjs_base_1, modeService_1, Supports, abstractMode_1, languageExtensionPoint_1, Errors, thread_1, Objects, MonarchDefinition, monarchLexer_1, monarchCompile_1, platform_1, modesRegistry_1, onEnter_1, lifecycle_1) {
    var ModeServiceImpl = (function () {
        function ModeServiceImpl(threadService, pluginService) {
            this.serviceId = modeService_1.IModeService;
            this._threadService = threadService;
            this._pluginService = pluginService;
            this._activationPromises = {};
            this._instantiatedModes = {};
            this._frankensteinModes = {};
            this._config = {};
        }
        ModeServiceImpl.prototype.getConfigurationForMode = function (modeId) {
            return this._config[modeId] || {};
        };
        ModeServiceImpl.prototype.configureMode = function (mimetype, options) {
            var modeId = this.getModeId(mimetype);
            if (modeId) {
                this.configureModeById(modeId, options);
            }
        };
        ModeServiceImpl.prototype.configureModeById = function (modeId, options) {
            var previousOptions = this._config[modeId] || {};
            var newOptions = Objects.mixin(Objects.clone(previousOptions), options);
            if (Objects.equals(previousOptions, newOptions)) {
                // This configure call is a no-op
                return;
            }
            this._config[modeId] = newOptions;
            var mode = this.getMode(modeId);
            if (mode && mode.configSupport) {
                mode.configSupport.configure(this.getConfigurationForMode(modeId));
            }
        };
        ModeServiceImpl.prototype.configureAllModes = function (config) {
            var _this = this;
            if (!config) {
                return;
            }
            var modeRegistry = platform_1.Registry.as(modesRegistry_1.Extensions.EditorModes);
            var modes = modeRegistry.getRegisteredModes();
            modes.forEach(function (modeIdentifier) {
                var configuration = config[modeIdentifier];
                _this.configureModeById(modeIdentifier, configuration);
            });
        };
        // --- instantiation
        ModeServiceImpl.prototype.lookup = function (commaSeparatedMimetypesOrCommaSeparatedIds) {
            var r = [];
            var modeIds = languageExtensionPoint_1.LanguageExtensions.extractModeIds(commaSeparatedMimetypesOrCommaSeparatedIds);
            for (var i = 0; i < modeIds.length; i++) {
                var modeId = modeIds[i];
                r.push({
                    modeId: modeId,
                    isInstantiated: this._instantiatedModes.hasOwnProperty(modeId)
                });
            }
            return r;
        };
        ModeServiceImpl.prototype.getMode = function (commaSeparatedMimetypesOrCommaSeparatedIds) {
            var modeIds = languageExtensionPoint_1.LanguageExtensions.extractModeIds(commaSeparatedMimetypesOrCommaSeparatedIds);
            var isPlainText = false;
            for (var i = 0; i < modeIds.length; i++) {
                if (this._instantiatedModes.hasOwnProperty(modeIds[i])) {
                    return this._instantiatedModes[modeIds[i]];
                }
                isPlainText = isPlainText || (modeIds[i] === 'plaintext');
            }
            if (isPlainText) {
                // Try to do it synchronously
                var r = null;
                this.getOrCreateMode(commaSeparatedMimetypesOrCommaSeparatedIds).then(function (mode) {
                    r = mode;
                }).done(null, Errors.onUnexpectedError);
                return r;
            }
        };
        ModeServiceImpl.prototype.getModeId = function (commaSeparatedMimetypesOrCommaSeparatedIds) {
            var modeIds = languageExtensionPoint_1.LanguageExtensions.extractModeIds(commaSeparatedMimetypesOrCommaSeparatedIds);
            if (modeIds.length > 0) {
                return modeIds[0];
            }
            return null;
        };
        ModeServiceImpl.prototype.getModeIdByLanguageName = function (languageName) {
            var modeIds = languageExtensionPoint_1.LanguageExtensions.getModeIdsFromLanguageName(languageName);
            if (modeIds.length > 0) {
                return modeIds[0];
            }
            return null;
        };
        ModeServiceImpl.prototype.getModeIdByFilenameOrFirstLine = function (filename, firstLine) {
            var modeIds = languageExtensionPoint_1.LanguageExtensions.getModeIdsFromFilenameOrFirstLine(filename, firstLine);
            if (modeIds.length > 0) {
                return modeIds[0];
            }
            return null;
        };
        ModeServiceImpl.prototype.getOrCreateMode = function (commaSeparatedMimetypesOrCommaSeparatedIds) {
            var _this = this;
            return this._pluginService.onReady().then(function () {
                var modeId = _this.getModeId(commaSeparatedMimetypesOrCommaSeparatedIds);
                // Fall back to plain text if no mode was found
                return _this._getOrCreateMode(modeId || 'plaintext');
            });
        };
        ModeServiceImpl.prototype.getOrCreateModeByLanguageName = function (languageName) {
            var _this = this;
            return this._pluginService.onReady().then(function () {
                var modeId = _this.getModeIdByLanguageName(languageName);
                // Fall back to plain text if no mode was found
                return _this._getOrCreateMode(modeId || 'plaintext');
            });
        };
        ModeServiceImpl.prototype.getOrCreateModeByFilenameOrFirstLine = function (filename, firstLine) {
            var _this = this;
            return this._pluginService.onReady().then(function () {
                var modeId = _this.getModeIdByFilenameOrFirstLine(filename, firstLine);
                // Fall back to plain text if no mode was found
                return _this._getOrCreateMode(modeId || 'plaintext');
            });
        };
        ModeServiceImpl.prototype._getOrCreateMode = function (modeId) {
            var _this = this;
            if (this._instantiatedModes.hasOwnProperty(modeId)) {
                return winjs_base_1.TPromise.as(this._instantiatedModes[modeId]);
            }
            if (this._activationPromises.hasOwnProperty(modeId)) {
                return this._activationPromises[modeId];
            }
            var c, e;
            var promise = new winjs_base_1.TPromise(function (cc, ee, pp) { c = cc; e = ee; });
            this._activationPromises[modeId] = promise;
            this._createMode(modeId).then(function (mode) {
                _this._instantiatedModes[modeId] = mode;
                delete _this._activationPromises[modeId];
                return _this._instantiatedModes[modeId];
            }).then(c, e);
            return promise;
        };
        ModeServiceImpl.prototype._createMode = function (modeId) {
            var _this = this;
            var activationEvent = 'onLanguage:' + modeId;
            var compatModeAsyncDescriptor = languageExtensionPoint_1.LanguageExtensions.getCompatMode(modeId);
            if (compatModeAsyncDescriptor) {
                return this._pluginService.activateByEvent(activationEvent).then(function (_) {
                    var modeDescriptor = _this._createModeDescriptor(modeId);
                    return _this._threadService.createInstance(compatModeAsyncDescriptor, modeDescriptor);
                }).then(function (compatMode) {
                    if (compatMode.configSupport) {
                        compatMode.configSupport.configure(_this.getConfigurationForMode(modeId));
                    }
                    return compatMode;
                });
            }
            else {
                var frankensteinMode = this._getOrCreateFrankensteinMode(modeId);
                this._pluginService.activateByEvent(activationEvent).done(null, Errors.onUnexpectedError);
                return winjs_base_1.TPromise.as(frankensteinMode);
            }
        };
        ModeServiceImpl.prototype._getOrCreateFrankensteinMode = function (modeId) {
            if (!this._frankensteinModes.hasOwnProperty(modeId)) {
                var modeDescriptor = this._createModeDescriptor(modeId);
                this._frankensteinModes[modeId] = this._threadService.createInstance(abstractMode_1.FrankensteinMode, modeDescriptor);
            }
            return this._frankensteinModes[modeId];
        };
        ModeServiceImpl.prototype._createModeDescriptor = function (modeId) {
            var modesRegistry = platform_1.Registry.as(modesRegistry_1.Extensions.EditorModes);
            var workerParticipants = modesRegistry.getWorkerParticipants(modeId);
            return {
                id: modeId,
                workerParticipants: workerParticipants
            };
        };
        ModeServiceImpl.prototype.registerModeSupport = function (modeId, support, callback) {
            var promise = this._getOrCreateMode(modeId).then(function (mode) {
                if (mode.registerSupport) {
                    return mode.registerSupport(support, callback);
                }
                else {
                    console.warn('Cannot register support ' + support + ' on mode ' + modeId + ' because it is not a Frankenstein mode');
                    return lifecycle_1.empty;
                }
            });
            return {
                dispose: function () {
                    promise.done(function (disposable) { return disposable.dispose(); }, null);
                }
            };
        };
        ModeServiceImpl.prototype.doRegisterMonarchDefinition = function (modeId, lexer) {
            var _this = this;
            return lifecycle_1.combinedDispose(this.registerTokenizationSupport(modeId, function (mode) {
                return monarchLexer_1.createTokenizationSupport(_this, mode, lexer);
            }), this.registerDeclarativeCommentsSupport(modeId, MonarchDefinition.createCommentsSupport(lexer)), this.registerDeclarativeElectricCharacterSupport(modeId, MonarchDefinition.createBracketElectricCharacterContribution(lexer)), this.registerDeclarativeTokenTypeClassificationSupport(modeId, MonarchDefinition.createTokenTypeClassificationSupportContribution(lexer)), this.registerDeclarativeCharacterPairSupport(modeId, MonarchDefinition.createCharacterPairContribution(lexer)), this.registerDeclarativeOnEnterSupport(modeId, MonarchDefinition.createOnEnterSupportOptions(lexer)));
        };
        ModeServiceImpl.prototype.registerMonarchDefinition = function (modeId, language) {
            var lexer = monarchCompile_1.compile(Objects.clone(language));
            return this.doRegisterMonarchDefinition(modeId, lexer);
        };
        ModeServiceImpl.prototype.registerDeclarativeCharacterPairSupport = function (modeId, support) {
            return this.registerModeSupport(modeId, 'characterPairSupport', function (mode) { return new Supports.CharacterPairSupport(mode, support); });
        };
        ModeServiceImpl.prototype.registerCodeLensSupport = function (modeId, support) {
            return this.registerModeSupport(modeId, 'codeLensSupport', function (mode) { return support; });
        };
        ModeServiceImpl.prototype.registerDeclarativeCommentsSupport = function (modeId, support) {
            return this.registerModeSupport(modeId, 'commentsSupport', function (mode) { return new Supports.CommentsSupport(support); });
        };
        ModeServiceImpl.prototype.registerDeclarativeDeclarationSupport = function (modeId, contribution) {
            return this.registerModeSupport(modeId, 'declarationSupport', function (mode) { return new Supports.DeclarationSupport(mode, contribution); });
        };
        ModeServiceImpl.prototype.registerDeclarativeElectricCharacterSupport = function (modeId, support) {
            return this.registerModeSupport(modeId, 'electricCharacterSupport', function (mode) { return new Supports.BracketElectricCharacterSupport(mode, support); });
        };
        ModeServiceImpl.prototype.registerExtraInfoSupport = function (modeId, support) {
            return this.registerModeSupport(modeId, 'extraInfoSupport', function (mode) { return support; });
        };
        ModeServiceImpl.prototype.registerFormattingSupport = function (modeId, support) {
            return this.registerModeSupport(modeId, 'formattingSupport', function (mode) { return support; });
        };
        ModeServiceImpl.prototype.registerInplaceReplaceSupport = function (modeId, support) {
            return this.registerModeSupport(modeId, 'inplaceReplaceSupport', function (mode) { return support; });
        };
        ModeServiceImpl.prototype.registerOccurrencesSupport = function (modeId, support) {
            return this.registerModeSupport(modeId, 'occurrencesSupport', function (mode) { return support; });
        };
        ModeServiceImpl.prototype.registerOutlineSupport = function (modeId, support) {
            return this.registerModeSupport(modeId, 'outlineSupport', function (mode) { return support; });
        };
        ModeServiceImpl.prototype.registerDeclarativeParameterHintsSupport = function (modeId, support) {
            return this.registerModeSupport(modeId, 'parameterHintsSupport', function (mode) { return new Supports.ParameterHintsSupport(mode, support); });
        };
        ModeServiceImpl.prototype.registerQuickFixSupport = function (modeId, support) {
            return this.registerModeSupport(modeId, 'quickFixSupport', function (mode) { return support; });
        };
        ModeServiceImpl.prototype.registerDeclarativeReferenceSupport = function (modeId, contribution) {
            return this.registerModeSupport(modeId, 'referenceSupport', function (mode) { return new Supports.ReferenceSupport(mode, contribution); });
        };
        ModeServiceImpl.prototype.registerRenameSupport = function (modeId, support) {
            return this.registerModeSupport(modeId, 'renameSupport', function (mode) { return support; });
        };
        ModeServiceImpl.prototype.registerDeclarativeSuggestSupport = function (modeId, declaration) {
            return this.registerModeSupport(modeId, 'suggestSupport', function (mode) { return new Supports.SuggestSupport(mode, declaration); });
        };
        ModeServiceImpl.prototype.registerTokenizationSupport = function (modeId, callback) {
            return this.registerModeSupport(modeId, 'tokenizationSupport', callback);
        };
        ModeServiceImpl.prototype.registerDeclarativeTokenTypeClassificationSupport = function (modeId, support) {
            return this.registerModeSupport(modeId, 'tokenTypeClassificationSupport', function (mode) { return new Supports.TokenTypeClassificationSupport(support); });
        };
        ModeServiceImpl.prototype.registerDeclarativeOnEnterSupport = function (modeId, opts) {
            return this.registerModeSupport(modeId, 'onEnterSupport', function (mode) { return new onEnter_1.OnEnterSupport(modeId, opts); });
        };
        return ModeServiceImpl;
    })();
    exports.ModeServiceImpl = ModeServiceImpl;
    var MainThreadModeServiceImpl = (function (_super) {
        __extends(MainThreadModeServiceImpl, _super);
        function MainThreadModeServiceImpl(threadService, pluginService, modelService) {
            _super.call(this, threadService, pluginService);
            this._modelService = modelService;
            this._hasInitialized = false;
        }
        MainThreadModeServiceImpl.prototype._getModeServiceWorkerHelper = function () {
            var r = this._threadService.getRemotable(ModeServiceWorkerHelper);
            if (!this._hasInitialized) {
                this._hasInitialized = true;
                var modeRegistry = platform_1.Registry.as(modesRegistry_1.Extensions.EditorModes);
                r.initialize(modeRegistry._getAllWorkerParticipants());
            }
            return r;
        };
        MainThreadModeServiceImpl.prototype.configureModeById = function (modeId, options) {
            this._getModeServiceWorkerHelper().configureModeById(modeId, options);
            _super.prototype.configureModeById.call(this, modeId, options);
        };
        MainThreadModeServiceImpl.prototype._createMode = function (modeId) {
            // Instantiate mode also in worker
            this._getModeServiceWorkerHelper().instantiateMode(modeId);
            return _super.prototype._createMode.call(this, modeId);
        };
        MainThreadModeServiceImpl.prototype.registerModeSupport = function (modeId, support, callback) {
            // Since there is a code path that leads to Frankenstein mode instantiation, instantiate mode also in worker
            this._getModeServiceWorkerHelper().instantiateMode(modeId);
            return _super.prototype.registerModeSupport.call(this, modeId, support, callback);
        };
        MainThreadModeServiceImpl.prototype.registerMonarchDefinition = function (modeId, language) {
            var _this = this;
            this._getModeServiceWorkerHelper().registerMonarchDefinition(modeId, language);
            var lexer = monarchCompile_1.compile(Objects.clone(language));
            return lifecycle_1.combinedDispose(_super.prototype.doRegisterMonarchDefinition.call(this, modeId, lexer), this.registerModeSupport(modeId, 'suggestSupport', function (mode) {
                return new Supports.ComposableSuggestSupport(mode, MonarchDefinition.createSuggestSupport(_this._modelService, mode, lexer));
            }));
        };
        return MainThreadModeServiceImpl;
    })(ModeServiceImpl);
    exports.MainThreadModeServiceImpl = MainThreadModeServiceImpl;
    var ModeServiceWorkerHelper = (function () {
        function ModeServiceWorkerHelper(modeService) {
            this._modeService = modeService;
        }
        ModeServiceWorkerHelper.prototype.initialize = function (workerParticipants) {
            var modeRegistry = platform_1.Registry.as(modesRegistry_1.Extensions.EditorModes);
            modeRegistry._setWorkerParticipants(workerParticipants);
        };
        ModeServiceWorkerHelper.prototype.instantiateMode = function (modeId) {
            this._modeService.getOrCreateMode(modeId).done(null, Errors.onUnexpectedError);
        };
        ModeServiceWorkerHelper.prototype.configureModeById = function (modeId, options) {
            this._modeService.configureMode(modeId, options);
        };
        ModeServiceWorkerHelper.prototype.registerMonarchDefinition = function (modeId, language) {
            this._modeService.registerMonarchDefinition(modeId, language);
        };
        ModeServiceWorkerHelper = __decorate([
            thread_1.Remotable.WorkerContext('ModeServiceWorkerHelper', thread_1.ThreadAffinity.All),
            __param(0, modeService_1.IModeService)
        ], ModeServiceWorkerHelper);
        return ModeServiceWorkerHelper;
    })();
    exports.ModeServiceWorkerHelper = ModeServiceWorkerHelper;
});
//# sourceMappingURL=modeServiceImpl.js.map