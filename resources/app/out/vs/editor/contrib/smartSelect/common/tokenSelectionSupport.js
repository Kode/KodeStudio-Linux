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
define(["require", "exports", 'vs/base/common/winjs.base', './tokenTree', 'vs/editor/common/services/modelService', 'vs/editor/common/core/range'], function (require, exports, winjs_base_1, tokenTree, modelService_1, range_1) {
    var TokenSelectionSupport = (function () {
        function TokenSelectionSupport(modelService) {
            this._modelService = modelService;
        }
        TokenSelectionSupport.prototype.getRangesToPosition = function (resource, position) {
            var model = this._modelService.getModel(resource), entries = [];
            if (model) {
                this._doGetRangesToPosition(model, position).forEach(function (range) {
                    entries.push({
                        type: void 0,
                        range: range
                    });
                });
            }
            return winjs_base_1.TPromise.as(entries);
        };
        TokenSelectionSupport.prototype._doGetRangesToPosition = function (model, position) {
            var tree = tokenTree.build(model), node, lastRange;
            node = tokenTree.find(tree, position);
            var ranges = [];
            while (node) {
                if (!lastRange || !range_1.Range.equalsRange(lastRange, node.range)) {
                    ranges.push(node.range);
                }
                lastRange = node.range;
                node = node.parent;
            }
            ranges = ranges.reverse();
            return ranges;
        };
        TokenSelectionSupport = __decorate([
            __param(0, modelService_1.IModelService)
        ], TokenSelectionSupport);
        return TokenSelectionSupport;
    })();
    return TokenSelectionSupport;
});
//# sourceMappingURL=tokenSelectionSupport.js.map