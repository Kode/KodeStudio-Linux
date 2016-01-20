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
define(["require", "exports", 'vs/base/common/eventEmitter', 'vs/editor/common/modes/modesFilters', 'vs/editor/common/modes/nullMode', 'vs/editor/common/modes/supports', 'vs/base/common/winjs.base', 'vs/platform/instantiation/common/instantiation', 'vs/platform/thread/common/thread', 'vs/platform/thread/common/threadService', 'vs/platform/instantiation/common/descriptors'], function (require, exports, eventEmitter_1, modesFilters_1, nullMode_1, supports_1, winjs_base_1, instantiation_1, thread_1, threadService_1, descriptors_1) {
    function createWordRegExp(allowInWords) {
        if (allowInWords === void 0) { allowInWords = ''; }
        return nullMode_1.NullMode.createWordRegExp(allowInWords);
    }
    exports.createWordRegExp = createWordRegExp;
    var AbstractMode = (function () {
        function AbstractMode(descriptor, instantiationService, threadService) {
            // adapters end
            this._eventEmitter = new eventEmitter_1.EventEmitter();
            this._instantiationService = instantiationService;
            this._threadService = threadService;
            this._descriptor = descriptor;
            this._options = null;
            this.autoValidateDelay = 500;
            this.suggestSupport = this;
            this.inplaceReplaceSupport = this;
            this.diffSupport = this;
            this.dirtyDiffSupport = this;
            this.linkSupport = this;
            this.configSupport = this;
            this.commentsSupport = this;
            this.tokenTypeClassificationSupport = this;
            this._workerPiecePromise = null;
            this._simplifiedMode = null;
        }
        AbstractMode.prototype.getId = function () {
            return this._descriptor.id;
        };
        AbstractMode.prototype.creationDone = function () {
            if (this._threadService.isInMainThread) {
                // Pick a worker to do validation
                this._pickAWorkerToValidate();
            }
        };
        AbstractMode.prototype.toSimplifiedMode = function () {
            if (!this._simplifiedMode) {
                this._simplifiedMode = new SimplifiedMode(this);
            }
            return this._simplifiedMode;
        };
        AbstractMode.prototype._getOrCreateWorker = function () {
            var _this = this;
            if (!this._workerPiecePromise) {
                var workerDescriptor = this._getWorkerDescriptor();
                // First, load the code of the worker (without instantiating it)
                this._workerPiecePromise = AbstractMode._loadModule(workerDescriptor.moduleName).then(function () {
                    // Then, load & instantiate all the participants
                    var participants = _this._descriptor.workerParticipants;
                    return winjs_base_1.TPromise.join(participants.map(function (participant) {
                        return _this._instantiationService.createInstance(participant);
                    }));
                }).then(function (participants) {
                    return _this._instantiationService.createInstance(workerDescriptor, _this, participants);
                });
            }
            return this._workerPiecePromise;
        };
        AbstractMode._loadModule = function (moduleName) {
            return new winjs_base_1.TPromise(function (c, e, p) {
                require([moduleName], c, e);
            }, function () {
                // Cannot cancel loading code
            });
        };
        AbstractMode.prototype._getWorkerDescriptor = function () {
            return descriptors_1.createAsyncDescriptor2('vs/editor/common/modes/nullWorker', 'NullWorker');
        };
        AbstractMode.prototype._worker = function (runner) {
            return this._getOrCreateWorker().then(runner);
        };
        AbstractMode.prototype._pickAWorkerToValidate = function () {
            return this._worker(function (w) { return w.enableValidator(); });
        };
        AbstractMode.prototype.getFilter = function () {
            return modesFilters_1.StrictPrefix;
        };
        AbstractMode.prototype.addSupportChangedListener = function (callback) {
            return this._eventEmitter.addListener2('modeSupportChanged', callback);
        };
        AbstractMode.prototype.registerSupport = function (support, callback) {
            var _this = this;
            var supportImpl = callback(this);
            this[support] = supportImpl;
            this._eventEmitter.emit('modeSupportChanged', _createModeSupportChangedEvent(support));
            return {
                dispose: function () {
                    if (_this[support] === supportImpl) {
                        delete _this[support];
                        _this._eventEmitter.emit('modeSupportChanged', _createModeSupportChangedEvent(support));
                    }
                }
            };
        };
        AbstractMode.prototype.suggest = function (resource, position) {
            return this._worker(function (w) { return w.suggest(resource, position); });
        };
        AbstractMode.prototype.getTriggerCharacters = function () {
            return [];
        };
        AbstractMode.prototype.shouldAutotriggerSuggest = function (context, offset, triggeredByCharacter) {
            return supports_1.handleEvent(context, offset, function (mode, context, offset) {
                if (!mode.suggestSupport) {
                    // Hit an inner mode without suggest support
                    return false;
                }
                if (mode instanceof AbstractMode) {
                    return mode.shouldAutotriggerSuggestImpl(context, offset, triggeredByCharacter);
                }
                return mode.suggestSupport.shouldAutotriggerSuggest(context, offset, triggeredByCharacter);
            });
        };
        AbstractMode.prototype.shouldAutotriggerSuggestImpl = function (context, offset, triggeredByCharacter) {
            return true;
        };
        AbstractMode.prototype.shouldShowEmptySuggestionList = function () {
            return true;
        };
        AbstractMode.prototype.navigateValueSet = function (resource, position, up) {
            return this._worker(function (w) { return w.inplaceReplaceSupport.navigateValueSet(resource, position, up); });
        };
        AbstractMode.prototype.computeDiff = function (original, modified, ignoreTrimWhitespace) {
            return this._worker(function (w) { return w.computeDiff(original, modified, ignoreTrimWhitespace); });
        };
        AbstractMode.prototype.computeDirtyDiff = function (resource, ignoreTrimWhitespace) {
            return this._worker(function (w) { return w.computeDirtyDiff(resource, ignoreTrimWhitespace); });
        };
        AbstractMode.prototype.computeLinks = function (resource) {
            return this._worker(function (w) { return w.computeLinks(resource); });
        };
        AbstractMode.prototype.configure = function (options) {
            this._options = options;
            if (this._threadService.isInMainThread) {
                return this._configureWorkers(options);
            }
            else {
                return this._worker(function (w) { return w.configure(options); });
            }
        };
        AbstractMode.prototype._configureWorkers = function (options) {
            return this._worker(function (w) { return w.configure(options); });
        };
        // END
        AbstractMode.prototype.getWordDefinition = function () {
            return nullMode_1.NullMode.DEFAULT_WORD_REGEXP;
        };
        AbstractMode.prototype.getCommentsConfiguration = function () {
            return null;
        };
        // START mics interface implementations
        AbstractMode.$_pickAWorkerToValidate = threadService_1.OneWorkerAttr(AbstractMode, AbstractMode.prototype._pickAWorkerToValidate, thread_1.ThreadAffinity.Group1);
        AbstractMode.$suggest = threadService_1.OneWorkerAttr(AbstractMode, AbstractMode.prototype.suggest);
        AbstractMode.$navigateValueSet = threadService_1.OneWorkerAttr(AbstractMode, AbstractMode.prototype.navigateValueSet);
        AbstractMode.$computeDiff = threadService_1.OneWorkerAttr(AbstractMode, AbstractMode.prototype.computeDiff);
        AbstractMode.$computeDirtyDiff = threadService_1.OneWorkerAttr(AbstractMode, AbstractMode.prototype.computeDirtyDiff);
        AbstractMode.$computeLinks = threadService_1.OneWorkerAttr(AbstractMode, AbstractMode.prototype.computeLinks);
        AbstractMode.$_configureWorkers = threadService_1.AllWorkersAttr(AbstractMode, AbstractMode.prototype._configureWorkers);
        return AbstractMode;
    })();
    exports.AbstractMode = AbstractMode;
    var SimplifiedMode = (function () {
        function SimplifiedMode(sourceMode) {
            var _this = this;
            this._sourceMode = sourceMode;
            this._eventEmitter = new eventEmitter_1.EventEmitter();
            this._id = 'vs.editor.modes.simplifiedMode:' + sourceMode.getId();
            this._assignSupports();
            if (this._sourceMode.addSupportChangedListener) {
                this._sourceMode.addSupportChangedListener(function (e) {
                    if (e.tokenizationSupport || e.electricCharacterSupport || e.commentsSupport || e.characterPairSupport || e.tokenTypeClassificationSupport || e.onEnterSupport) {
                        _this._assignSupports();
                        var newEvent = SimplifiedMode._createModeSupportChangedEvent(e);
                        _this._eventEmitter.emit('modeSupportChanged', newEvent);
                    }
                });
            }
        }
        SimplifiedMode.prototype.getId = function () {
            return this._id;
        };
        SimplifiedMode.prototype.toSimplifiedMode = function () {
            return this;
        };
        SimplifiedMode.prototype._assignSupports = function () {
            this.tokenizationSupport = this._sourceMode.tokenizationSupport;
            this.electricCharacterSupport = this._sourceMode.electricCharacterSupport;
            this.commentsSupport = this._sourceMode.commentsSupport;
            this.characterPairSupport = this._sourceMode.characterPairSupport;
            this.tokenTypeClassificationSupport = this._sourceMode.tokenTypeClassificationSupport;
            this.onEnterSupport = this._sourceMode.onEnterSupport;
        };
        SimplifiedMode._createModeSupportChangedEvent = function (originalModeEvent) {
            var event = {
                codeLensSupport: false,
                tokenizationSupport: originalModeEvent.tokenizationSupport,
                occurrencesSupport: false,
                declarationSupport: false,
                typeDeclarationSupport: false,
                navigateTypesSupport: false,
                referenceSupport: false,
                suggestSupport: false,
                parameterHintsSupport: false,
                extraInfoSupport: false,
                outlineSupport: false,
                logicalSelectionSupport: false,
                formattingSupport: false,
                inplaceReplaceSupport: false,
                diffSupport: false,
                dirtyDiffSupport: false,
                emitOutputSupport: false,
                linkSupport: false,
                configSupport: false,
                electricCharacterSupport: originalModeEvent.electricCharacterSupport,
                commentsSupport: originalModeEvent.commentsSupport,
                characterPairSupport: originalModeEvent.characterPairSupport,
                tokenTypeClassificationSupport: originalModeEvent.tokenTypeClassificationSupport,
                quickFixSupport: false,
                onEnterSupport: originalModeEvent.onEnterSupport
            };
            return event;
        };
        return SimplifiedMode;
    })();
    exports.isDigit = (function () {
        var _0 = '0'.charCodeAt(0), _1 = '1'.charCodeAt(0), _2 = '2'.charCodeAt(0), _3 = '3'.charCodeAt(0), _4 = '4'.charCodeAt(0), _5 = '5'.charCodeAt(0), _6 = '6'.charCodeAt(0), _7 = '7'.charCodeAt(0), _8 = '8'.charCodeAt(0), _9 = '9'.charCodeAt(0), _a = 'a'.charCodeAt(0), _b = 'b'.charCodeAt(0), _c = 'c'.charCodeAt(0), _d = 'd'.charCodeAt(0), _e = 'e'.charCodeAt(0), _f = 'f'.charCodeAt(0), _A = 'A'.charCodeAt(0), _B = 'B'.charCodeAt(0), _C = 'C'.charCodeAt(0), _D = 'D'.charCodeAt(0), _E = 'E'.charCodeAt(0), _F = 'F'.charCodeAt(0);
        return function isDigit(character, base) {
            var c = character.charCodeAt(0);
            switch (base) {
                case 1:
                    return c === _0;
                case 2:
                    return c >= _0 && c <= _1;
                case 3:
                    return c >= _0 && c <= _2;
                case 4:
                    return c >= _0 && c <= _3;
                case 5:
                    return c >= _0 && c <= _4;
                case 6:
                    return c >= _0 && c <= _5;
                case 7:
                    return c >= _0 && c <= _6;
                case 8:
                    return c >= _0 && c <= _7;
                case 9:
                    return c >= _0 && c <= _8;
                case 10:
                    return c >= _0 && c <= _9;
                case 11:
                    return (c >= _0 && c <= _9) || (c === _a) || (c === _A);
                case 12:
                    return (c >= _0 && c <= _9) || (c >= _a && c <= _b) || (c >= _A && c <= _B);
                case 13:
                    return (c >= _0 && c <= _9) || (c >= _a && c <= _c) || (c >= _A && c <= _C);
                case 14:
                    return (c >= _0 && c <= _9) || (c >= _a && c <= _d) || (c >= _A && c <= _D);
                case 15:
                    return (c >= _0 && c <= _9) || (c >= _a && c <= _e) || (c >= _A && c <= _E);
                default:
                    return (c >= _0 && c <= _9) || (c >= _a && c <= _f) || (c >= _A && c <= _F);
            }
        };
    })();
    var FrankensteinMode = (function (_super) {
        __extends(FrankensteinMode, _super);
        function FrankensteinMode(descriptor, instantiationService, threadService) {
            _super.call(this, descriptor, instantiationService, threadService);
        }
        FrankensteinMode = __decorate([
            __param(1, instantiation_1.IInstantiationService),
            __param(2, thread_1.IThreadService)
        ], FrankensteinMode);
        return FrankensteinMode;
    })(AbstractMode);
    exports.FrankensteinMode = FrankensteinMode;
    function _createModeSupportChangedEvent() {
        var changedSupports = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            changedSupports[_i - 0] = arguments[_i];
        }
        var event = {
            codeLensSupport: false,
            tokenizationSupport: false,
            occurrencesSupport: false,
            declarationSupport: false,
            typeDeclarationSupport: false,
            navigateTypesSupport: false,
            referenceSupport: false,
            suggestSupport: false,
            parameterHintsSupport: false,
            extraInfoSupport: false,
            outlineSupport: false,
            logicalSelectionSupport: false,
            formattingSupport: false,
            inplaceReplaceSupport: false,
            diffSupport: false,
            dirtyDiffSupport: false,
            emitOutputSupport: false,
            linkSupport: false,
            configSupport: false,
            electricCharacterSupport: false,
            commentsSupport: false,
            characterPairSupport: false,
            tokenTypeClassificationSupport: false,
            quickFixSupport: false,
            onEnterSupport: false
        };
        changedSupports.forEach(function (support) { return event[support] = true; });
        return event;
    }
});
//# sourceMappingURL=abstractMode.js.map