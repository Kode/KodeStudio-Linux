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
define(["require", "exports", 'vs/base/common/winjs.base', 'vs/editor/browser/editorBrowserExtensions', 'vs/editor/common/editorAction', './quickOpenEditorWidget', 'vs/platform/instantiation/common/instantiation'], function (require, exports, winjs_base_1, editorBrowserExtensions_1, editorAction_1, QuickOpenEditorWidget, instantiation_1) {
    var QuickOpenController = (function () {
        function QuickOpenController(editor, ns) {
            this.editor = editor;
        }
        QuickOpenController.get = function (editor) {
            return editor.getContribution(QuickOpenController.ID);
        };
        QuickOpenController.prototype.getId = function () {
            return QuickOpenController.ID;
        };
        QuickOpenController.prototype.dispose = function () {
            // Dispose widget
            if (this.widget) {
                this.widget.destroy();
                this.widget = null;
            }
        };
        QuickOpenController.prototype.run = function (opts) {
            var _this = this;
            if (this.widget) {
                this.widget.destroy();
                this.widget = null;
            }
            // Create goto line widget
            if (!this.widget) {
                this.widget = new QuickOpenEditorWidget.QuickOpenEditorWidget(this.editor, function () { return opts.onOk(); }, function () { return opts.onCancel(); }, function (value) {
                    _this.widget.setInput(opts.getModel(value), opts.getAutoFocus(value));
                }, {
                    inputAriaLabel: opts.inputAriaLabel
                });
                // Show
                this.widget.show('');
            }
        };
        QuickOpenController.ID = 'editor.controller.quickOpenController';
        QuickOpenController = __decorate([
            __param(1, instantiation_1.INullService)
        ], QuickOpenController);
        return QuickOpenController;
    })();
    exports.QuickOpenController = QuickOpenController;
    /**
     * Base class for providing quick open in the editor.
     */
    var BaseEditorQuickOpenAction = (function (_super) {
        __extends(BaseEditorQuickOpenAction, _super);
        function BaseEditorQuickOpenAction(descriptor, editor, label, condition) {
            if (condition === void 0) { condition = editorAction_1.Behaviour.WidgetFocus; }
            _super.call(this, descriptor, editor, condition);
            this.label = label;
        }
        BaseEditorQuickOpenAction.prototype.run = function () {
            var _this = this;
            QuickOpenController.get(this.editor).run({
                inputAriaLabel: this._getInputAriaLabel(),
                getModel: function (value) { return _this._getModel(value); },
                getAutoFocus: function (searchValue) { return _this._getAutoFocus(searchValue); },
                onOk: function () { return _this._onClose(false); },
                onCancel: function () { return _this._onClose(true); }
            });
            // }
            // 	()=>this._onClose(false),
            // 	()=>this._onClose(true),
            // 	(value:string)=>this.onType(value),
            // )
            // this._getInputAriaLabel()
            // this.widget = new QuickOpenEditorWidget.QuickOpenEditorWidget(
            // 		this.editor,
            // 		()=>this._onClose(false),
            // 		()=>this._onClose(true),
            // 		(value:string)=>this.onType(value),
            // 		{
            // 			inputAriaLabel: this._getInputAriaLabel()
            // 		}
            // 	);
            // Remember selection to be able to restore on cancel
            if (!this.lastKnownEditorSelection) {
                this.lastKnownEditorSelection = this.editor.getSelection();
            }
            return winjs_base_1.TPromise.as(true);
        };
        /**
         * Subclasses to override to provide the quick open model for the given search value.
         */
        BaseEditorQuickOpenAction.prototype._getModel = function (value) {
            throw new Error('Subclasses to implement');
        };
        /**
         * Subclasses to override to provide the quick open auto focus mode for the given search value.
         */
        BaseEditorQuickOpenAction.prototype._getAutoFocus = function (searchValue) {
            throw new Error('Subclasses to implement');
        };
        BaseEditorQuickOpenAction.prototype._getInputAriaLabel = function () {
            throw new Error('Subclasses to implement');
        };
        BaseEditorQuickOpenAction.prototype.decorateLine = function (range, editor) {
            var _this = this;
            editor.changeDecorations(function (changeAccessor) {
                var oldDecorations = [];
                if (_this.lineHighlightDecorationId) {
                    oldDecorations.push(_this.lineHighlightDecorationId);
                    _this.lineHighlightDecorationId = null;
                }
                var newDecorations = [
                    {
                        range: range,
                        options: {
                            className: 'lineHighlight',
                            isWholeLine: true
                        }
                    }
                ];
                var decorations = changeAccessor.deltaDecorations(oldDecorations, newDecorations);
                _this.lineHighlightDecorationId = decorations[0];
            });
        };
        BaseEditorQuickOpenAction.prototype.clearDecorations = function () {
            var _this = this;
            if (this.lineHighlightDecorationId) {
                this.editor.changeDecorations(function (changeAccessor) {
                    changeAccessor.deltaDecorations([_this.lineHighlightDecorationId], []);
                    _this.lineHighlightDecorationId = null;
                });
            }
        };
        /**
         * Subclasses can override this to participate in the close of quick open.
         */
        BaseEditorQuickOpenAction.prototype._onClose = function (canceled) {
            // Clear Highlight Decorations if present
            this.clearDecorations();
            // Restore selection if canceled
            if (canceled && this.lastKnownEditorSelection) {
                this.editor.setSelection(this.lastKnownEditorSelection);
                this.editor.revealRangeInCenterIfOutsideViewport(this.lastKnownEditorSelection);
            }
            this.lastKnownEditorSelection = null;
            this.editor.focus();
        };
        BaseEditorQuickOpenAction.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
        };
        return BaseEditorQuickOpenAction;
    })(editorAction_1.EditorAction);
    exports.BaseEditorQuickOpenAction = BaseEditorQuickOpenAction;
    editorBrowserExtensions_1.EditorBrowserRegistry.registerEditorContribution(QuickOpenController);
});
//# sourceMappingURL=editorQuickOpen.js.map