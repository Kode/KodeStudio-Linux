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
define(["require", "exports", 'vs/nls', 'vs/base/common/arrays', 'vs/base/common/uri', 'vs/base/common/winjs.base', 'vs/base/common/severity', 'vs/base/common/lifecycle', 'vs/base/common/errors', 'vs/editor/common/editorCommon', 'vs/editor/common/core/range', 'vs/editor/common/core/position', 'vs/editor/browser/editorBrowserExtensions', 'vs/editor/common/editorCommonExtensions', 'vs/editor/common/editorAction', './referenceSearchWidget', './referenceSearchModel', 'vs/editor/contrib/zoneWidget/browser/peekViewWidget', 'vs/platform/editor/common/editor', 'vs/platform/instantiation/common/instantiation', 'vs/platform/message/common/message', 'vs/platform/telemetry/common/telemetry', 'vs/platform/workspace/common/workspace', 'vs/platform/keybinding/common/keybindingService', 'vs/platform/keybinding/common/keybindingsRegistry', 'vs/base/common/keyCodes', '../common/referenceSearch'], function (require, exports, nls, arrays_1, uri_1, winjs_base_1, severity_1, lifecycle, errors, EditorCommon, range_1, position_1, editorBrowserExtensions_1, editorCommonExtensions_1, editorAction_1, widget, model, peekView, editor_1, instantiation_1, message_1, telemetry_1, workspace_1, keybindingService_1, keybindingsRegistry_1, keyCodes_1, referenceSearch_1) {
    var IPeekViewService = peekView.IPeekViewService;
    var FindReferencesController = (function () {
        function FindReferencesController(editor, editorService, telemetryService, messageService, instantiationService, peekViewService, contextService, keybindingService) {
            this._startTime = -1;
            this.requestIdPool = 0;
            this.callOnClear = [];
            this.editorService = editorService;
            this.telemetryService = telemetryService;
            this.messageService = messageService;
            this.instantiationService = instantiationService;
            this.peekViewService = peekViewService;
            this.contextService = contextService;
            this.keybindingService = keybindingService;
            this.modelRevealing = false;
            this.editor = editor;
            this._referenceSearchVisible = keybindingService.createKey(CONTEXT_REFERENCE_SEARCH_VISIBLE, false);
        }
        FindReferencesController.getController = function (editor) {
            return editor.getContribution(FindReferencesController.ID);
        };
        FindReferencesController.prototype.getId = function () {
            return FindReferencesController.ID;
        };
        FindReferencesController.prototype.dispose = function () {
            if (this.widget) {
                this.widget.dispose();
                this.widget = null;
            }
            this.editor = null;
        };
        FindReferencesController.prototype.isInPeekView = function () {
            return this.peekViewService && this.peekViewService.isActive;
        };
        FindReferencesController.prototype.closeReferenceSearch = function () {
            this.clear();
        };
        FindReferencesController.prototype.processRequest = function (range, referencesPromise) {
            var _this = this;
            var widgetPosition = !this.widget ? null : this.widget.position;
            // clean up from previous invocation
            var widgetClosed = this.clear();
            // Close if the position is still the same
            if (widgetClosed && !!widgetPosition && range.containsPosition(widgetPosition)) {
                return null;
            }
            this._referenceSearchVisible.set(true);
            // close the widget on model/mode changes
            this.callOnClear.push(this.editor.addListener(EditorCommon.EventType.ModelModeChanged, function () { _this.clear(); }));
            this.callOnClear.push(this.editor.addListener(EditorCommon.EventType.ModelChanged, function () {
                if (!_this.modelRevealing) {
                    _this.clear();
                }
            }));
            this.widget = new widget.ReferenceWidget(this.editorService, this.keybindingService, this.contextService, this.instantiationService, this.editor);
            this.widget.setTitle(nls.localize('labelLoading', "Loading..."));
            this.widget.show(range, 18);
            this.callOnClear.push(this.widget.addListener(peekView.Events.Closed, function () {
                _this.widget = null;
                _this.clear();
            }));
            this.callOnClear.push(this.widget.addListener(widget.ReferenceWidget.Events.EditorDoubleClick, function (event) {
                if (!event.reference) {
                    return;
                }
                // open editor
                _this.editorService.openEditor({
                    resource: event.reference,
                    options: { selection: event.range }
                }, event.originalEvent.ctrlKey || event.originalEvent.metaKey).done(null, errors.onUnexpectedError);
                // close zone
                if (!(event.originalEvent.ctrlKey || event.originalEvent.metaKey)) {
                    _this.clear();
                }
            }));
            var requestId = ++this.requestIdPool, editorModel = this.editor.getModel();
            var timer = this.telemetryService.start('findReferences', {
                mode: editorModel.getMode().getId()
            });
            referencesPromise.then(function (references) {
                // still current request?
                if (requestId !== _this.requestIdPool) {
                    timer.stop();
                    return;
                }
                // has a result
                if (arrays_1.isFalsyOrEmpty(references)) {
                    _this.widget.showMessage(nls.localize('noResults', "No results"));
                    timer.stop();
                    return;
                }
                // create result model
                _this.model = new model.Model(references, _this.editorService);
                _this.model.currentReference = _this.model.findReference(editorModel.getAssociatedResource(), range.getStartPosition());
                var unbind = _this.model.addListener(model.EventType.CurrentReferenceChanged, function () {
                    _this.modelRevealing = true;
                    _this.editorService.openEditor({
                        resource: _this.model.currentReference.resource,
                        options: { selection: _this.model.currentReference.range }
                    }).done(function (openedEditor) {
                        if (!openedEditor || openedEditor.getControl() !== _this.editor) {
                            // TODO@Alex TODO@Joh
                            // when opening the current reference we might end up
                            // in a different editor instance. that means we also have
                            // a different instance of this reference search controller
                            // and cannot hold onto the widget (which likely doesn't
                            // exist). Instead of bailing out we should find the
                            // 'sister' action and pass our current model on to it.
                            _this.clear();
                            return;
                        }
                        _this.modelRevealing = false;
                        _this.widget.show(_this.model.currentReference.range, 18);
                        _this.widget.focus();
                    }, function (err) {
                        _this.modelRevealing = false;
                        errors.onUnexpectedError(err);
                    });
                });
                _this.callOnClear.push(unbind);
                // show widget
                _this._startTime = Date.now();
                if (_this.widget) {
                    _this.widget.setModel(_this.model);
                }
                timer.stop();
            }, function (error) {
                _this.messageService.show(severity_1.default.Error, error);
                timer.stop();
            });
            return this.widget;
        };
        FindReferencesController.prototype.clear = function () {
            if (this._startTime !== -1) {
                this.telemetryService.publicLog('zoneWidgetShown', {
                    mode: 'reference search',
                    elapsedTime: Date.now() - this._startTime
                });
                this._startTime = -1;
            }
            this._referenceSearchVisible.reset();
            lifecycle.cAll(this.callOnClear);
            this.model = null;
            var result = false;
            if (this.widget) {
                this.widget.dispose();
                this.widget = null;
                result = true;
            }
            this.editor.focus();
            this.requestIdPool += 1; // Cancel pending requests
            return result;
        };
        FindReferencesController.ID = 'editor.contrib.findReferencesController';
        FindReferencesController = __decorate([
            __param(1, editor_1.IEditorService),
            __param(2, telemetry_1.ITelemetryService),
            __param(3, message_1.IMessageService),
            __param(4, instantiation_1.IInstantiationService),
            __param(5, IPeekViewService),
            __param(6, workspace_1.IWorkspaceContextService),
            __param(7, keybindingService_1.IKeybindingService)
        ], FindReferencesController);
        return FindReferencesController;
    })();
    exports.FindReferencesController = FindReferencesController;
    var ReferenceAction = (function (_super) {
        __extends(ReferenceAction, _super);
        // state - changes with every invocation
        function ReferenceAction(descriptor, editor, peekViewService, keybindingService) {
            _super.call(this, descriptor, editor, editorAction_1.Behaviour.WidgetFocus | editorAction_1.Behaviour.ShowInContextMenu | editorAction_1.Behaviour.UpdateOnCursorPositionChange);
            this.label = nls.localize('references.action.label', "Find All References");
            this.peekViewService = peekViewService;
            if (this.peekViewService) {
                keybindingService.createKey(this.peekViewService.contextKey, true);
            }
        }
        ReferenceAction.prototype.getGroupId = function () {
            return '1_goto/4_references';
        };
        ReferenceAction.prototype.isSupported = function () {
            return referenceSearch_1.ReferenceRegistry.has(this.editor.getModel()) && _super.prototype.isSupported.call(this);
        };
        ReferenceAction.prototype.getEnablementState = function () {
            if (this.peekViewService && this.peekViewService.isActive) {
                return false;
            }
            var model = this.editor.getModel();
            var position = this.editor.getSelection().getStartPosition();
            var context = model.getLineContext(position.lineNumber);
            var offset = position.column - 1;
            return referenceSearch_1.ReferenceRegistry.all(model).some(function (support) {
                return support.canFindReferences(context, offset);
            });
        };
        ReferenceAction.prototype.run = function () {
            var range = this.editor.getSelection();
            var model = this.editor.getModel();
            var request = referenceSearch_1.findReferences(model, range.getStartPosition());
            var controller = FindReferencesController.getController(this.editor);
            return winjs_base_1.TPromise.as(controller.processRequest(range, request)).then(function () { return true; });
        };
        ReferenceAction.ID = 'editor.action.referenceSearch.trigger';
        ReferenceAction = __decorate([
            __param(2, IPeekViewService),
            __param(3, keybindingService_1.IKeybindingService)
        ], ReferenceAction);
        return ReferenceAction;
    })(editorAction_1.EditorAction);
    exports.ReferenceAction = ReferenceAction;
    var findReferencesCommand = function (accessor, args) {
        var resource = args[0];
        var position = args[1];
        if (!(resource instanceof uri_1.default)) {
            throw new Error('illegal argument, uri');
        }
        if (!position) {
            throw new Error('illega argument, position');
        }
        return accessor.get(editor_1.IEditorService).openEditor({ resource: resource }).then(function (editor) {
            var control = editor.getControl();
            if (!control || typeof control.getEditorType !== 'function') {
                return;
            }
            var request = referenceSearch_1.findReferences(control.getModel(), position);
            var controller = FindReferencesController.getController(control);
            var range = new range_1.Range(position.lineNumber, position.column, position.lineNumber, position.column);
            return winjs_base_1.TPromise.as(controller.processRequest(range, request));
        });
    };
    var showReferencesCommand = function (accessor, args) {
        if (!(args[0] instanceof uri_1.default)) {
            throw new Error('illegal argument, uri expected');
        }
        return accessor.get(editor_1.IEditorService).openEditor({ resource: args[0] }).then(function (editor) {
            var control = editor.getControl();
            if (!control || typeof control.getEditorType !== 'function') {
                return;
            }
            var controller = FindReferencesController.getController(control);
            var range = position_1.Position.asEmptyRange(args[1]);
            return winjs_base_1.TPromise.as(controller.processRequest(range_1.Range.lift(range), winjs_base_1.TPromise.as(args[2]))).then(function () { return true; });
        });
    };
    var CONTEXT_REFERENCE_SEARCH_VISIBLE = 'referenceSearchVisible';
    // register action
    editorBrowserExtensions_1.EditorBrowserRegistry.registerEditorContribution(FindReferencesController);
    editorCommonExtensions_1.CommonEditorRegistry.registerEditorAction(new editorCommonExtensions_1.EditorActionDescriptor(ReferenceAction, ReferenceAction.ID, nls.localize('references.action.name', "Show References"), {
        context: editorCommonExtensions_1.ContextKey.EditorTextFocus,
        primary: keyCodes_1.KeyMod.Shift | keyCodes_1.KeyCode.F12
    }));
    keybindingsRegistry_1.KeybindingsRegistry.registerCommandDesc({
        id: 'editor.action.findReferences',
        handler: findReferencesCommand,
        weight: editorCommonExtensions_1.CommonEditorRegistry.commandWeight(50),
        context: null,
        primary: undefined
    });
    keybindingsRegistry_1.KeybindingsRegistry.registerCommandDesc({
        id: 'editor.action.showReferences',
        handler: showReferencesCommand,
        weight: editorCommonExtensions_1.CommonEditorRegistry.commandWeight(50),
        context: null,
        primary: undefined,
        description: {
            description: 'Show references at a position in a file',
            args: [
                { name: 'uri', description: 'The text document in which to show references', constraint: uri_1.default },
                { name: 'position', description: 'The position at which to show', constraint: position_1.Position.isIPosition },
                { name: 'locations', description: 'An array of locations.', constraint: Array },
            ]
        }
    });
    editorCommonExtensions_1.CommonEditorRegistry.registerEditorCommand('closeReferenceSearch', editorCommonExtensions_1.CommonEditorRegistry.commandWeight(50), { primary: keyCodes_1.KeyCode.Escape }, false, CONTEXT_REFERENCE_SEARCH_VISIBLE, function (accessor, editor, args) {
        var outerEditor = peekView.getOuterEditor(accessor, args);
        if (outerEditor) {
            var controller = FindReferencesController.getController(outerEditor);
            controller.closeReferenceSearch();
        }
    });
    editorCommonExtensions_1.CommonEditorRegistry.registerEditorCommand('closeReferenceSearchEditor', editorCommonExtensions_1.CommonEditorRegistry.commandWeight(-101), { primary: keyCodes_1.KeyCode.Escape }, false, widget.ReferenceWidget.INNER_EDITOR_CONTEXT_KEY, function (accessor, editor, args) {
        var outerEditor = peekView.getOuterEditor(accessor, args);
        if (outerEditor) {
            var controller = FindReferencesController.getController(outerEditor);
            controller.closeReferenceSearch();
        }
    });
});
//# sourceMappingURL=referenceSearch.js.map