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
define(["require", "exports", 'vs/base/common/winjs.base', 'vs/base/common/actions', 'vs/workbench/services/quickopen/common/quickOpenService'], function (require, exports, winjs_base_1, actions_1, quickOpenService_1) {
    var QuickOpenAction = (function (_super) {
        __extends(QuickOpenAction, _super);
        function QuickOpenAction(actionId, actionLabel, prefix, quickOpenService) {
            _super.call(this, actionId, actionLabel);
            this.quickOpenService = quickOpenService;
            this.prefix = prefix;
            this.enabled = !!this.quickOpenService;
        }
        QuickOpenAction.prototype.run = function () {
            // Show with prefix
            this.quickOpenService.show(this.prefix);
            return winjs_base_1.Promise.as(null);
        };
        QuickOpenAction = __decorate([
            __param(3, quickOpenService_1.IQuickOpenService)
        ], QuickOpenAction);
        return QuickOpenAction;
    })(actions_1.Action);
    exports.QuickOpenAction = QuickOpenAction;
});
//# sourceMappingURL=quickOpenAction.js.map