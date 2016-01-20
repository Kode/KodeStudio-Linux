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
define(["require", "exports", 'vs/base/common/winjs.base', 'vs/base/browser/ui/timer/timer', 'vs/platform/platform', 'vs/base/common/actions', 'vs/platform/actions/common/actions', 'vs/workbench/common/actionRegistry', 'vs/platform/instantiation/common/instantiation'], function (require, exports, winjs_base_1, timer_1, platform_1, actions_1, actions_2, actionRegistry_1, instantiation_1) {
    var ID = 'workbench.action.showPerfBox';
    var LABEL = 'Display Performance Box';
    var timeKeeperRenderer = null;
    var ShowPerformanceBox = (function (_super) {
        __extends(ShowPerformanceBox, _super);
        function ShowPerformanceBox(id, label, ns) {
            _super.call(this, id, label, null, true);
        }
        ShowPerformanceBox.prototype.run = function () {
            if (timeKeeperRenderer === null) {
                timeKeeperRenderer = new timer_1.TimeKeeperRenderer(function () {
                    timeKeeperRenderer.destroy();
                    timeKeeperRenderer = null;
                });
            }
            return winjs_base_1.Promise.as(true);
        };
        ShowPerformanceBox = __decorate([
            __param(2, instantiation_1.INullService)
        ], ShowPerformanceBox);
        return ShowPerformanceBox;
    })(actions_1.Action);
    exports.ShowPerformanceBox = ShowPerformanceBox;
    if (false /* Env.enablePerformanceTools */) {
        var registry = platform_1.Registry.as(actionRegistry_1.Extensions.WorkbenchActions);
        registry.registerWorkbenchAction(new actions_2.SyncActionDescriptor(ShowPerformanceBox, ID, LABEL));
    }
});
//# sourceMappingURL=showPerformanceBox.js.map