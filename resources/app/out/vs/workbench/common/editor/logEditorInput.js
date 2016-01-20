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
define(["require", "exports", 'vs/workbench/common/editor/stringEditorInput', 'vs/workbench/services/editor/common/editorService', 'vs/platform/instantiation/common/instantiation'], function (require, exports, stringEditorInput_1, editorService_1, instantiation_1) {
    /**
     * A read-only text editor input whos contents are made of the provided value and mime type. As a subclass of StringEditorInput
     * it adds additional functionality suitable for using it to show output or logs.
     */
    var LogEditorInput = (function (_super) {
        __extends(LogEditorInput, _super);
        function LogEditorInput(name, description, value, mime, singleton, instantiationService, editorService) {
            _super.call(this, name, description, value, mime, singleton, instantiationService);
            this.editorService = editorService;
        }
        LogEditorInput.prototype.getId = function () {
            return LogEditorInput.ID;
        };
        /**
         * Appends text to the end of this input and automatically reveals the last line if an editor is visible with this input.
         */
        LogEditorInput.prototype.append = function (value) {
            _super.prototype.append.call(this, value);
            this.revealLastLine();
        };
        /**
         * Removes all lines from the top if the line number exceeds the given line count. Returns the new value if lines got trimmed.
         * Automatically reveals the last line if an editor is visible with this input.
         *
         * Note: This method is a no-op if the input has not yet been resolved.
         */
        LogEditorInput.prototype.trim = function (linecount) {
            var newValue = _super.prototype.trim.call(this, linecount);
            if (newValue !== null) {
                this.revealLastLine();
            }
            return newValue;
        };
        /**
         * Reveals the last line on any editor that has this output set.
         */
        LogEditorInput.prototype.revealLastLine = function () {
            var editors = this.editorService.getVisibleEditors();
            for (var i = 0; i < editors.length; i++) {
                var editor = editors[i];
                if (editor.input === this) {
                    var editorControl = editor.getControl();
                    if (editorControl) {
                        var model = editorControl.getModel();
                        if (model) {
                            var lastLine = model.getLineCount();
                            editorControl.revealLine(lastLine);
                        }
                    }
                }
            }
        };
        LogEditorInput.ID = 'workbench.editors.logEditorInput';
        LogEditorInput = __decorate([
            __param(5, instantiation_1.IInstantiationService),
            __param(6, editorService_1.IWorkbenchEditorService)
        ], LogEditorInput);
        return LogEditorInput;
    })(stringEditorInput_1.StringEditorInput);
    exports.LogEditorInput = LogEditorInput;
});
//# sourceMappingURL=logEditorInput.js.map