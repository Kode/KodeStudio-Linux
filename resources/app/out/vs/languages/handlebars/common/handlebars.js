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
define(["require", "exports", 'vs/editor/common/modes', 'vs/editor/common/modes/supports', 'vs/languages/html/common/html', 'vs/editor/common/modes/supports/onEnter', 'vs/languages/handlebars/common/handlebarsTokenTypes', 'vs/platform/instantiation/common/instantiation', 'vs/platform/thread/common/thread', 'vs/editor/common/services/modeService'], function (require, exports, Modes, supports, htmlMode, onEnter_1, handlebarsTokenTypes, instantiation_1, thread_1, modeService_1) {
    (function (States) {
        States[States["HTML"] = 0] = "HTML";
        States[States["Expression"] = 1] = "Expression";
        States[States["UnescapedExpression"] = 2] = "UnescapedExpression";
    })(exports.States || (exports.States = {}));
    var States = exports.States;
    var HandlebarsState = (function (_super) {
        __extends(HandlebarsState, _super);
        function HandlebarsState(mode, kind, handlebarsKind, lastTagName, lastAttributeName, embeddedContentType, attributeValueQuote, attributeValue) {
            _super.call(this, mode, kind, lastTagName, lastAttributeName, embeddedContentType, attributeValueQuote, attributeValue);
            this.kind = kind;
            this.handlebarsKind = handlebarsKind;
            this.lastTagName = lastTagName;
            this.lastAttributeName = lastAttributeName;
            this.embeddedContentType = embeddedContentType;
            this.attributeValueQuote = attributeValueQuote;
            this.attributeValue = attributeValue;
        }
        HandlebarsState.prototype.makeClone = function () {
            return new HandlebarsState(this.getMode(), this.kind, this.handlebarsKind, this.lastTagName, this.lastAttributeName, this.embeddedContentType, this.attributeValueQuote, this.attributeValue);
        };
        HandlebarsState.prototype.equals = function (other) {
            if (other instanceof HandlebarsState) {
                return (_super.prototype.equals.call(this, other));
            }
            return false;
        };
        HandlebarsState.prototype.tokenize = function (stream) {
            switch (this.handlebarsKind) {
                case States.HTML:
                    if (stream.advanceIfString('{{{').length > 0) {
                        this.handlebarsKind = States.UnescapedExpression;
                        return { type: handlebarsTokenTypes.EMBED_UNESCAPED, bracket: Modes.Bracket.Open };
                    }
                    else if (stream.advanceIfString('{{').length > 0) {
                        this.handlebarsKind = States.Expression;
                        return { type: handlebarsTokenTypes.EMBED, bracket: Modes.Bracket.Open };
                    }
                    break;
                case States.Expression:
                case States.UnescapedExpression:
                    if (this.handlebarsKind === States.Expression && stream.advanceIfString('}}').length > 0) {
                        this.handlebarsKind = States.HTML;
                        return { type: handlebarsTokenTypes.EMBED, bracket: Modes.Bracket.Close };
                    }
                    else if (this.handlebarsKind === States.UnescapedExpression && stream.advanceIfString('}}}').length > 0) {
                        this.handlebarsKind = States.HTML;
                        return { type: handlebarsTokenTypes.EMBED_UNESCAPED, bracket: Modes.Bracket.Close };
                    }
                    else if (stream.skipWhitespace().length > 0) {
                        return { type: '' };
                    }
                    if (stream.peek() === '#') {
                        stream.advanceWhile(/^[^\s}]/);
                        return { type: handlebarsTokenTypes.KEYWORD, bracket: Modes.Bracket.Open };
                    }
                    if (stream.peek() === '/') {
                        stream.advanceWhile(/^[^\s}]/);
                        return { type: handlebarsTokenTypes.KEYWORD, bracket: Modes.Bracket.Close };
                    }
                    if (stream.advanceIfString('else')) {
                        var next = stream.peek();
                        if (next === ' ' || next === '\t' || next === '}') {
                            return { type: handlebarsTokenTypes.KEYWORD };
                        }
                        else {
                            stream.goBack(4);
                        }
                    }
                    if (stream.advanceWhile(/^[^\s}]/).length > 0) {
                        return { type: handlebarsTokenTypes.VARIABLE };
                    }
                    break;
            }
            return _super.prototype.tokenize.call(this, stream);
        };
        return HandlebarsState;
    })(htmlMode.State);
    exports.HandlebarsState = HandlebarsState;
    var HandlebarsMode = (function (_super) {
        __extends(HandlebarsMode, _super);
        function HandlebarsMode(descriptor, instantiationService, threadService, modeService) {
            _super.call(this, descriptor, instantiationService, threadService, modeService);
            this.formattingSupport = null;
            this.onEnterSupport = new onEnter_1.OnEnterSupport(this.getId(), {
                brackets: [
                    { open: '<!--', close: '-->' },
                    { open: '{{', close: '}}' },
                ]
            });
        }
        HandlebarsMode.prototype.asyncCtor = function () {
            var _this = this;
            return _super.prototype.asyncCtor.call(this).then(function () {
                var pairs = _this.characterPairSupport.getAutoClosingPairs().slice(0).concat([
                    { open: '{', close: '}' }
                ]);
                _this.characterPairSupport = new supports.CharacterPairSupport(_this, {
                    autoClosingPairs: pairs.slice(0),
                    surroundingPairs: [
                        { open: '<', close: '>' },
                        { open: '"', close: '"' },
                        { open: '\'', close: '\'' }
                    ]
                });
            });
        };
        HandlebarsMode.prototype.getInitialState = function () {
            return new HandlebarsState(this, htmlMode.States.Content, States.HTML, '', '', '', '', '');
        };
        HandlebarsMode.prototype.getLeavingNestedModeData = function (line, state) {
            var leavingNestedModeData = _super.prototype.getLeavingNestedModeData.call(this, line, state);
            if (leavingNestedModeData) {
                leavingNestedModeData.stateAfterNestedMode = new HandlebarsState(this, htmlMode.States.Content, States.HTML, '', '', '', '', '');
            }
            return leavingNestedModeData;
        };
        HandlebarsMode = __decorate([
            __param(1, instantiation_1.IInstantiationService),
            __param(2, thread_1.IThreadService),
            __param(3, modeService_1.IModeService)
        ], HandlebarsMode);
        return HandlebarsMode;
    })(htmlMode.HTMLMode);
    exports.HandlebarsMode = HandlebarsMode;
});
//# sourceMappingURL=handlebars.js.map