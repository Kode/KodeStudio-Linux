/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
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
define(["require", "exports", 'vs/base/common/winjs.base', 'vs/base/common/mime', 'vs/workbench/common/editor', 'vs/workbench/common/editor/stringEditorInput', 'vs/platform/instantiation/common/instantiation'], function (require, exports, winjs_base_1, mime, wbeditorcommon, strinput, instantiation_1) {
    var DebugStringEditorInput = (function (_super) {
        __extends(DebugStringEditorInput, _super);
        function DebugStringEditorInput(name, resourceUrl, description, value, mimeType, singleton, instantiationService) {
            _super.call(this, name, description, value, mimeType || mime.MIME_TEXT, singleton, instantiationService);
            this.resourceUrl = resourceUrl;
        }
        DebugStringEditorInput.prototype.getResource = function () {
            return this.resourceUrl;
        };
        DebugStringEditorInput = __decorate([
            __param(6, instantiation_1.IInstantiationService)
        ], DebugStringEditorInput);
        return DebugStringEditorInput;
    })(strinput.StringEditorInput);
    exports.DebugStringEditorInput = DebugStringEditorInput;
    var ReplEditorInput = (function (_super) {
        __extends(ReplEditorInput, _super);
        function ReplEditorInput() {
            _super.apply(this, arguments);
        }
        ReplEditorInput.getInstance = function () {
            if (!ReplEditorInput.instance) {
                ReplEditorInput.instance = new ReplEditorInput();
            }
            return ReplEditorInput.instance;
        };
        ReplEditorInput.prototype.getId = function () {
            return ReplEditorInput.ID;
        };
        ReplEditorInput.prototype.getName = function () {
            return ReplEditorInput.NAME;
        };
        ReplEditorInput.prototype.resolve = function (refresh) {
            return winjs_base_1.TPromise.as(null);
        };
        ReplEditorInput.ID = 'workbench.editors.replEditorInput';
        ReplEditorInput.NAME = 'Debug Console';
        return ReplEditorInput;
    })(wbeditorcommon.EditorInput);
    exports.ReplEditorInput = ReplEditorInput;
});
//# sourceMappingURL=debugEditorInputs.js.map