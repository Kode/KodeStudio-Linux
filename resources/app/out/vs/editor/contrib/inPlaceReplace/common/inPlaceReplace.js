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
define(["require", "exports", 'vs/nls', 'vs/base/common/winjs.base', 'vs/editor/common/editorCommonExtensions', 'vs/editor/common/editorAction', 'vs/editor/common/editorCommon', './inPlaceReplaceCommand', 'vs/editor/common/core/range', 'vs/platform/instantiation/common/instantiation', 'vs/base/common/keyCodes'], function (require, exports, nls, winjs_base_1, editorCommonExtensions_1, editorAction_1, EditorCommon, InPlaceReplaceCommand, range_1, instantiation_1, keyCodes_1) {
    var InPlaceReplace = (function (_super) {
        __extends(InPlaceReplace, _super);
        function InPlaceReplace(descriptor, editor, up, ns) {
            _super.call(this, descriptor, editor);
            this.up = up;
            this.requestIdPool = 0;
            this.currentRequest = winjs_base_1.TPromise.as(null);
            this.decorationRemover = winjs_base_1.TPromise.as(null);
            this.decorationIds = [];
        }
        InPlaceReplace.prototype.isSupported = function () {
            return !!this.editor.getModel().getMode().inplaceReplaceSupport && _super.prototype.isSupported.call(this);
        };
        InPlaceReplace.prototype.run = function () {
            var _this = this;
            // cancel any pending request
            this.currentRequest.cancel();
            var selection = this.editor.getSelection(), model = this.editor.getModel(), support = model.getMode().inplaceReplaceSupport;
            if (selection.startLineNumber !== selection.endLineNumber) {
                // Can't accept multiline selection
                return null;
            }
            //		if(selection.isEmpty()) {
            //			// Expand selection if empty
            //			selection.endColumn += 1;
            //		}
            var state = this.editor.captureState(EditorCommon.CodeEditorStateFlag.Value, EditorCommon.CodeEditorStateFlag.Position);
            this.currentRequest = support.navigateValueSet(model.getAssociatedResource(), selection, this.up);
            return this.currentRequest.then(function (result) {
                if (!result || !result.range || !result.value) {
                    // No proper result
                    return;
                }
                if (!state.validate(_this.editor)) {
                    // state has changed
                    return;
                }
                // Selection
                var editRange = range_1.Range.lift(result.range), highlightRange = result.range, diff = result.value.length - (selection.endColumn - selection.startColumn);
                // highlight
                highlightRange.endColumn = highlightRange.startColumn + result.value.length;
                selection.endColumn += diff > 1 ? (diff - 1) : 0;
                // Insert new text
                var command = new InPlaceReplaceCommand.InPlaceReplaceCommand(editRange, selection, result.value);
                _this.editor.executeCommand(_this.id, command);
                // add decoration
                _this.decorationIds = _this.editor.deltaDecorations(_this.decorationIds, [{
                        range: highlightRange,
                        options: InPlaceReplace.DECORATION
                    }]);
                // remove decoration after delay
                _this.decorationRemover.cancel();
                _this.decorationRemover = winjs_base_1.TPromise.timeout(350);
                _this.decorationRemover.then(function () {
                    _this.editor.changeDecorations(function (accessor) {
                        _this.decorationIds = accessor.deltaDecorations(_this.decorationIds, []);
                    });
                });
                return true;
            });
        };
        InPlaceReplace.DECORATION = {
            className: 'valueSetReplacement'
        };
        InPlaceReplace = __decorate([
            __param(3, instantiation_1.INullService)
        ], InPlaceReplace);
        return InPlaceReplace;
    })(editorAction_1.EditorAction);
    var InPlaceReplaceUp = (function (_super) {
        __extends(InPlaceReplaceUp, _super);
        function InPlaceReplaceUp(descriptor, editor, ns) {
            _super.call(this, descriptor, editor, true, ns);
        }
        InPlaceReplaceUp.ID = 'editor.action.inPlaceReplace.up';
        InPlaceReplaceUp = __decorate([
            __param(2, instantiation_1.INullService)
        ], InPlaceReplaceUp);
        return InPlaceReplaceUp;
    })(InPlaceReplace);
    var InPlaceReplaceDown = (function (_super) {
        __extends(InPlaceReplaceDown, _super);
        function InPlaceReplaceDown(descriptor, editor, ns) {
            _super.call(this, descriptor, editor, false, ns);
        }
        InPlaceReplaceDown.ID = 'editor.action.inPlaceReplace.down';
        InPlaceReplaceDown = __decorate([
            __param(2, instantiation_1.INullService)
        ], InPlaceReplaceDown);
        return InPlaceReplaceDown;
    })(InPlaceReplace);
    // register actions
    editorCommonExtensions_1.CommonEditorRegistry.registerEditorAction(new editorCommonExtensions_1.EditorActionDescriptor(InPlaceReplaceUp, InPlaceReplaceUp.ID, nls.localize('InPlaceReplaceAction.previous.label', "Replace with Previous Value"), {
        context: editorCommonExtensions_1.ContextKey.EditorTextFocus,
        primary: keyCodes_1.KeyMod.CtrlCmd | keyCodes_1.KeyMod.Shift | keyCodes_1.KeyCode.US_COMMA
    }));
    editorCommonExtensions_1.CommonEditorRegistry.registerEditorAction(new editorCommonExtensions_1.EditorActionDescriptor(InPlaceReplaceDown, InPlaceReplaceDown.ID, nls.localize('InPlaceReplaceAction.next.label', "Replace with Next Value"), {
        context: editorCommonExtensions_1.ContextKey.EditorTextFocus,
        primary: keyCodes_1.KeyMod.CtrlCmd | keyCodes_1.KeyMod.Shift | keyCodes_1.KeyCode.US_DOT
    }));
});
//# sourceMappingURL=inPlaceReplace.js.map