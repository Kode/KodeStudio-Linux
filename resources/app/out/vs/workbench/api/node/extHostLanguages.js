/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
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
define(["require", "exports", 'vs/base/common/winjs.base', 'vs/platform/thread/common/thread', 'vs/editor/common/modes/modesRegistry', 'vs/platform/platform', 'vs/platform/instantiation/common/instantiation'], function (require, exports, winjs_base_1, thread_1, modesRegistry_1, platform_1, instantiation_1) {
    var ExtHostLanguages = (function () {
        function ExtHostLanguages(threadService) {
            this._proxy = threadService.getRemotable(MainThreadLanguages);
        }
        ExtHostLanguages.prototype.getLanguages = function () {
            return this._proxy._getLanguages();
        };
        ExtHostLanguages = __decorate([
            __param(0, thread_1.IThreadService)
        ], ExtHostLanguages);
        return ExtHostLanguages;
    })();
    exports.ExtHostLanguages = ExtHostLanguages;
    var MainThreadLanguages = (function () {
        function MainThreadLanguages(ns) {
            this._registry = platform_1.Registry.as(modesRegistry_1.Extensions.EditorModes);
        }
        MainThreadLanguages.prototype._getLanguages = function () {
            return winjs_base_1.TPromise.as(this._registry.getRegisteredModes());
        };
        MainThreadLanguages = __decorate([
            thread_1.Remotable.MainContext('MainThreadLanguages'),
            __param(0, instantiation_1.INullService)
        ], MainThreadLanguages);
        return MainThreadLanguages;
    })();
    exports.MainThreadLanguages = MainThreadLanguages;
});
//# sourceMappingURL=extHostLanguages.js.map