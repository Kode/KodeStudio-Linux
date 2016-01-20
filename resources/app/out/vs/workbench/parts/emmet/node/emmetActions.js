/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
/// <reference path="emmet.d.ts" />
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
define(["require", "exports", 'vs/base/common/winjs.base', 'vs/editor/common/editorAction', './editorAccessor', 'vs/platform/instantiation/common/instantiation'], function (require, exports, winjs_base_1, editorAction_1, editorAccessor_1, instantiation_1) {
    var ExpandAbbreviationAction = (function (_super) {
        __extends(ExpandAbbreviationAction, _super);
        function ExpandAbbreviationAction(descriptor, editor, ns) {
            _super.call(this, descriptor, editor, editorAction_1.Behaviour.TextFocus);
            this.editorAccessor = new editorAccessor_1.EditorAccessor(editor);
        }
        ExpandAbbreviationAction.prototype.run = function () {
            var _this = this;
            return new winjs_base_1.TPromise(function (c, e) {
                require(['emmet'], function (_module) {
                    try {
                        if (!_this.editorAccessor.isEmmetEnabledMode()) {
                            _this.editorAccessor.noExpansionOccurred();
                            return;
                        }
                        if (!_module.run('expand_abbreviation', _this.editorAccessor)) {
                            _this.editorAccessor.noExpansionOccurred();
                        }
                    }
                    catch (err) {
                    }
                    finally {
                        _this.editorAccessor.flushCache();
                    }
                }, e);
            });
        };
        ExpandAbbreviationAction.ID = 'editor.emmet.action.expandAbbreviation';
        ExpandAbbreviationAction = __decorate([
            __param(2, instantiation_1.INullService)
        ], ExpandAbbreviationAction);
        return ExpandAbbreviationAction;
    })(editorAction_1.EditorAction);
    exports.ExpandAbbreviationAction = ExpandAbbreviationAction;
});
//# sourceMappingURL=emmetActions.js.map