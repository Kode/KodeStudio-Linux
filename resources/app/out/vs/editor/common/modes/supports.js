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
define(["require", "exports", 'vs/base/common/winjs.base', 'vs/base/common/strings', 'vs/editor/common/modes/lineStream', 'vs/editor/common/modes/nullMode', 'vs/editor/common/modes/autoIndentation', 'vs/editor/common/modes/modesFilters', 'vs/editor/common/modes', 'vs/editor/common/core/arrays'], function (require, exports, winjs_base_1, Strings, lineStream_1, nullMode_1, autoIndentation_1, modesFilters_1, Modes, arrays_1) {
    var Token = (function () {
        function Token(startIndex, type, bracket) {
            this.startIndex = startIndex;
            this.type = type;
            this.bracket = bracket;
        }
        Token.prototype.toString = function () {
            return '(' + this.startIndex + ', ' + this.type + ', ' + this.bracket + ')';
        };
        return Token;
    })();
    exports.Token = Token;
    function handleEvent(context, offset, runner) {
        var modeTransitions = context.modeTransitions;
        if (modeTransitions.length === 1) {
            return runner(modeTransitions[0].mode, context, offset);
        }
        var modeIndex = arrays_1.Arrays.findIndexInSegmentsArray(modeTransitions, offset);
        var nestedMode = modeTransitions[modeIndex].mode;
        var modeStartIndex = modeTransitions[modeIndex].startIndex;
        var firstTokenInModeIndex = context.findIndexOfOffset(modeStartIndex);
        var nextCharacterAfterModeIndex = -1;
        var nextTokenAfterMode = -1;
        if (modeIndex + 1 < modeTransitions.length) {
            nextTokenAfterMode = context.findIndexOfOffset(modeTransitions[modeIndex + 1].startIndex);
            nextCharacterAfterModeIndex = context.getTokenStartIndex(nextTokenAfterMode);
        }
        else {
            nextTokenAfterMode = context.getTokenCount();
            nextCharacterAfterModeIndex = context.getLineContent().length;
        }
        var firstTokenCharacterOffset = context.getTokenStartIndex(firstTokenInModeIndex);
        var newCtx = new FilteredLineContext(context, nestedMode, firstTokenInModeIndex, nextTokenAfterMode, firstTokenCharacterOffset, nextCharacterAfterModeIndex);
        return runner(nestedMode, newCtx, offset - firstTokenCharacterOffset);
    }
    exports.handleEvent = handleEvent;
    /**
     * Returns {{true}} if the line token at the specified
     * offset matches one of the provided types. Matching
     * happens on a substring start from the end, unless
     * anywhereInToken is set to true in which case matches
     * happen on a substring at any position.
     */
    function isLineToken(context, offset, types, anywhereInToken) {
        if (anywhereInToken === void 0) { anywhereInToken = false; }
        if (!Array.isArray(types) || types.length === 0) {
            return false;
        }
        if (context.getLineContent().length <= offset) {
            return false;
        }
        var tokenIdx = context.findIndexOfOffset(offset);
        var type = context.getTokenType(tokenIdx);
        for (var i = 0, len = types.length; i < len; i++) {
            if (anywhereInToken) {
                if (type.indexOf(types[i]) >= 0) {
                    return true;
                }
            }
            else {
                if (Strings.endsWith(type, types[i])) {
                    return true;
                }
            }
        }
        return false;
    }
    exports.isLineToken = isLineToken;
    var FilteredLineContext = (function () {
        function FilteredLineContext(actual, mode, firstTokenInModeIndex, nextTokenAfterMode, firstTokenCharacterOffset, nextCharacterAfterModeIndex) {
            this.modeTransitions = [{
                    startIndex: 0,
                    mode: mode
                }];
            this._actual = actual;
            this._firstTokenInModeIndex = firstTokenInModeIndex;
            this._nextTokenAfterMode = nextTokenAfterMode;
            this._firstTokenCharacterOffset = firstTokenCharacterOffset;
            this._nextCharacterAfterModeIndex = nextCharacterAfterModeIndex;
        }
        FilteredLineContext.prototype.getLineContent = function () {
            var actualLineContent = this._actual.getLineContent();
            return actualLineContent.substring(this._firstTokenCharacterOffset, this._nextCharacterAfterModeIndex);
        };
        FilteredLineContext.prototype.getTokenCount = function () {
            return this._nextTokenAfterMode - this._firstTokenInModeIndex;
        };
        FilteredLineContext.prototype.findIndexOfOffset = function (offset) {
            return this._actual.findIndexOfOffset(offset + this._firstTokenCharacterOffset) - this._firstTokenInModeIndex;
        };
        FilteredLineContext.prototype.getTokenStartIndex = function (tokenIndex) {
            return this._actual.getTokenStartIndex(tokenIndex + this._firstTokenInModeIndex) - this._firstTokenCharacterOffset;
        };
        FilteredLineContext.prototype.getTokenEndIndex = function (tokenIndex) {
            return this._actual.getTokenEndIndex(tokenIndex + this._firstTokenInModeIndex) - this._firstTokenCharacterOffset;
        };
        FilteredLineContext.prototype.getTokenType = function (tokenIndex) {
            return this._actual.getTokenType(tokenIndex + this._firstTokenInModeIndex);
        };
        FilteredLineContext.prototype.getTokenBracket = function (tokenIndex) {
            return this._actual.getTokenBracket(tokenIndex + this._firstTokenInModeIndex);
        };
        FilteredLineContext.prototype.getTokenText = function (tokenIndex) {
            return this._actual.getTokenText(tokenIndex + this._firstTokenInModeIndex);
        };
        return FilteredLineContext;
    })();
    exports.FilteredLineContext = FilteredLineContext;
    var AbstractSupport = (function () {
        function AbstractSupport(mode) {
            this._mode = mode;
        }
        Object.defineProperty(AbstractSupport.prototype, "mode", {
            get: function () {
                return this._mode;
            },
            enumerable: true,
            configurable: true
        });
        return AbstractSupport;
    })();
    exports.AbstractSupport = AbstractSupport;
    function isFunction(something) {
        return typeof something === 'function';
    }
    var TokenizationSupport = (function (_super) {
        __extends(TokenizationSupport, _super);
        function TokenizationSupport(mode, customization, supportsNestedModes, shouldGenerateEmbeddedModels) {
            _super.call(this, mode);
            this.customization = customization;
            this.supportsNestedModes = supportsNestedModes;
            this._embeddedModesListeners = {};
            if (this.supportsNestedModes) {
                if (!this.mode.registerSupport) {
                    throw new Error('Cannot be a mode with nested modes unless I can emit a tokenizationSupport changed event!');
                }
            }
            this.shouldGenerateEmbeddedModels = shouldGenerateEmbeddedModels;
            this.defaults = {
                enterNestedMode: !isFunction(customization.enterNestedMode),
                getNestedMode: !isFunction(customization.getNestedMode),
                getNestedModeInitialState: !isFunction(customization.getNestedModeInitialState),
                getLeavingNestedModeData: !isFunction(customization.getLeavingNestedModeData),
                onReturningFromNestedMode: !isFunction(customization.onReturningFromNestedMode)
            };
        }
        TokenizationSupport.prototype.dispose = function () {
            for (var listener in this._embeddedModesListeners) {
                this._embeddedModesListeners[listener].dispose();
                delete this._embeddedModesListeners[listener];
            }
        };
        TokenizationSupport.prototype.getInitialState = function () {
            return this.customization.getInitialState();
        };
        TokenizationSupport.prototype.tokenize = function (line, state, deltaOffset, stopAtOffset) {
            if (deltaOffset === void 0) { deltaOffset = 0; }
            if (stopAtOffset === void 0) { stopAtOffset = deltaOffset + line.length; }
            if (state.getMode() !== this.mode) {
                return this._nestedTokenize(line, state, deltaOffset, stopAtOffset, [], []);
            }
            else {
                return this._myTokenize(line, state, deltaOffset, stopAtOffset, [], []);
            }
        };
        /**
         * Precondition is: nestedModeState.getMode() !== this
         * This means we are in a nested mode when parsing starts on this line.
         */
        TokenizationSupport.prototype._nestedTokenize = function (buffer, nestedModeState, deltaOffset, stopAtOffset, prependTokens, prependModeTransitions) {
            var myStateBeforeNestedMode = nestedModeState.getStateData();
            var leavingNestedModeData = this.getLeavingNestedModeData(buffer, myStateBeforeNestedMode);
            // Be sure to give every embedded mode the
            // opportunity to leave nested mode.
            // i.e. Don't go straight to the most nested mode
            var stepOnceNestedState = nestedModeState;
            while (stepOnceNestedState.getStateData() && stepOnceNestedState.getStateData().getMode() !== this.mode) {
                stepOnceNestedState = stepOnceNestedState.getStateData();
            }
            var nestedMode = stepOnceNestedState.getMode();
            if (!leavingNestedModeData) {
                // tokenization will not leave nested mode
                var result;
                if (nestedMode.tokenizationSupport) {
                    result = nestedMode.tokenizationSupport.tokenize(buffer, nestedModeState, deltaOffset, stopAtOffset);
                }
                else {
                    // The nested mode doesn't have tokenization support,
                    // unfortunatelly this means we have to fake it
                    result = nullMode_1.nullTokenize(nestedMode, buffer, nestedModeState, deltaOffset);
                }
                result.tokens = prependTokens.concat(result.tokens);
                result.modeTransitions = prependModeTransitions.concat(result.modeTransitions);
                return result;
            }
            var nestedModeBuffer = leavingNestedModeData.nestedModeBuffer;
            if (nestedModeBuffer.length > 0) {
                // Tokenize with the nested mode
                var nestedModeLineTokens;
                if (nestedMode.tokenizationSupport) {
                    nestedModeLineTokens = nestedMode.tokenizationSupport.tokenize(nestedModeBuffer, nestedModeState, deltaOffset, stopAtOffset);
                }
                else {
                    // The nested mode doesn't have tokenization support,
                    // unfortunatelly this means we have to fake it
                    nestedModeLineTokens = nullMode_1.nullTokenize(nestedMode, nestedModeBuffer, nestedModeState, deltaOffset);
                }
                // Save last state of nested mode
                nestedModeState = nestedModeLineTokens.endState;
                // Prepend nested mode's result to our result
                prependTokens = prependTokens.concat(nestedModeLineTokens.tokens);
                prependModeTransitions = prependModeTransitions.concat(nestedModeLineTokens.modeTransitions);
            }
            var bufferAfterNestedMode = leavingNestedModeData.bufferAfterNestedMode;
            var myStateAfterNestedMode = leavingNestedModeData.stateAfterNestedMode;
            myStateAfterNestedMode.setStateData(myStateBeforeNestedMode.getStateData());
            this.onReturningFromNestedMode(myStateAfterNestedMode, nestedModeState);
            return this._myTokenize(bufferAfterNestedMode, myStateAfterNestedMode, deltaOffset + nestedModeBuffer.length, stopAtOffset, prependTokens, prependModeTransitions);
        };
        /**
         * Precondition is: state.getMode() === this
         * This means we are in the current mode when parsing starts on this line.
         */
        TokenizationSupport.prototype._myTokenize = function (buffer, myState, deltaOffset, stopAtOffset, prependTokens, prependModeTransitions) {
            var _this = this;
            var lineStream = new lineStream_1.LineStream(buffer);
            var tokenResult, beforeTokenizeStreamPos;
            var previousType = null;
            var retokenize = null;
            myState = myState.clone();
            if (prependModeTransitions.length <= 0 || prependModeTransitions[prependModeTransitions.length - 1].mode !== this.mode) {
                // Avoid transitioning to the same mode (this can happen in case of empty embedded modes)
                prependModeTransitions.push({
                    startIndex: deltaOffset,
                    mode: this.mode
                });
            }
            var maxPos = Math.min(stopAtOffset - deltaOffset, buffer.length);
            var noneBracket = Modes.Bracket.None;
            while (lineStream.pos() < maxPos) {
                beforeTokenizeStreamPos = lineStream.pos();
                do {
                    tokenResult = myState.tokenize(lineStream);
                    if (tokenResult === null || tokenResult === undefined ||
                        ((tokenResult.type === undefined || tokenResult.type === null) &&
                            (tokenResult.nextState === undefined || tokenResult.nextState === null))) {
                        throw new Error('Tokenizer must return a valid state');
                    }
                    if (tokenResult.nextState) {
                        tokenResult.nextState.setStateData(myState.getStateData());
                        myState = tokenResult.nextState;
                    }
                    if (lineStream.pos() <= beforeTokenizeStreamPos) {
                        throw new Error('Stream did not advance while tokenizing. Mode id is ' + this.mode.getId() + ' (stuck at token type: "' + tokenResult.type + '", prepend tokens: "' + (prependTokens.map(function (t) { return t.type; }).join(',')) + '").');
                    }
                } while (!tokenResult.type && tokenResult.type !== '');
                if (previousType !== tokenResult.type || tokenResult.bracket || previousType === null) {
                    prependTokens.push(new Token(beforeTokenizeStreamPos + deltaOffset, tokenResult.type, tokenResult.bracket || noneBracket));
                }
                previousType = tokenResult.type;
                if (this.supportsNestedModes && this.enterNestedMode(myState)) {
                    var currentEmbeddedLevels = this._getEmbeddedLevel(myState);
                    if (currentEmbeddedLevels < TokenizationSupport.MAX_EMBEDDED_LEVELS) {
                        var nestedModeState = this.getNestedModeInitialState(myState);
                        // Re-emit tokenizationSupport change events from all modes that I ever embedded
                        var embeddedMode = nestedModeState.state.getMode();
                        if (typeof embeddedMode.addSupportChangedListener === 'function' && !this._embeddedModesListeners.hasOwnProperty(embeddedMode.getId())) {
                            var emitting = false;
                            this._embeddedModesListeners[embeddedMode.getId()] = embeddedMode.addSupportChangedListener(function (e) {
                                if (emitting) {
                                    return;
                                }
                                if (e.tokenizationSupport) {
                                    emitting = true;
                                    _this.mode.registerSupport('tokenizationSupport', function (mode) {
                                        return mode.tokenizationSupport;
                                    });
                                    emitting = false;
                                }
                            });
                        }
                        if (!lineStream.eos()) {
                            // There is content from the embedded mode
                            var restOfBuffer = buffer.substr(lineStream.pos());
                            var result = this._nestedTokenize(restOfBuffer, nestedModeState.state, deltaOffset + lineStream.pos(), stopAtOffset, prependTokens, prependModeTransitions);
                            result.retokenize = result.retokenize || nestedModeState.missingModePromise;
                            return result;
                        }
                        else {
                            // Transition to the nested mode state
                            myState = nestedModeState.state;
                            retokenize = nestedModeState.missingModePromise;
                        }
                    }
                }
            }
            return {
                tokens: prependTokens,
                actualStopOffset: lineStream.pos() + deltaOffset,
                modeTransitions: prependModeTransitions,
                endState: myState,
                retokenize: retokenize
            };
        };
        TokenizationSupport.prototype._getEmbeddedLevel = function (state) {
            var result = -1;
            while (state) {
                result++;
                state = state.getStateData();
            }
            return result;
        };
        TokenizationSupport.prototype.enterNestedMode = function (state) {
            if (this.defaults.enterNestedMode) {
                return false;
            }
            return this.customization.enterNestedMode(state);
        };
        TokenizationSupport.prototype.getNestedMode = function (state) {
            if (this.defaults.getNestedMode) {
                return null;
            }
            return this.customization.getNestedMode(state);
        };
        TokenizationSupport._validatedNestedMode = function (input) {
            var mode = new nullMode_1.NullMode(), missingModePromise = null;
            if (input && input.mode) {
                mode = input.mode;
            }
            if (input && input.missingModePromise) {
                missingModePromise = input.missingModePromise;
            }
            return {
                mode: mode,
                missingModePromise: missingModePromise
            };
        };
        TokenizationSupport.prototype.getNestedModeInitialState = function (state) {
            if (this.defaults.getNestedModeInitialState) {
                var nestedMode = TokenizationSupport._validatedNestedMode(this.getNestedMode(state));
                var missingModePromise = nestedMode.missingModePromise;
                var nestedModeState;
                if (nestedMode.mode.tokenizationSupport) {
                    nestedModeState = nestedMode.mode.tokenizationSupport.getInitialState();
                }
                else {
                    nestedModeState = new nullMode_1.NullState(nestedMode.mode, null);
                }
                nestedModeState.setStateData(state);
                return {
                    state: nestedModeState,
                    missingModePromise: missingModePromise
                };
            }
            return this.customization.getNestedModeInitialState(state);
        };
        TokenizationSupport.prototype.getLeavingNestedModeData = function (line, state) {
            if (this.defaults.getLeavingNestedModeData) {
                return null;
            }
            return this.customization.getLeavingNestedModeData(line, state);
        };
        TokenizationSupport.prototype.onReturningFromNestedMode = function (myStateAfterNestedMode, lastNestedModeState) {
            if (this.defaults.onReturningFromNestedMode) {
                return null;
            }
            return this.customization.onReturningFromNestedMode(myStateAfterNestedMode, lastNestedModeState);
        };
        TokenizationSupport.MAX_EMBEDDED_LEVELS = 5;
        return TokenizationSupport;
    })(AbstractSupport);
    exports.TokenizationSupport = TokenizationSupport;
    var BracketElectricCharacterSupport = (function (_super) {
        __extends(BracketElectricCharacterSupport, _super);
        function BracketElectricCharacterSupport(mode, contribution) {
            _super.call(this, mode);
            this.contribution = contribution;
            this.brackets = new autoIndentation_1.Brackets(contribution.brackets, contribution.regexBrackets, contribution.docComment, contribution.caseInsensitive);
        }
        BracketElectricCharacterSupport.prototype.getElectricCharacters = function () {
            if (Array.isArray(this.contribution.embeddedElectricCharacters)) {
                return this.contribution.embeddedElectricCharacters.concat(this.brackets.getElectricCharacters());
            }
            return this.brackets.getElectricCharacters();
        };
        BracketElectricCharacterSupport.prototype.onElectricCharacter = function (context, offset) {
            var _this = this;
            return handleEvent(context, offset, function (nestedMode, context, offset) {
                if (_this.mode === nestedMode) {
                    return _this.brackets.onElectricCharacter(context, offset);
                }
                else if (nestedMode.electricCharacterSupport) {
                    return nestedMode.electricCharacterSupport.onElectricCharacter(context, offset);
                }
                else {
                    return null;
                }
            });
        };
        BracketElectricCharacterSupport.prototype.onEnter = function (context, offset) {
            var _this = this;
            return handleEvent(context, offset, function (nestedMode, context, offset) {
                if (_this.mode === nestedMode) {
                    return _this.brackets.onEnter(context, offset);
                }
                else if (nestedMode.electricCharacterSupport) {
                    return nestedMode.electricCharacterSupport.onEnter(context, offset);
                }
                else {
                    return null;
                }
            });
        };
        return BracketElectricCharacterSupport;
    })(AbstractSupport);
    exports.BracketElectricCharacterSupport = BracketElectricCharacterSupport;
    var DeclarationSupport = (function (_super) {
        __extends(DeclarationSupport, _super);
        /**
         * Provide the token type postfixes for the tokens where a declaration can be found in the 'tokens' argument.
         */
        function DeclarationSupport(mode, contribution) {
            _super.call(this, mode);
            this.contribution = contribution;
        }
        DeclarationSupport.prototype.canFindDeclaration = function (context, offset) {
            var _this = this;
            return handleEvent(context, offset, function (nestedMode, context, offset) {
                if (_this.mode === nestedMode) {
                    return (!Array.isArray(_this.contribution.tokens) ||
                        _this.contribution.tokens.length < 1 ||
                        isLineToken(context, offset, _this.contribution.tokens));
                }
                else if (nestedMode.declarationSupport) {
                    return nestedMode.declarationSupport.canFindDeclaration(context, offset);
                }
                else {
                    return false;
                }
            });
        };
        DeclarationSupport.prototype.findDeclaration = function (resource, position) {
            return this.contribution.findDeclaration(resource, position);
        };
        return DeclarationSupport;
    })(AbstractSupport);
    exports.DeclarationSupport = DeclarationSupport;
    var TypeDeclarationSupport = (function (_super) {
        __extends(TypeDeclarationSupport, _super);
        /**
         * Provide the token type postfixes for the tokens where a declaration can be found in the 'tokens' argument.
         */
        function TypeDeclarationSupport(mode, contribution) {
            _super.call(this, mode);
            this.contribution = contribution;
        }
        TypeDeclarationSupport.prototype.canFindTypeDeclaration = function (context, offset) {
            var _this = this;
            return handleEvent(context, offset, function (nestedMode, context, offset) {
                if (_this.mode === nestedMode) {
                    return (!Array.isArray(_this.contribution.tokens) ||
                        _this.contribution.tokens.length < 1 ||
                        isLineToken(context, offset, _this.contribution.tokens));
                }
                else if (nestedMode.typeDeclarationSupport) {
                    return nestedMode.typeDeclarationSupport.canFindTypeDeclaration(context, offset);
                }
                else {
                    return false;
                }
            });
        };
        TypeDeclarationSupport.prototype.findTypeDeclaration = function (resource, position) {
            return this.contribution.findTypeDeclaration(resource, position);
        };
        return TypeDeclarationSupport;
    })(AbstractSupport);
    exports.TypeDeclarationSupport = TypeDeclarationSupport;
    var ReferenceSupport = (function (_super) {
        __extends(ReferenceSupport, _super);
        /**
         * Provide the token type postfixes for the tokens where a reference can be found in the 'tokens' argument.
         */
        function ReferenceSupport(mode, contribution) {
            _super.call(this, mode);
            this.contribution = contribution;
        }
        ReferenceSupport.prototype.canFindReferences = function (context, offset) {
            var _this = this;
            return handleEvent(context, offset, function (nestedMode, context, offset) {
                if (_this.mode === nestedMode) {
                    return (!Array.isArray(_this.contribution.tokens) ||
                        _this.contribution.tokens.length < 1 ||
                        isLineToken(context, offset, _this.contribution.tokens));
                }
                else if (nestedMode.referenceSupport) {
                    return nestedMode.referenceSupport.canFindReferences(context, offset);
                }
                else {
                    return false;
                }
            });
        };
        ReferenceSupport.prototype.findReferences = function (resource, position, includeDeclaration) {
            return this.contribution.findReferences(resource, position, includeDeclaration);
        };
        return ReferenceSupport;
    })(AbstractSupport);
    exports.ReferenceSupport = ReferenceSupport;
    var ParameterHintsSupport = (function (_super) {
        __extends(ParameterHintsSupport, _super);
        function ParameterHintsSupport(mode, contribution) {
            _super.call(this, mode);
            this.contribution = contribution;
        }
        ParameterHintsSupport.prototype.getParameterHintsTriggerCharacters = function () {
            return this.contribution.triggerCharacters;
        };
        ParameterHintsSupport.prototype.shouldTriggerParameterHints = function (context, offset) {
            var _this = this;
            return handleEvent(context, offset, function (nestedMode, context, offset) {
                if (_this.mode === nestedMode) {
                    if (!Array.isArray(_this.contribution.excludeTokens)) {
                        return true;
                    }
                    if (_this.contribution.excludeTokens.length === 1 && _this.contribution.excludeTokens[0] === '*') {
                        return false;
                    }
                    return !isLineToken(context, offset - 1, _this.contribution.excludeTokens);
                }
                else if (nestedMode.parameterHintsSupport) {
                    return nestedMode.parameterHintsSupport.shouldTriggerParameterHints(context, offset);
                }
                else {
                    return false;
                }
            });
        };
        ParameterHintsSupport.prototype.getParameterHints = function (resource, position) {
            return this.contribution.getParameterHints(resource, position);
        };
        return ParameterHintsSupport;
    })(AbstractSupport);
    exports.ParameterHintsSupport = ParameterHintsSupport;
    var SuggestSupport = (function (_super) {
        __extends(SuggestSupport, _super);
        function SuggestSupport(mode, contribution) {
            _super.call(this, mode);
            this.contribution = contribution;
            this.suggest = function (resource, position) { return contribution.suggest(resource, position); };
            if (typeof contribution.getSuggestionDetails === 'function') {
                this.getSuggestionDetails = function (resource, position, suggestion) { return contribution.getSuggestionDetails(resource, position, suggestion); };
            }
            this.sortByType = [];
            this.separatorForType = [];
            if (Array.isArray(contribution.sortBy) && contribution.sortBy.length > 0) {
                for (var i = 0; i < contribution.sortBy.length; ++i) {
                    this.sortByType.push(contribution.sortBy[i].type);
                    this.separatorForType.push(contribution.sortBy[i].partSeparator);
                }
            }
        }
        SuggestSupport.prototype.shouldAutotriggerSuggest = function (context, offset, triggeredByCharacter) {
            var _this = this;
            return handleEvent(context, offset, function (nestedMode, context, offset) {
                if (_this.mode === nestedMode) {
                    if (_this.contribution.disableAutoTrigger) {
                        return false;
                    }
                    if (!Array.isArray(_this.contribution.excludeTokens)) {
                        return true;
                    }
                    if (_this.contribution.excludeTokens.length === 1 && _this.contribution.excludeTokens[0] === '*') {
                        return false;
                    }
                    return !isLineToken(context, offset - 1, _this.contribution.excludeTokens, true);
                }
                else if (nestedMode.suggestSupport) {
                    return nestedMode.suggestSupport.shouldAutotriggerSuggest(context, offset, triggeredByCharacter);
                }
                else {
                    return false;
                }
            });
        };
        SuggestSupport.prototype.getFilter = function () {
            return modesFilters_1.DefaultFilter;
        };
        SuggestSupport.prototype.getSorter = function () {
            var _this = this;
            return function (one, other) {
                if (_this.sortByType.length > 0) {
                    var oneTypeIndex = _this.sortByType.indexOf(one.type);
                    var otherTypeIndex = _this.sortByType.indexOf(other.type);
                    if (oneTypeIndex < 0) {
                        oneTypeIndex = _this.sortByType.length;
                    }
                    if (otherTypeIndex < 0) {
                        otherTypeIndex = _this.sortByType.length;
                    }
                    if (oneTypeIndex < otherTypeIndex) {
                        return -1;
                    }
                    if (otherTypeIndex < oneTypeIndex) {
                        return 1;
                    }
                    // TypeIndices are equal
                    if (oneTypeIndex < _this.sortByType.length) {
                        var separator = _this.separatorForType[oneTypeIndex];
                        var oneParts = ((typeof separator === 'string' && separator.length > 0) ? one.label.split(separator) : [one.label]);
                        var otherParts = ((typeof separator === 'string' && separator.length > 0) ? other.label.split(separator) : [other.label]);
                        if (oneParts.length < otherParts.length) {
                            return -1;
                        }
                        else if (oneParts.length > otherParts.length) {
                            return 1;
                        }
                        else {
                            for (var i = 0; i < oneParts.length; i++) {
                                var result = Strings.localeCompare(oneParts[i], otherParts[i]);
                                if (result !== 0) {
                                    return result;
                                }
                            }
                            return 0;
                        }
                    }
                }
                var cmp = 0;
                if (one.sortText && other.sortText) {
                    cmp = one.sortText.localeCompare(other.sortText);
                }
                if (!cmp) {
                    cmp = Strings.localeCompare(one.label.toLowerCase(), other.label.toLowerCase());
                }
                return Strings.localeCompare(one.documentationLabel || '', other.documentationLabel || '');
            };
        };
        SuggestSupport.prototype.getTriggerCharacters = function () {
            return this.contribution.triggerCharacters;
        };
        SuggestSupport.prototype.shouldShowEmptySuggestionList = function () {
            return true;
        };
        return SuggestSupport;
    })(AbstractSupport);
    exports.SuggestSupport = SuggestSupport;
    var ComposableSuggestSupport = (function (_super) {
        __extends(ComposableSuggestSupport, _super);
        function ComposableSuggestSupport(mode, contribution) {
            _super.call(this, mode, contribution);
            this.suggest = function (resource, position) {
                return (contribution.suggest(resource, position)
                    .then(function (superSuggestions) { return contribution.composeSuggest(resource, position, superSuggestions); }));
            };
        }
        return ComposableSuggestSupport;
    })(SuggestSupport);
    exports.ComposableSuggestSupport = ComposableSuggestSupport;
    var CharacterPairSupport = (function (_super) {
        __extends(CharacterPairSupport, _super);
        function CharacterPairSupport(mode, contribution) {
            _super.call(this, mode);
            this._autoClosingPairs = contribution.autoClosingPairs;
            this._surroundingPairs = Array.isArray(contribution.surroundingPairs) ? contribution.surroundingPairs : contribution.autoClosingPairs;
        }
        CharacterPairSupport.prototype.getAutoClosingPairs = function () {
            return this._autoClosingPairs;
        };
        CharacterPairSupport.prototype.shouldAutoClosePair = function (character, context, offset) {
            var _this = this;
            return handleEvent(context, offset, function (nestedMode, context, offset) {
                if (_this.mode === nestedMode) {
                    // Always complete on empty line
                    if (context.getTokenCount() === 0) {
                        return true;
                    }
                    var tokenIndex = context.findIndexOfOffset(offset - 1);
                    var tokenType = context.getTokenType(tokenIndex);
                    for (var i = 0; i < _this._autoClosingPairs.length; ++i) {
                        if (_this._autoClosingPairs[i].open === character) {
                            if (_this._autoClosingPairs[i].notIn) {
                                for (var notInIndex = 0; notInIndex < _this._autoClosingPairs[i].notIn.length; ++notInIndex) {
                                    if (tokenType.indexOf(_this._autoClosingPairs[i].notIn[notInIndex]) > -1) {
                                        return false;
                                    }
                                }
                            }
                            break;
                        }
                    }
                    return true;
                }
                else if (nestedMode.characterPairSupport) {
                    return nestedMode.characterPairSupport.shouldAutoClosePair(character, context, offset);
                }
                else {
                    return null;
                }
            });
        };
        CharacterPairSupport.prototype.getSurroundingPairs = function () {
            return this._surroundingPairs;
        };
        return CharacterPairSupport;
    })(AbstractSupport);
    exports.CharacterPairSupport = CharacterPairSupport;
    var ReplaceSupportHelperImpl = (function () {
        function ReplaceSupportHelperImpl() {
        }
        ReplaceSupportHelperImpl.prototype.valueSetsReplace = function (valueSets, value, up) {
            var result = null;
            for (var i = 0, len = valueSets.length; result === null && i < len; i++) {
                result = this.valueSetReplace(valueSets[i], value, up);
            }
            return result;
        };
        ReplaceSupportHelperImpl.prototype.valueSetReplace = function (valueSet, value, up) {
            var idx = valueSet.indexOf(value);
            if (idx >= 0) {
                idx += up ? +1 : -1;
                if (idx < 0) {
                    idx = valueSet.length - 1;
                }
                else {
                    idx %= valueSet.length;
                }
                return valueSet[idx];
            }
            return null;
        };
        return ReplaceSupportHelperImpl;
    })();
    exports.ReplaceSupport = new ReplaceSupportHelperImpl();
    var AbstractInplaceReplaceSupport = (function () {
        function AbstractInplaceReplaceSupport(customization) {
            if (customization === void 0) { customization = null; }
            this._defaultValueSet = [
                ['true', 'false'],
                ['True', 'False'],
                ['Private', 'Public', 'Friend', 'ReadOnly', 'Partial', 'Protected', 'WriteOnly'],
                ['public', 'protected', 'private'],
            ];
            this.defaults = {
                textReplace: !customization || !isFunction(customization.textReplace),
                navigateValueSetFallback: !customization || !isFunction(customization.navigateValueSetFallback)
            };
            this.customization = customization;
        }
        AbstractInplaceReplaceSupport.prototype.navigateValueSet = function (resource, range, up) {
            var result = this.doNavigateValueSet(resource, range, up, true);
            if (result && result.value && result.range) {
                return winjs_base_1.TPromise.as(result);
            }
            if (this.defaults.navigateValueSetFallback) {
                return winjs_base_1.TPromise.as(null);
            }
            return this.customization.navigateValueSetFallback(resource, range, up);
        };
        AbstractInplaceReplaceSupport.prototype.doNavigateValueSet = function (resource, range, up, selection) {
            var model = this.getModel(resource), result = { range: null, value: null }, text;
            if (selection) {
                // Replace selection
                if (range.startColumn === range.endColumn) {
                    range.endColumn += 1;
                }
                text = model.getValueInRange(range);
                result.range = range;
            }
            else {
                // Replace word
                var position = { lineNumber: range.startLineNumber, column: range.startColumn };
                var wordPos = model.getWordAtPosition(position);
                if (!wordPos || wordPos.startColumn === -1) {
                    return null;
                }
                text = wordPos.word;
                result.range = { startLineNumber: range.startLineNumber, endLineNumber: range.endLineNumber, startColumn: wordPos.startColumn, endColumn: wordPos.endColumn };
            }
            // Try to replace numbers or text
            var numberResult = this.numberReplace(text, up);
            if (numberResult !== null) {
                result.value = numberResult;
            }
            else {
                var textResult = this.textReplace(text, up);
                if (textResult !== null) {
                    result.value = textResult;
                }
                else if (selection) {
                    return this.doNavigateValueSet(resource, range, up, false);
                }
            }
            return result;
        };
        AbstractInplaceReplaceSupport.prototype.numberReplace = function (value, up) {
            var precision = Math.pow(10, value.length - (value.lastIndexOf('.') + 1)), n1 = Number(value), n2 = parseFloat(value);
            if (!isNaN(n1) && !isNaN(n2) && n1 === n2) {
                if (n1 === 0 && !up) {
                    return null; // don't do negative
                }
                else {
                    n1 = Math.floor(n1 * precision);
                    n1 += up ? precision : -precision;
                    return String(n1 / precision);
                }
            }
            return null;
        };
        AbstractInplaceReplaceSupport.prototype.textReplace = function (value, up) {
            if (this.defaults.textReplace) {
                return exports.ReplaceSupport.valueSetsReplace(this._defaultValueSet, value, up);
            }
            return this.customization.textReplace(value, up)
                || exports.ReplaceSupport.valueSetsReplace(this._defaultValueSet, value, up);
        };
        AbstractInplaceReplaceSupport.prototype.getModel = function (resource) {
            throw new Error('Not implemented');
        };
        return AbstractInplaceReplaceSupport;
    })();
    exports.AbstractInplaceReplaceSupport = AbstractInplaceReplaceSupport;
    var WorkerInplaceReplaceSupport = (function (_super) {
        __extends(WorkerInplaceReplaceSupport, _super);
        function WorkerInplaceReplaceSupport(resourceService, customization) {
            if (customization === void 0) { customization = null; }
            _super.call(this, customization);
            this.resourceService = resourceService;
        }
        WorkerInplaceReplaceSupport.prototype.getModel = function (resource) {
            return this.resourceService.get(resource);
        };
        return WorkerInplaceReplaceSupport;
    })(AbstractInplaceReplaceSupport);
    exports.WorkerInplaceReplaceSupport = WorkerInplaceReplaceSupport;
    var MainInplaceReplaceSupport = (function (_super) {
        __extends(MainInplaceReplaceSupport, _super);
        function MainInplaceReplaceSupport(modelService, customization) {
            if (customization === void 0) { customization = null; }
            _super.call(this, customization);
            this.modelService = modelService;
        }
        MainInplaceReplaceSupport.prototype.getModel = function (resource) {
            return this.modelService.getModel(resource);
        };
        return MainInplaceReplaceSupport;
    })(AbstractInplaceReplaceSupport);
    exports.MainInplaceReplaceSupport = MainInplaceReplaceSupport;
    var CommentsSupport = (function () {
        function CommentsSupport(contribution) {
            this._contribution = contribution;
        }
        CommentsSupport.prototype.getCommentsConfiguration = function () {
            return this._contribution.commentsConfiguration;
        };
        return CommentsSupport;
    })();
    exports.CommentsSupport = CommentsSupport;
    var TokenTypeClassificationSupport = (function () {
        function TokenTypeClassificationSupport(contribution) {
            this._contribution = contribution;
        }
        TokenTypeClassificationSupport.prototype.getWordDefinition = function () {
            if (typeof this._contribution.wordDefinition === 'undefined') {
                return nullMode_1.NullMode.DEFAULT_WORD_REGEXP;
            }
            return this._contribution.wordDefinition;
        };
        return TokenTypeClassificationSupport;
    })();
    exports.TokenTypeClassificationSupport = TokenTypeClassificationSupport;
});
//# sourceMappingURL=supports.js.map