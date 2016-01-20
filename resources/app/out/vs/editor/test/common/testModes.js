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
define(["require", "exports", 'vs/editor/common/modes', 'vs/editor/common/modes/supports', 'vs/editor/common/modes/abstractMode', 'vs/editor/common/modes/abstractState'], function (require, exports, modes, supports, abstractMode_1, abstractState_1) {
    var CommentState = (function (_super) {
        __extends(CommentState, _super);
        function CommentState(mode, stateCount) {
            _super.call(this, mode);
        }
        CommentState.prototype.makeClone = function () {
            return this;
        };
        CommentState.prototype.equals = function (other) {
            return true;
        };
        CommentState.prototype.tokenize = function (stream) {
            stream.advanceToEOS();
            return { type: 'state' };
        };
        return CommentState;
    })(abstractState_1.AbstractState);
    exports.CommentState = CommentState;
    var CommentMode = (function (_super) {
        __extends(CommentMode, _super);
        function CommentMode(commentsConfig) {
            var _this = this;
            _super.call(this, { id: 'tests.commentMode', workerParticipants: [] }, null, null);
            this.commentsConfig = commentsConfig;
            this.tokenizationSupport = new supports.TokenizationSupport(this, {
                getInitialState: function () { return new CommentState(_this, 0); }
            }, false, false);
        }
        CommentMode.prototype.getCommentsConfiguration = function () {
            return this.commentsConfig;
        };
        return CommentMode;
    })(abstractMode_1.AbstractMode);
    exports.CommentMode = CommentMode;
    var CursorState = (function (_super) {
        __extends(CursorState, _super);
        function CursorState(mode) {
            _super.call(this, mode);
        }
        CursorState.prototype.makeClone = function () {
            return this;
        };
        CursorState.prototype.equals = function (other) {
            return this === other;
        };
        CursorState.prototype.tokenize = function (stream) {
            stream.advanceToEOS();
            return { type: 'foooooo' };
        };
        return CursorState;
    })(abstractState_1.AbstractState);
    exports.CursorState = CursorState;
    var TestingMode = (function () {
        function TestingMode() {
        }
        TestingMode.prototype.getId = function () {
            return 'testing';
        };
        TestingMode.prototype.toSimplifiedMode = function () {
            return this;
        };
        return TestingMode;
    })();
    exports.TestingMode = TestingMode;
    var AbstractIndentingMode = (function (_super) {
        __extends(AbstractIndentingMode, _super);
        function AbstractIndentingMode() {
            _super.apply(this, arguments);
        }
        AbstractIndentingMode.prototype.getElectricCharacters = function () {
            return null;
        };
        AbstractIndentingMode.prototype.onElectricCharacter = function (context, offset) {
            return null;
        };
        AbstractIndentingMode.prototype.onEnter = function (context, offset) {
            return null;
        };
        return AbstractIndentingMode;
    })(TestingMode);
    exports.AbstractIndentingMode = AbstractIndentingMode;
    var IndentingMode = (function (_super) {
        __extends(IndentingMode, _super);
        function IndentingMode() {
            _super.call(this);
            this.electricCharacterSupport = this;
        }
        IndentingMode.prototype.onEnter = function (context, offset) {
            return {
                indentAction: modes.IndentAction.Indent
            };
        };
        return IndentingMode;
    })(AbstractIndentingMode);
    exports.IndentingMode = IndentingMode;
    var NonIndentingMode = (function (_super) {
        __extends(NonIndentingMode, _super);
        function NonIndentingMode() {
            _super.call(this);
            this.electricCharacterSupport = this;
        }
        NonIndentingMode.prototype.onEnter = function (context, offset) {
            return {
                indentAction: modes.IndentAction.None
            };
        };
        return NonIndentingMode;
    })(AbstractIndentingMode);
    exports.NonIndentingMode = NonIndentingMode;
    var IndentOutdentMode = (function (_super) {
        __extends(IndentOutdentMode, _super);
        function IndentOutdentMode() {
            _super.call(this);
            this.electricCharacterSupport = this;
        }
        IndentOutdentMode.prototype.onEnter = function (context, offset) {
            return {
                indentAction: modes.IndentAction.IndentOutdent
            };
        };
        return IndentOutdentMode;
    })(AbstractIndentingMode);
    exports.IndentOutdentMode = IndentOutdentMode;
    var CursorMode = (function (_super) {
        __extends(CursorMode, _super);
        function CursorMode() {
            _super.call(this);
            this.tokenizationSupport = new supports.TokenizationSupport(this, this, false, false);
            this.electricCharacterSupport = this;
        }
        CursorMode.prototype.getInitialState = function () {
            return new CursorState(this);
        };
        CursorMode.prototype.getElectricCharacters = function () {
            return null;
        };
        CursorMode.prototype.onEnter = function (context, offset) {
            return null;
        };
        return CursorMode;
    })(AbstractIndentingMode);
    exports.CursorMode = CursorMode;
    var SurroundingState = (function (_super) {
        __extends(SurroundingState, _super);
        function SurroundingState(mode) {
            _super.call(this, mode);
        }
        SurroundingState.prototype.makeClone = function () {
            return this;
        };
        SurroundingState.prototype.equals = function (other) {
            return this === other;
        };
        SurroundingState.prototype.tokenize = function (stream) {
            stream.advanceToEOS();
            return { type: '' };
        };
        return SurroundingState;
    })(abstractState_1.AbstractState);
    exports.SurroundingState = SurroundingState;
    var SurroundingMode = (function (_super) {
        __extends(SurroundingMode, _super);
        function SurroundingMode() {
            _super.call(this);
            this.tokenizationSupport = new supports.TokenizationSupport(this, this, false, false);
            this.electricCharacterSupport = this;
            this.characterPairSupport = new supports.CharacterPairSupport(this, {
                autoClosingPairs: [{ open: '(', close: ')' }] });
        }
        SurroundingMode.prototype.getInitialState = function () {
            return new SurroundingState(this);
        };
        SurroundingMode.prototype.getElectricCharacters = function () {
            return null;
        };
        SurroundingMode.prototype.onEnter = function (context, offset) {
            return null;
        };
        return SurroundingMode;
    })(AbstractIndentingMode);
    exports.SurroundingMode = SurroundingMode;
    var ModelState1 = (function (_super) {
        __extends(ModelState1, _super);
        function ModelState1(mode) {
            _super.call(this, mode);
        }
        ModelState1.prototype.makeClone = function () {
            return this;
        };
        ModelState1.prototype.equals = function (other) {
            return this === other;
        };
        ModelState1.prototype.tokenize = function (stream) {
            this.getMode().calledFor.push(stream.next());
            stream.advanceToEOS();
            return { type: '' };
        };
        return ModelState1;
    })(abstractState_1.AbstractState);
    exports.ModelState1 = ModelState1;
    var ModelMode1 = (function (_super) {
        __extends(ModelMode1, _super);
        function ModelMode1() {
            var _this = this;
            _super.call(this);
            this.calledFor = [];
            this.tokenizationSupport = new supports.TokenizationSupport(this, {
                getInitialState: function () { return new ModelState1(_this); }
            }, false, false);
        }
        return ModelMode1;
    })(TestingMode);
    exports.ModelMode1 = ModelMode1;
    var ModelState2 = (function (_super) {
        __extends(ModelState2, _super);
        function ModelState2(mode, prevLineContent) {
            _super.call(this, mode);
            this.prevLineContent = prevLineContent;
        }
        ModelState2.prototype.makeClone = function () {
            return new ModelState2(this.getMode(), this.prevLineContent);
        };
        ModelState2.prototype.equals = function (other) {
            return (other instanceof ModelState2) && (this.prevLineContent === other.prevLineContent);
        };
        ModelState2.prototype.tokenize = function (stream) {
            var line = '';
            while (!stream.eos()) {
                line += stream.next();
            }
            this.prevLineContent = line;
            return { type: '' };
        };
        return ModelState2;
    })(abstractState_1.AbstractState);
    exports.ModelState2 = ModelState2;
    var ModelMode2 = (function (_super) {
        __extends(ModelMode2, _super);
        function ModelMode2() {
            var _this = this;
            _super.call(this);
            this.calledFor = null;
            this.tokenizationSupport = new supports.TokenizationSupport(this, {
                getInitialState: function () { return new ModelState2(_this, ''); }
            }, false, false);
        }
        return ModelMode2;
    })(TestingMode);
    exports.ModelMode2 = ModelMode2;
    var BracketState = (function (_super) {
        __extends(BracketState, _super);
        function BracketState(mode) {
            _super.call(this, mode);
            this.allResults = null;
        }
        BracketState.prototype.makeClone = function () {
            return this;
        };
        BracketState.prototype.equals = function (other) {
            return true;
        };
        BracketState.prototype.tokenize = function (stream) {
            this.initializeAllResults();
            stream.setTokenRules('{}[]()', '');
            var token = stream.nextToken();
            // Strade compiler bug: can't reference self in Object return creation.
            var state = this;
            if (this.allResults.hasOwnProperty(token)) {
                return this.allResults[token];
            }
            else {
                return {
                    type: '',
                    bracket: modes.Bracket.None,
                    nextState: state
                };
            }
        };
        BracketState.prototype.initializeAllResults = function () {
            if (this.allResults !== null)
                return;
            this.allResults = {};
            var brackets = {
                '{': '}',
                '[': ']',
                '(': ')'
            };
            var type = 1;
            var state = this;
            for (var x in brackets) {
                this.allResults[x] = {
                    type: 'bracket' + type,
                    bracket: modes.Bracket.Open,
                    nextState: state
                };
                this.allResults[brackets[x]] = {
                    type: 'bracket' + type,
                    bracket: modes.Bracket.Close,
                    nextState: state
                };
                type++;
            }
        };
        return BracketState;
    })(abstractState_1.AbstractState);
    exports.BracketState = BracketState;
    var BracketMode = (function (_super) {
        __extends(BracketMode, _super);
        function BracketMode() {
            var _this = this;
            _super.call(this);
            this.tokenizationSupport = new supports.TokenizationSupport(this, {
                getInitialState: function () { return new BracketState(_this); }
            }, false, false);
        }
        return BracketMode;
    })(TestingMode);
    exports.BracketMode = BracketMode;
    var NState = (function (_super) {
        __extends(NState, _super);
        function NState(mode, n) {
            _super.call(this, mode);
            this.n = n;
            this.allResults = null;
        }
        NState.prototype.makeClone = function () {
            return this;
        };
        NState.prototype.equals = function (other) {
            return true;
        };
        NState.prototype.tokenize = function (stream) {
            var ndash = this.n, value = '';
            while (!stream.eos() && ndash > 0) {
                value += stream.next();
                ndash--;
            }
            return { type: 'n-' + (this.n - ndash) + '-' + value };
        };
        return NState;
    })(abstractState_1.AbstractState);
    exports.NState = NState;
    var NMode = (function (_super) {
        __extends(NMode, _super);
        function NMode(n) {
            var _this = this;
            this.n = n;
            _super.call(this);
            this.tokenizationSupport = new supports.TokenizationSupport(this, {
                getInitialState: function () { return new NState(_this, _this.n); }
            }, false, false);
        }
        return NMode;
    })(TestingMode);
    exports.NMode = NMode;
});
//# sourceMappingURL=testModes.js.map