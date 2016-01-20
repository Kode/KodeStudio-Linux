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
define(["require", "exports", 'vs/languages/html/common/html', 'vs/languages/razor/common/csharpTokenization', 'vs/editor/common/modes/abstractMode', 'vs/platform/instantiation/common/descriptors', 'vs/editor/common/modes/supports/onEnter', 'vs/languages/razor/common/razorTokenTypes', 'vs/platform/instantiation/common/instantiation', 'vs/platform/thread/common/thread', 'vs/editor/common/services/modeService'], function (require, exports, htmlMode, csharpTokenization, abstractMode_1, descriptors_1, onEnter_1, razorTokenTypes, instantiation_1, thread_1, modeService_1) {
    // for a brief description of the razor syntax see http://www.mikesdotnetting.com/Article/153/Inline-Razor-Syntax-Overview
    var RAZORState = (function (_super) {
        __extends(RAZORState, _super);
        function RAZORState(mode, kind, lastTagName, lastAttributeName, embeddedContentType, attributeValueQuote, attributeValue) {
            _super.call(this, mode, kind, lastTagName, lastAttributeName, embeddedContentType, attributeValueQuote, attributeValue);
        }
        RAZORState.prototype.makeClone = function () {
            return new RAZORState(this.getMode(), this.kind, this.lastTagName, this.lastAttributeName, this.embeddedContentType, this.attributeValueQuote, this.attributeValue);
        };
        RAZORState.prototype.equals = function (other) {
            if (other instanceof RAZORState) {
                return (_super.prototype.equals.call(this, other));
            }
            return false;
        };
        RAZORState.prototype.tokenize = function (stream) {
            if (!stream.eos() && stream.peek() === '@') {
                stream.next();
                if (!stream.eos() && stream.peek() === '*') {
                    return { nextState: new csharpTokenization.CSComment(this.getMode(), this, '@') };
                }
                if (stream.eos() || stream.peek() !== '@') {
                    return { type: razorTokenTypes.EMBED_CS, nextState: new csharpTokenization.CSStatement(this.getMode(), this, 0, 0, true, true, true, false) };
                }
            }
            return _super.prototype.tokenize.call(this, stream);
        };
        return RAZORState;
    })(htmlMode.State);
    var RAZORMode = (function (_super) {
        __extends(RAZORMode, _super);
        function RAZORMode(descriptor, instantiationService, threadService, modeService) {
            _super.call(this, descriptor, instantiationService, threadService, modeService);
            this.formattingSupport = null;
            this.onEnterSupport = new onEnter_1.OnEnterSupport(this.getId(), {
                brackets: [
                    { open: '<!--', close: '-->' },
                    { open: '{', close: '}' },
                    { open: '(', close: ')' },
                ]
            });
        }
        RAZORMode.prototype._getWorkerDescriptor = function () {
            return descriptors_1.createAsyncDescriptor2('vs/languages/razor/common/razorWorker', 'RAZORWorker');
        };
        RAZORMode.prototype.getInitialState = function () {
            return new RAZORState(this, htmlMode.States.Content, '', '', '', '', '');
        };
        RAZORMode.prototype.getWordDefinition = function () {
            return RAZORMode.WORD_DEFINITION;
        };
        RAZORMode.prototype.getLeavingNestedModeData = function (line, state) {
            var leavingNestedModeData = _super.prototype.getLeavingNestedModeData.call(this, line, state);
            if (leavingNestedModeData) {
                leavingNestedModeData.stateAfterNestedMode = new RAZORState(this, htmlMode.States.Content, '', '', '', '', '');
            }
            return leavingNestedModeData;
        };
        RAZORMode.WORD_DEFINITION = abstractMode_1.createWordRegExp('#?%');
        RAZORMode = __decorate([
            __param(1, instantiation_1.IInstantiationService),
            __param(2, thread_1.IThreadService),
            __param(3, modeService_1.IModeService)
        ], RAZORMode);
        return RAZORMode;
    })(htmlMode.HTMLMode);
    exports.RAZORMode = RAZORMode;
});
//# sourceMappingURL=razor.js.map