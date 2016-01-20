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
define(["require", "exports", 'vs/nls', 'vs/base/common/timer', 'vs/editor/common/modes/nullMode', 'vs/editor/common/model/textModelWithTokensHelpers', 'vs/editor/common/model/tokenIterator', 'vs/editor/common/model/textModel', 'vs/editor/common/config/defaultConfig', 'vs/editor/common/editorCommon', 'vs/base/common/async', 'vs/editor/common/core/arrays', 'vs/base/common/errors', 'vs/base/common/lifecycle', 'vs/base/common/stopwatch', 'vs/base/common/winjs.base'], function (require, exports, nls, Timer, nullMode_1, textModelWithTokensHelpers_1, tokenIterator_1, textModel_1, defaultConfig_1, EditorCommon, async_1, arrays_1, Errors, lifecycle_1, stopwatch_1, winjs_base_1) {
    var TokensInflatorMap = (function () {
        function TokensInflatorMap() {
            this._inflate = [''];
            this._deflate = { '': 0 };
        }
        return TokensInflatorMap;
    })();
    exports.TokensInflatorMap = TokensInflatorMap;
    var ModeToModelBinder = (function () {
        function ModeToModelBinder(modePromise, model) {
            var _this = this;
            this._modePromise = modePromise;
            // Create an external mode promise that fires after the mode is set to the model
            this._externalModePromise = new winjs_base_1.TPromise(function (c, e, p) {
                _this._externalModePromise_c = c;
                _this._externalModePromise_e = e;
            }, function () {
                // this promise cannot be canceled
            });
            this._model = model;
            this._isDisposed = false;
            // Ensure asynchronicity
            winjs_base_1.TPromise.timeout(0).then(function () {
                return _this._modePromise;
            }).then(function (mode) {
                if (_this._isDisposed) {
                    _this._externalModePromise_c(false);
                    return;
                }
                var model = _this._model;
                _this.dispose();
                model.setMode(mode);
                model._warmUpTokens();
                _this._externalModePromise_c(true);
            }).done(null, function (err) {
                _this._externalModePromise_e(err);
                Errors.onUnexpectedError(err);
            });
        }
        ModeToModelBinder.prototype.getModePromise = function () {
            return this._externalModePromise;
        };
        ModeToModelBinder.prototype.dispose = function () {
            this._modePromise = null;
            this._model = null;
            this._isDisposed = true;
        };
        return ModeToModelBinder;
    })();
    var FullModelRetokenizer = (function () {
        function FullModelRetokenizer(retokenizePromise, model) {
            var _this = this;
            this._retokenizePromise = retokenizePromise;
            this._model = model;
            this._isDisposed = false;
            this.isFulfilled = false;
            // Ensure asynchronicity
            winjs_base_1.TPromise.timeout(0).then(function () {
                return _this._retokenizePromise;
            }).then(function () {
                if (_this._isDisposed) {
                    return;
                }
                _this.isFulfilled = true;
                _this._model.onRetokenizerFulfilled();
            }).done(null, Errors.onUnexpectedError);
        }
        FullModelRetokenizer.prototype.getRange = function () {
            return null;
        };
        FullModelRetokenizer.prototype.dispose = function () {
            this._retokenizePromise = null;
            this._model = null;
            this._isDisposed = true;
        };
        return FullModelRetokenizer;
    })();
    exports.FullModelRetokenizer = FullModelRetokenizer;
    var LineContext = (function () {
        function LineContext(topLevelMode, line) {
            this.modeTransitions = line.getModeTransitions().toArray(topLevelMode);
            this._text = line.text;
            this._lineTokens = line.getTokens();
        }
        LineContext.prototype.getLineContent = function () {
            return this._text;
        };
        LineContext.prototype.getTokenCount = function () {
            return this._lineTokens.getTokenCount();
        };
        LineContext.prototype.getTokenStartIndex = function (tokenIndex) {
            return this._lineTokens.getTokenStartIndex(tokenIndex);
        };
        LineContext.prototype.getTokenEndIndex = function (tokenIndex) {
            return this._lineTokens.getTokenEndIndex(tokenIndex, this._text.length);
        };
        LineContext.prototype.getTokenType = function (tokenIndex) {
            return this._lineTokens.getTokenType(tokenIndex);
        };
        LineContext.prototype.getTokenBracket = function (tokenIndex) {
            return this._lineTokens.getTokenBracket(tokenIndex);
        };
        LineContext.prototype.getTokenText = function (tokenIndex) {
            var startIndex = this._lineTokens.getTokenStartIndex(tokenIndex);
            var endIndex = this._lineTokens.getTokenEndIndex(tokenIndex, this._text.length);
            return this._text.substring(startIndex, endIndex);
        };
        LineContext.prototype.findIndexOfOffset = function (offset) {
            return this._lineTokens.findIndexOfOffset(offset);
        };
        return LineContext;
    })();
    var TextModelWithTokens = (function (_super) {
        __extends(TextModelWithTokens, _super);
        function TextModelWithTokens(allowedEventTypes, rawText, shouldAutoTokenize, modeOrPromise) {
            var _this = this;
            allowedEventTypes.push(EditorCommon.EventType.ModelTokensChanged);
            allowedEventTypes.push(EditorCommon.EventType.ModelModeChanged);
            allowedEventTypes.push(EditorCommon.EventType.ModelModeSupportChanged);
            _super.call(this, allowedEventTypes, rawText);
            this._shouldAutoTokenize = shouldAutoTokenize;
            this._shouldSimplifyMode = (rawText.length > TextModelWithTokens.MODEL_SYNC_LIMIT);
            this._shouldDenyMode = (rawText.length > TextModelWithTokens.MODEL_TOKENIZATION_LIMIT);
            this._stopLineTokenizationAfter = defaultConfig_1.DefaultConfig.editor.stopLineTokenizationAfter;
            if (!modeOrPromise) {
                this._mode = new nullMode_1.NullMode();
            }
            else if (winjs_base_1.TPromise.is(modeOrPromise)) {
                // TODO@Alex: To avoid mode id changes, we check if this promise is resolved
                var promiseValue = modeOrPromise._value;
                if (promiseValue && typeof promiseValue.getId === 'function') {
                    // The promise is already resolved
                    this._mode = this._massageMode(promiseValue);
                    this._resetModeListener(this._mode);
                }
                else {
                    var modePromise = modeOrPromise;
                    this._modeToModelBinder = new ModeToModelBinder(modePromise, this);
                    this._mode = new nullMode_1.NullMode();
                }
            }
            else {
                this._mode = this._massageMode(modeOrPromise);
                this._resetModeListener(this._mode);
            }
            this._revalidateTokensTimeout = -1;
            this._scheduleRetokenizeNow = new async_1.RunOnceScheduler(function () { return _this._retokenizeNow(); }, 200);
            this._retokenizers = [];
            this._resetTokenizationState();
        }
        TextModelWithTokens.prototype.dispose = function () {
            if (this._modeToModelBinder) {
                this._modeToModelBinder.dispose();
                this._modeToModelBinder = null;
            }
            this._resetModeListener(null);
            this._clearTimers();
            this._mode = null;
            this._lastState = null;
            this._tokensInflatorMap = null;
            this._retokenizers = lifecycle_1.disposeAll(this._retokenizers);
            this._scheduleRetokenizeNow.dispose();
            _super.prototype.dispose.call(this);
        };
        TextModelWithTokens.prototype.isTooLargeForHavingAMode = function () {
            return this._shouldDenyMode;
        };
        TextModelWithTokens.prototype.isTooLargeForHavingARichMode = function () {
            return this._shouldSimplifyMode;
        };
        TextModelWithTokens.prototype._massageMode = function (mode) {
            if (this.isTooLargeForHavingAMode()) {
                return new nullMode_1.NullMode();
            }
            if (this.isTooLargeForHavingARichMode()) {
                return mode.toSimplifiedMode();
            }
            return mode;
        };
        TextModelWithTokens.prototype.whenModeIsReady = function () {
            var _this = this;
            if (this._modeToModelBinder) {
                // Still waiting for some mode to load
                return this._modeToModelBinder.getModePromise().then(function () { return _this._mode; });
            }
            return winjs_base_1.TPromise.as(this._mode);
        };
        TextModelWithTokens.prototype.onRetokenizerFulfilled = function () {
            this._scheduleRetokenizeNow.schedule();
        };
        TextModelWithTokens.prototype._retokenizeNow = function () {
            var fulfilled = this._retokenizers.filter(function (r) { return r.isFulfilled; });
            this._retokenizers = this._retokenizers.filter(function (r) { return !r.isFulfilled; });
            var hasFullModel = false;
            for (var i = 0; i < fulfilled.length; i++) {
                if (!fulfilled[i].getRange()) {
                    hasFullModel = true;
                }
            }
            if (hasFullModel) {
                // Just invalidate all the lines
                for (var i = 0, len = this._lines.length; i < len; i++) {
                    this._lines[i].isInvalid = true;
                }
                this._invalidLineStartIndex = 0;
            }
            else {
                var minLineNumber = Number.MAX_VALUE;
                for (var i = 0; i < fulfilled.length; i++) {
                    var range = fulfilled[i].getRange();
                    minLineNumber = Math.min(minLineNumber, range.startLineNumber);
                    for (var lineNumber = range.startLineNumber; lineNumber <= range.endLineNumber; lineNumber++) {
                        this._lines[lineNumber - 1].isInvalid = true;
                    }
                }
                if (minLineNumber - 1 < this._invalidLineStartIndex) {
                    if (this._invalidLineStartIndex < this._lines.length) {
                        this._lines[this._invalidLineStartIndex].isInvalid = true;
                    }
                    this._invalidLineStartIndex = minLineNumber - 1;
                }
            }
            this._beginBackgroundTokenization();
            for (var i = 0; i < fulfilled.length; i++) {
                fulfilled[i].dispose();
            }
        };
        TextModelWithTokens.prototype._createRetokenizer = function (retokenizePromise, lineNumber) {
            return new FullModelRetokenizer(retokenizePromise, this);
        };
        TextModelWithTokens.prototype._resetValue = function (e, newValue) {
            _super.prototype._resetValue.call(this, e, newValue);
            // Cancel tokenization, clear all tokens and begin tokenizing
            this._resetTokenizationState();
        };
        TextModelWithTokens.prototype._resetMode = function (e, newMode) {
            // Cancel tokenization, clear all tokens and begin tokenizing
            this._mode = newMode;
            this._resetModeListener(newMode);
            this._resetTokenizationState();
            this.emitModelTokensChangedEvent(1, this.getLineCount());
        };
        TextModelWithTokens.prototype._resetModeListener = function (newMode) {
            var _this = this;
            if (this._modeListener) {
                this._modeListener.dispose();
                this._modeListener = null;
            }
            if (newMode && typeof newMode.addSupportChangedListener === 'function') {
                this._modeListener = newMode.addSupportChangedListener(function (e) { return _this._onModeSupportChanged(e); });
            }
        };
        TextModelWithTokens.prototype._onModeSupportChanged = function (e) {
            this._emitModelModeSupportChangedEvent(e);
            if (e.tokenizationSupport) {
                this._resetTokenizationState();
                this.emitModelTokensChangedEvent(1, this.getLineCount());
            }
        };
        TextModelWithTokens.prototype._resetTokenizationState = function () {
            this._retokenizers = lifecycle_1.disposeAll(this._retokenizers);
            this._scheduleRetokenizeNow.cancel();
            this._clearTimers();
            for (var i = 0; i < this._lines.length; i++) {
                this._lines[i].setState(null);
            }
            this._initializeTokenizationState();
            this._tokenizationElapsedTime = 0;
            this._tokenizationTotalCharacters = 1;
        };
        TextModelWithTokens.prototype._clearTimers = function () {
            if (this._revalidateTokensTimeout !== -1) {
                clearTimeout(this._revalidateTokensTimeout);
                this._revalidateTokensTimeout = -1;
            }
        };
        TextModelWithTokens.prototype._initializeTokenizationState = function () {
            // Initialize tokenization states
            var initialState = null;
            if (this._mode.tokenizationSupport) {
                try {
                    initialState = this._mode.tokenizationSupport.getInitialState();
                }
                catch (e) {
                    e.friendlyMessage = TextModelWithTokens.MODE_TOKENIZATION_FAILED_MSG;
                    Errors.onUnexpectedError(e);
                    this._mode = new nullMode_1.NullMode();
                }
            }
            if (!initialState) {
                initialState = new nullMode_1.NullState(this._mode, null);
            }
            this._lines[0].setState(initialState);
            this._lastState = null;
            this._tokensInflatorMap = new TokensInflatorMap();
            this._invalidLineStartIndex = 0;
            this._beginBackgroundTokenization();
        };
        TextModelWithTokens.prototype.setStopLineTokenizationAfter = function (stopLineTokenizationAfter) {
            if (this._isDisposed) {
                throw new Error('TextModelWithTokens.setStopLineTokenizationAfter: Model is disposed');
            }
            this._stopLineTokenizationAfter = stopLineTokenizationAfter;
        };
        TextModelWithTokens.prototype.getLineTokens = function (lineNumber, inaccurateTokensAcceptable) {
            if (inaccurateTokensAcceptable === void 0) { inaccurateTokensAcceptable = false; }
            if (this._isDisposed) {
                throw new Error('TextModelWithTokens.getLineTokens: Model is disposed');
            }
            if (lineNumber < 1 || lineNumber > this.getLineCount()) {
                throw new Error('Illegal value ' + lineNumber + ' for `lineNumber`');
            }
            if (!inaccurateTokensAcceptable) {
                this._updateTokensUntilLine(lineNumber, true);
            }
            return this._lines[lineNumber - 1].getTokens();
        };
        TextModelWithTokens.prototype.getLineContext = function (lineNumber) {
            if (this._isDisposed) {
                throw new Error('TextModelWithTokens.getLineContext: Model is disposed');
            }
            if (lineNumber < 1 || lineNumber > this.getLineCount()) {
                throw new Error('Illegal value ' + lineNumber + ' for `lineNumber`');
            }
            this._updateTokensUntilLine(lineNumber, true);
            return new LineContext(this._mode, this._lines[lineNumber - 1]);
        };
        TextModelWithTokens.prototype._getInternalTokens = function (lineNumber) {
            this._updateTokensUntilLine(lineNumber, true);
            return this._lines[lineNumber - 1].getTokens();
        };
        TextModelWithTokens.prototype.setValue = function (value, newModeOrPromise) {
            if (newModeOrPromise === void 0) { newModeOrPromise = null; }
            if (this._isDisposed) {
                throw new Error('TextModelWithTokens.setValue: Model is disposed');
            }
            if (value !== null) {
                _super.prototype.setValue.call(this, value);
            }
            if (newModeOrPromise) {
                if (this._modeToModelBinder) {
                    this._modeToModelBinder.dispose();
                    this._modeToModelBinder = null;
                }
                if (winjs_base_1.TPromise.is(newModeOrPromise)) {
                    this._modeToModelBinder = new ModeToModelBinder(newModeOrPromise, this);
                }
                else {
                    var actualNewMode = this._massageMode(newModeOrPromise);
                    if (this._mode !== actualNewMode) {
                        var e2 = {
                            oldMode: this._mode,
                            newMode: actualNewMode
                        };
                        this._resetMode(e2, actualNewMode);
                        this._emitModelModeChangedEvent(e2);
                    }
                }
            }
        };
        TextModelWithTokens.prototype.getMode = function () {
            if (this._isDisposed) {
                throw new Error('TextModelWithTokens.getMode: Model is disposed');
            }
            return this._mode;
        };
        TextModelWithTokens.prototype.setMode = function (newModeOrPromise) {
            if (this._isDisposed) {
                throw new Error('TextModelWithTokens.setMode: Model is disposed');
            }
            if (!newModeOrPromise) {
                // There's nothing to do
                return;
            }
            this.setValue(null, newModeOrPromise);
        };
        TextModelWithTokens.prototype.getModeAtPosition = function (_lineNumber, _column) {
            if (this._isDisposed) {
                throw new Error('TextModelWithTokens.getModeAtPosition: Model is disposed');
            }
            var validPosition = this.validatePosition({
                lineNumber: _lineNumber,
                column: _column
            });
            var lineNumber = validPosition.lineNumber;
            var column = validPosition.column;
            if (column === 1) {
                return this.getStateBeforeLine(lineNumber).getMode();
            }
            else if (column === this.getLineMaxColumn(lineNumber)) {
                return this.getStateAfterLine(lineNumber).getMode();
            }
            else {
                var modeTransitions = this._getLineModeTransitions(lineNumber);
                var modeTransitionIndex = arrays_1.Arrays.findIndexInSegmentsArray(modeTransitions, column - 1);
                return modeTransitions[modeTransitionIndex].mode;
            }
        };
        TextModelWithTokens.prototype._invalidateLine = function (lineIndex) {
            this._lines[lineIndex].isInvalid = true;
            if (lineIndex < this._invalidLineStartIndex) {
                if (this._invalidLineStartIndex < this._lines.length) {
                    this._lines[this._invalidLineStartIndex].isInvalid = true;
                }
                this._invalidLineStartIndex = lineIndex;
                this._beginBackgroundTokenization();
            }
        };
        TextModelWithTokens.prototype._updateLineTokens = function (lineIndex, map, topLevelMode, r) {
            this._lines[lineIndex].setTokens(map, r.tokens, topLevelMode, r.modeTransitions);
        };
        TextModelWithTokens.prototype._beginBackgroundTokenization = function () {
            var _this = this;
            if (this._shouldAutoTokenize && this._revalidateTokensTimeout === -1) {
                this._revalidateTokensTimeout = setTimeout(function () {
                    _this._revalidateTokensTimeout = -1;
                    _this._revalidateTokensNow();
                }, 0);
            }
        };
        TextModelWithTokens.prototype._warmUpTokens = function () {
            if (this._isDisposed) {
                throw new Error('TextModelWithTokens._warmUpTokens: Model is disposed');
            }
            // Warm up first 100 lines (if it takes less than 50ms)
            var maxLineNumber = Math.min(100, this.getLineCount());
            var toLineNumber = maxLineNumber;
            for (var lineNumber = 1; lineNumber <= maxLineNumber; lineNumber++) {
                var text = this._lines[lineNumber - 1].text;
                if (text.length >= 200) {
                    // This line is over 200 chars long, so warm up without it
                    toLineNumber = lineNumber - 1;
                    break;
                }
            }
            this._revalidateTokensNow(toLineNumber);
        };
        TextModelWithTokens.prototype._revalidateTokensNow = function (toLineNumber) {
            if (toLineNumber === void 0) { toLineNumber = this._invalidLineStartIndex + 1000000; }
            var timer = Timer.start(Timer.Topic.EDITOR, 'backgroundTokenization');
            toLineNumber = Math.min(this._lines.length, toLineNumber);
            var MAX_ALLOWED_TIME = 20, fromLineNumber = this._invalidLineStartIndex + 1, tokenizedChars = 0, currentCharsToTokenize = 0, currentEstimatedTimeToTokenize = 0, stopLineTokenizationAfter = this._stopLineTokenizationAfter, sw = stopwatch_1.StopWatch.create(), elapsedTime;
            // Tokenize at most 1000 lines. Estimate the tokenization speed per character and stop when:
            // - MAX_ALLOWED_TIME is reached
            // - tokenizing the next line would go above MAX_ALLOWED_TIME
            for (var lineNumber = fromLineNumber; lineNumber <= toLineNumber; lineNumber++) {
                elapsedTime = sw.elapsed();
                if (elapsedTime > MAX_ALLOWED_TIME) {
                    // Stop if MAX_ALLOWED_TIME is reached
                    toLineNumber = lineNumber - 1;
                    break;
                }
                // Compute how many characters will be tokenized for this line
                currentCharsToTokenize = this._lines[lineNumber - 1].text.length;
                if (stopLineTokenizationAfter !== -1 && currentCharsToTokenize > stopLineTokenizationAfter) {
                    currentCharsToTokenize = stopLineTokenizationAfter;
                }
                if (tokenizedChars > 0) {
                    // If we have enough history, estimate how long tokenizing this line would take
                    currentEstimatedTimeToTokenize = (elapsedTime / tokenizedChars) * currentCharsToTokenize;
                    if (elapsedTime + currentEstimatedTimeToTokenize > MAX_ALLOWED_TIME) {
                        // Tokenizing this line will go above MAX_ALLOWED_TIME
                        toLineNumber = lineNumber - 1;
                        break;
                    }
                }
                this._updateTokensUntilLine(lineNumber, false);
                tokenizedChars += currentCharsToTokenize;
            }
            elapsedTime = sw.elapsed();
            //		console.log('TOKENIZED LOCAL (' + this._mode.getId() + ') ' + tokenizedChars + '\t in \t' + elapsedTime + '\t speed \t' + tokenizedChars/elapsedTime);
            //		console.log('TOKENIZED GLOBAL(' + this._mode.getId() + ') ' + this._tokenizationTotalCharacters + '\t in*\t' + this._tokenizationElapsedTime + '\t speed*\t' + this._tokenizationTotalCharacters/this._tokenizationElapsedTime);
            var t2 = Timer.start(Timer.Topic.EDITOR, '**speed: ' + this._tokenizationTotalCharacters / this._tokenizationElapsedTime);
            t2.stop();
            if (fromLineNumber <= toLineNumber) {
                this.emitModelTokensChangedEvent(fromLineNumber, toLineNumber);
            }
            if (this._invalidLineStartIndex < this._lines.length) {
                this._beginBackgroundTokenization();
            }
            timer.stop();
        };
        TextModelWithTokens.prototype.getStateBeforeLine = function (lineNumber) {
            this._updateTokensUntilLine(lineNumber - 1, true);
            return this._lines[lineNumber - 1].getState();
        };
        TextModelWithTokens.prototype.getStateAfterLine = function (lineNumber) {
            this._updateTokensUntilLine(lineNumber, true);
            return lineNumber < this._lines.length ? this._lines[lineNumber].getState() : this._lastState;
        };
        TextModelWithTokens.prototype._getLineModeTransitions = function (lineNumber) {
            if (this._isDisposed) {
                throw new Error('TextModelWithTokens._getLineModeTransitions: Model is disposed');
            }
            if (lineNumber < 1 || lineNumber > this.getLineCount()) {
                throw new Error('Illegal value ' + lineNumber + ' for `lineNumber`');
            }
            this._updateTokensUntilLine(lineNumber, true);
            return this._lines[lineNumber - 1].getModeTransitions().toArray(this._mode);
        };
        TextModelWithTokens.prototype._updateTokensUntilLine = function (lineNumber, emitEvents) {
            var linesLength = this._lines.length;
            var endLineIndex = lineNumber - 1;
            var stopLineTokenizationAfter = this._stopLineTokenizationAfter;
            if (stopLineTokenizationAfter === -1) {
                stopLineTokenizationAfter = 1000000000; // 1 billion, if a line is so long, you have other trouble :).
            }
            var sw = stopwatch_1.StopWatch.create();
            var tokenizedCharacters = 0;
            var fromLineNumber = this._invalidLineStartIndex + 1, toLineNumber = lineNumber;
            // Validate all states up to and including endLineIndex
            for (var lineIndex = this._invalidLineStartIndex; lineIndex <= endLineIndex; lineIndex++) {
                var endStateIndex = lineIndex + 1;
                var r = null;
                var text = this._lines[lineIndex].text;
                if (this._mode.tokenizationSupport) {
                    try {
                        // Tokenize only the first X characters
                        r = this._mode.tokenizationSupport.tokenize(this._lines[lineIndex].text, this._lines[lineIndex].getState(), 0, stopLineTokenizationAfter);
                        tokenizedCharacters = r ? r.actualStopOffset : this._lines[lineIndex].text.length;
                    }
                    catch (e) {
                        e.friendlyMessage = TextModelWithTokens.MODE_TOKENIZATION_FAILED_MSG;
                        Errors.onUnexpectedError(e);
                    }
                    if (r && r.retokenize) {
                        this._retokenizers.push(this._createRetokenizer(r.retokenize, lineIndex + 1));
                    }
                    if (r && r.tokens && r.tokens.length > 0) {
                        // Cannot have a stop offset before the last token
                        r.actualStopOffset = Math.max(r.actualStopOffset, r.tokens[r.tokens.length - 1].startIndex + 1);
                    }
                    if (r && r.actualStopOffset < text.length) {
                        // Treat the rest of the line (if above limit) as one default token
                        r.tokens.push({
                            startIndex: r.actualStopOffset,
                            type: '',
                            bracket: 0
                        });
                        // Use as end state the starting state
                        r.endState = this._lines[lineIndex].getState();
                    }
                }
                if (!r) {
                    r = nullMode_1.nullTokenize(this._mode, text, this._lines[lineIndex].getState());
                }
                if (!r.modeTransitions) {
                    r.modeTransitions = [];
                }
                if (r.modeTransitions.length === 0) {
                    // Make sure there is at least the transition to the top-most mode
                    r.modeTransitions.push({
                        startIndex: 0,
                        mode: this._mode
                    });
                }
                this._updateLineTokens(lineIndex, this._tokensInflatorMap, this._mode, r);
                if (this._lines[lineIndex].isInvalid) {
                    this._lines[lineIndex].isInvalid = false;
                }
                if (endStateIndex < linesLength) {
                    if (this._lines[endStateIndex].getState() !== null && r.endState.equals(this._lines[endStateIndex].getState())) {
                        // The end state of this line remains the same
                        var nextInvalidLineIndex = lineIndex + 1;
                        while (nextInvalidLineIndex < linesLength) {
                            if (this._lines[nextInvalidLineIndex].isInvalid) {
                                break;
                            }
                            if (nextInvalidLineIndex + 1 < linesLength) {
                                if (this._lines[nextInvalidLineIndex + 1].getState() === null) {
                                    break;
                                }
                            }
                            else {
                                if (this._lastState === null) {
                                    break;
                                }
                            }
                            nextInvalidLineIndex++;
                        }
                        this._invalidLineStartIndex = Math.max(this._invalidLineStartIndex, nextInvalidLineIndex);
                        lineIndex = nextInvalidLineIndex - 1; // -1 because the outer loop increments it
                    }
                    else {
                        this._lines[endStateIndex].setState(r.endState);
                    }
                }
                else {
                    this._lastState = r.endState;
                }
            }
            this._invalidLineStartIndex = Math.max(this._invalidLineStartIndex, endLineIndex + 1);
            this._tokenizationElapsedTime += sw.elapsed();
            this._tokenizationTotalCharacters += tokenizedCharacters;
            if (emitEvents && fromLineNumber <= toLineNumber) {
                this.emitModelTokensChangedEvent(fromLineNumber, toLineNumber);
            }
        };
        TextModelWithTokens.prototype.emitModelTokensChangedEvent = function (fromLineNumber, toLineNumber) {
            var e = {
                fromLineNumber: fromLineNumber,
                toLineNumber: toLineNumber
            };
            if (!this._isDisposing) {
                this.emit(EditorCommon.EventType.ModelTokensChanged, e);
            }
        };
        TextModelWithTokens.prototype._emitModelModeChangedEvent = function (e) {
            if (!this._isDisposing) {
                this.emit(EditorCommon.EventType.ModelModeChanged, e);
            }
        };
        TextModelWithTokens.prototype._emitModelModeSupportChangedEvent = function (e) {
            if (!this._isDisposing) {
                this.emit(EditorCommon.EventType.ModelModeSupportChanged, e);
            }
        };
        // Having tokens allows implementing additional helper methods
        TextModelWithTokens.prototype._lineIsTokenized = function (lineNumber) {
            return this._invalidLineStartIndex > lineNumber - 1;
        };
        TextModelWithTokens.prototype._getWordDefinition = function () {
            return textModelWithTokensHelpers_1.WordHelper.massageWordDefinitionOf(this._mode);
        };
        TextModelWithTokens.prototype.getWordAtPosition = function (position) {
            if (this._isDisposed) {
                throw new Error('TextModelWithTokens.getWordAtPosition: Model is disposed');
            }
            return textModelWithTokensHelpers_1.WordHelper.getWordAtPosition(this, this.validatePosition(position));
        };
        TextModelWithTokens.prototype.getWordUntilPosition = function (position) {
            if (this._isDisposed) {
                throw new Error('TextModelWithTokens.getWordUntilPosition: Model is disposed');
            }
            var wordAtPosition = this.getWordAtPosition(position);
            if (!wordAtPosition) {
                return {
                    word: '',
                    startColumn: position.column,
                    endColumn: position.column
                };
            }
            return {
                word: wordAtPosition.word.substr(0, position.column - wordAtPosition.startColumn),
                startColumn: wordAtPosition.startColumn,
                endColumn: position.column
            };
        };
        TextModelWithTokens.prototype.getWords = function (lineNumber) {
            if (this._isDisposed) {
                throw new Error('TextModelWithTokens.getWords: Model is disposed');
            }
            if (lineNumber < 1 || lineNumber > this.getLineCount()) {
                throw new Error('Illegal value ' + lineNumber + ' for `lineNumber`');
            }
            return textModelWithTokensHelpers_1.WordHelper.getWords(this, this.validateLineNumber(lineNumber));
        };
        TextModelWithTokens.prototype.tokenIterator = function (position, callback) {
            if (this._isDisposed) {
                throw new Error('TextModelWithTokens.tokenIterator: Model is disposed');
            }
            var iter = new tokenIterator_1.TokenIterator(this, this.validatePosition(position));
            var result = callback(iter);
            iter._invalidate();
            return result;
        };
        TextModelWithTokens.prototype.findMatchingBracketUp = function (tokenType, position) {
            if (this._isDisposed) {
                throw new Error('TextModelWithTokens.findMatchingBracketUp: Model is disposed');
            }
            return textModelWithTokensHelpers_1.BracketsHelper.findMatchingBracketUp(this, tokenType, this.validatePosition(position));
        };
        TextModelWithTokens.prototype.matchBracket = function (position, inaccurateResultAcceptable) {
            if (inaccurateResultAcceptable === void 0) { inaccurateResultAcceptable = false; }
            if (this._isDisposed) {
                throw new Error('TextModelWithTokens.matchBracket: Model is disposed');
            }
            return textModelWithTokensHelpers_1.BracketsHelper.matchBracket(this, this.validatePosition(position), inaccurateResultAcceptable);
        };
        TextModelWithTokens.MODE_TOKENIZATION_FAILED_MSG = nls.localize('mode.tokenizationSupportFailed', "The mode has failed while tokenizing the input.");
        TextModelWithTokens.MODEL_SYNC_LIMIT = 5 * 1024 * 1024; // 5 MB
        TextModelWithTokens.MODEL_TOKENIZATION_LIMIT = 20 * 1024 * 1024; // 20 MB
        return TextModelWithTokens;
    })(textModel_1.TextModel);
    exports.TextModelWithTokens = TextModelWithTokens;
});
//# sourceMappingURL=textModelWithTokens.js.map