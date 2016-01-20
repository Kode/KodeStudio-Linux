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
define(["require", "exports", 'vs/editor/common/modes/supports', 'vs/editor/common/modes/abstractMode', 'vs/editor/common/modes/abstractState', 'vs/platform/instantiation/common/instantiation', 'vs/platform/thread/common/thread'], function (require, exports, supports, abstractMode_1, abstractState_1, instantiation_1, thread_1) {
    var State = (function (_super) {
        __extends(State, _super);
        function State(mode) {
            _super.call(this, mode);
        }
        State.prototype.makeClone = function () {
            return this;
        };
        State.prototype.equals = function (other) {
            if (other instanceof State) {
                return (_super.prototype.equals.call(this, other));
            }
            return false;
        };
        State.prototype.tokenize = function (stream) {
            stream.advanceToEOS();
            return { type: '' };
        };
        return State;
    })(abstractState_1.AbstractState);
    var Mode = (function (_super) {
        __extends(Mode, _super);
        function Mode(descriptor, instantiationService, threadService) {
            var _this = this;
            _super.call(this, descriptor, instantiationService, threadService);
            this.tokenizationSupport = new supports.TokenizationSupport(this, {
                getInitialState: function () { return new State(_this); }
            }, false, false);
        }
        Mode = __decorate([
            __param(1, instantiation_1.IInstantiationService),
            __param(2, thread_1.IThreadService)
        ], Mode);
        return Mode;
    })(abstractMode_1.AbstractMode);
    exports.Mode = Mode;
});
//# sourceMappingURL=plaintext.js.map