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
define(["require", "exports", 'vs/nls', 'vs/base/common/severity', 'vs/base/common/platform', 'vs/base/browser/browser', 'vs/base/common/async', 'vs/base/common/strings', 'vs/base/common/errors', 'vs/base/common/arrays', 'vs/base/common/winjs.base', 'vs/editor/browser/editorBrowserExtensions', 'vs/editor/common/editorCommonExtensions', 'vs/editor/common/editorAction', 'vs/editor/common/editorCommon', 'vs/editor/common/modes/textToHtmlTokenizer', 'vs/editor/common/core/range', 'vs/base/common/keyCodes', 'vs/platform/request/common/request', 'vs/platform/message/common/message', 'vs/platform/telemetry/common/telemetry', 'vs/platform/editor/common/editor', 'vs/editor/contrib/referenceSearch/browser/referenceSearch', 'vs/editor/contrib/goToDeclaration/common/goToDeclaration', 'vs/css!./goToDeclaration'], function (require, exports, nls, severity_1, Platform, Browser, Async, Strings, Errors, arrays_1, winjs_base_1, editorBrowserExtensions_1, editorCommonExtensions_1, editorAction_1, EditorCommon, textToHtmlTokenizer_1, range_1, keyCodes_1, request_1, message_1, telemetry_1, editor_1, referenceSearch_1, goToDeclaration_1) {
    var GoToTypeAction = (function (_super) {
        __extends(GoToTypeAction, _super);
        function GoToTypeAction(descriptor, editor, messageService, telemetryService, editorService) {
            _super.call(this, descriptor, editor, editorAction_1.Behaviour.WidgetFocus | editorAction_1.Behaviour.ShowInContextMenu | editorAction_1.Behaviour.UpdateOnCursorPositionChange);
            this._messageService = messageService;
            this._editorService = editorService;
        }
        GoToTypeAction.prototype.run = function () {
            var _this = this;
            var model = this.editor.getModel();
            var position = this.editor.getPosition();
            var promise = this._resolve(model.getAssociatedResource(), { lineNumber: position.lineNumber, column: position.column });
            return promise.then(function (references) {
                // remove falsy entries
                references = arrays_1.coalesce(references);
                if (!references || references.length === 0) {
                    return;
                }
                // only use the start position
                references = references.map(function (reference) {
                    return {
                        resource: reference.resource,
                        range: range_1.Range.collapseToStart(reference.range)
                    };
                });
                // open and reveal
                if (references.length === 1 && !_this._showSingleReferenceInPeek()) {
                    return _this._editorService.openEditor({
                        resource: references[0].resource,
                        options: { selection: references[0].range }
                    });
                }
                else {
                    var controller = referenceSearch_1.FindReferencesController.getController(_this.editor);
                    return controller.processRequest(_this.editor.getSelection(), winjs_base_1.TPromise.as(references));
                }
            }, function (err) {
                // report an error
                _this._messageService.show(severity_1.default.Error, err);
                return false;
            });
        };
        GoToTypeAction.prototype._showSingleReferenceInPeek = function () {
            return false;
        };
        return GoToTypeAction;
    })(editorAction_1.EditorAction);
    exports.GoToTypeAction = GoToTypeAction;
    var GoToTypeDeclarationActions = (function (_super) {
        __extends(GoToTypeDeclarationActions, _super);
        function GoToTypeDeclarationActions(descriptor, editor, messageService, telemetryService, editorService) {
            _super.call(this, descriptor, editor, messageService, telemetryService, editorService);
        }
        GoToTypeDeclarationActions.prototype.getGroupId = function () {
            return '1_goto/3_visitTypeDefinition';
        };
        GoToTypeDeclarationActions.prototype.isSupported = function () {
            return !!this.editor.getModel().getMode().typeDeclarationSupport && _super.prototype.isSupported.call(this);
        };
        GoToTypeDeclarationActions.prototype.getEnablementState = function () {
            if (!_super.prototype.getEnablementState.call(this)) {
                return false;
            }
            var model = this.editor.getModel(), position = this.editor.getSelection().getStartPosition();
            return model.getMode().typeDeclarationSupport.canFindTypeDeclaration(model.getLineContext(position.lineNumber), position.column - 1);
        };
        GoToTypeDeclarationActions.prototype._resolve = function (resource, position) {
            var typeDeclarationSupport = this.editor.getModel().getMode().typeDeclarationSupport;
            if (typeDeclarationSupport) {
                return typeDeclarationSupport.findTypeDeclaration(resource, position).then(function (value) { return [value]; });
            }
        };
        GoToTypeDeclarationActions.ID = 'editor.action.goToTypeDeclaration';
        GoToTypeDeclarationActions = __decorate([
            __param(2, message_1.IMessageService),
            __param(3, telemetry_1.ITelemetryService),
            __param(4, editor_1.IEditorService)
        ], GoToTypeDeclarationActions);
        return GoToTypeDeclarationActions;
    })(GoToTypeAction);
    exports.GoToTypeDeclarationActions = GoToTypeDeclarationActions;
    var GoToDeclarationAction = (function (_super) {
        __extends(GoToDeclarationAction, _super);
        function GoToDeclarationAction(descriptor, editor, messageService, telemetryService, editorService) {
            _super.call(this, descriptor, editor, messageService, telemetryService, editorService);
        }
        GoToDeclarationAction.prototype.getGroupId = function () {
            return '1_goto/2_visitDefinition';
        };
        GoToDeclarationAction.prototype.isSupported = function () {
            return goToDeclaration_1.DeclarationRegistry.has(this.editor.getModel()) && _super.prototype.isSupported.call(this);
        };
        GoToDeclarationAction.prototype.getEnablementState = function () {
            if (!_super.prototype.getEnablementState.call(this)) {
                return false;
            }
            var model = this.editor.getModel(), position = this.editor.getSelection().getStartPosition();
            return goToDeclaration_1.DeclarationRegistry.all(model).some(function (provider) {
                return provider.canFindDeclaration(model.getLineContext(position.lineNumber), position.column - 1);
            });
        };
        GoToDeclarationAction.prototype._resolve = function (resource, position) {
            return goToDeclaration_1.getDeclarationsAtPosition(this.editor.getModel(), this.editor.getPosition());
        };
        GoToDeclarationAction.ID = 'editor.action.goToDeclaration';
        GoToDeclarationAction = __decorate([
            __param(2, message_1.IMessageService),
            __param(3, telemetry_1.ITelemetryService),
            __param(4, editor_1.IEditorService)
        ], GoToDeclarationAction);
        return GoToDeclarationAction;
    })(GoToTypeAction);
    exports.GoToDeclarationAction = GoToDeclarationAction;
    var PreviewDeclarationAction = (function (_super) {
        __extends(PreviewDeclarationAction, _super);
        function PreviewDeclarationAction(descriptor, editor, messageService, telemetryService, editorService) {
            _super.call(this, descriptor, editor, messageService, telemetryService, editorService);
        }
        PreviewDeclarationAction.prototype._showSingleReferenceInPeek = function () {
            return true;
        };
        PreviewDeclarationAction.ID = 'editor.action.previewDeclaration';
        PreviewDeclarationAction = __decorate([
            __param(2, message_1.IMessageService),
            __param(3, telemetry_1.ITelemetryService),
            __param(4, editor_1.IEditorService)
        ], PreviewDeclarationAction);
        return PreviewDeclarationAction;
    })(GoToDeclarationAction);
    exports.PreviewDeclarationAction = PreviewDeclarationAction;
    // --- Editor Contribution to goto definition using the mouse and a modifier key
    var GotoDefinitionWithMouseEditorContribution = (function () {
        function GotoDefinitionWithMouseEditorContribution(editor, requestService, messageService, editorService) {
            var _this = this;
            this.editorService = editorService;
            this.requestService = requestService;
            this.messageService = messageService;
            this.hasRequiredServices = !!this.messageService && !!this.requestService && !!this.editorService;
            this.toUnhook = [];
            this.decorations = [];
            this.editor = editor;
            this.throttler = new Async.Throttler();
            this.toUnhook.push(this.editor.addListener(EditorCommon.EventType.MouseDown, function (e) { return _this.onEditorMouseDown(e); }));
            this.toUnhook.push(this.editor.addListener(EditorCommon.EventType.MouseUp, function (e) { return _this.onEditorMouseUp(e); }));
            this.toUnhook.push(this.editor.addListener(EditorCommon.EventType.MouseMove, function (e) { return _this.onEditorMouseMove(e); }));
            this.toUnhook.push(this.editor.addListener(EditorCommon.EventType.KeyDown, function (e) { return _this.onEditorKeyDown(e); }));
            this.toUnhook.push(this.editor.addListener(EditorCommon.EventType.KeyUp, function (e) { return _this.onEditorKeyUp(e); }));
            this.toUnhook.push(this.editor.addListener(EditorCommon.EventType.ModelChanged, function (e) { return _this.resetHandler(); }));
            this.toUnhook.push(this.editor.addListener('change', function (e) { return _this.resetHandler(); }));
            this.toUnhook.push(this.editor.addListener('scroll', function () { return _this.resetHandler(); }));
        }
        GotoDefinitionWithMouseEditorContribution.prototype.onEditorMouseMove = function (mouseEvent, withKey) {
            this.lastMouseMoveEvent = mouseEvent;
            this.startFindDefinition(mouseEvent, withKey);
        };
        GotoDefinitionWithMouseEditorContribution.prototype.startFindDefinition = function (mouseEvent, withKey) {
            var _this = this;
            if (!this.isEnabled(mouseEvent, withKey)) {
                this.currentWordUnderMouse = null;
                this.removeDecorations();
                return;
            }
            // Find word at mouse position
            var position = mouseEvent.target.position;
            var word = position ? this.editor.getModel().getWordAtPosition(position) : null;
            if (!word) {
                this.currentWordUnderMouse = null;
                this.removeDecorations();
                return;
            }
            // Return early if word at position is still the same
            if (this.currentWordUnderMouse && this.currentWordUnderMouse.startColumn === word.startColumn && this.currentWordUnderMouse.endColumn === word.endColumn && this.currentWordUnderMouse.word === word.word) {
                return;
            }
            this.currentWordUnderMouse = word;
            // Find definition and decorate word if found
            var state = this.editor.captureState(EditorCommon.CodeEditorStateFlag.Position, EditorCommon.CodeEditorStateFlag.Value, EditorCommon.CodeEditorStateFlag.Selection, EditorCommon.CodeEditorStateFlag.Scroll);
            this.throttler.queue(function () {
                return state.validate(_this.editor)
                    ? _this.findDefinition(mouseEvent.target)
                    : winjs_base_1.TPromise.as(null);
            }).then(function (results) {
                if (!results || !results.length || !state.validate(_this.editor)) {
                    _this.removeDecorations();
                    return;
                }
                // Multiple results
                if (results.length > 1) {
                    _this.addDecoration({
                        startLineNumber: position.lineNumber,
                        startColumn: word.startColumn,
                        endLineNumber: position.lineNumber,
                        endColumn: word.endColumn
                    }, nls.localize('multipleResults', "Click to show the {0} definitions found.", results.length), false);
                }
                else {
                    var result = results[0];
                    _this.editorService.resolveEditorModel({ resource: result.resource }).then(function (model) {
                        var source;
                        if (model && model.textEditorModel) {
                            var from = Math.max(1, result.range.startLineNumber), to, editorModel;
                            editorModel = model.textEditorModel;
                            // if we have a range, take that into consideration for the "to" position, otherwise fallback to MAX_SOURCE_PREVIEW_LINES
                            if (result.range.startLineNumber !== result.range.endLineNumber || result.range.startColumn !== result.range.endColumn) {
                                to = Math.min(result.range.endLineNumber, result.range.startLineNumber + GotoDefinitionWithMouseEditorContribution.MAX_SOURCE_PREVIEW_LINES, editorModel.getLineCount());
                            }
                            else {
                                to = Math.min(from + GotoDefinitionWithMouseEditorContribution.MAX_SOURCE_PREVIEW_LINES, editorModel.getLineCount());
                            }
                            source = editorModel.getValueInRange({
                                startLineNumber: from,
                                startColumn: 1,
                                endLineNumber: to,
                                endColumn: editorModel.getLineMaxColumn(to)
                            }).trim();
                            // remove common leading whitespace
                            var min = Number.MAX_VALUE, regexp = /^[ \t]*/, match, contents;
                            while (from <= to && min > 0) {
                                contents = editorModel.getLineContent(from++);
                                if (contents.trim().length === 0) {
                                    // empty or whitespace only
                                    continue;
                                }
                                match = regexp.exec(contents);
                                min = Math.min(min, match[0].length);
                            }
                            source = source.replace(new RegExp("^([ \\t]{" + min + "})", 'gm'), Strings.empty);
                            if (result.range.endLineNumber - result.range.startLineNumber > GotoDefinitionWithMouseEditorContribution.MAX_SOURCE_PREVIEW_LINES) {
                                source += '\n\u2026';
                            }
                        }
                        _this.addDecoration({
                            startLineNumber: position.lineNumber,
                            startColumn: word.startColumn,
                            endLineNumber: position.lineNumber,
                            endColumn: word.endColumn
                        }, source, true);
                    });
                }
            }).done(undefined, Errors.onUnexpectedError);
        };
        GotoDefinitionWithMouseEditorContribution.prototype.addDecoration = function (range, text, isCode) {
            var model = this.editor.getModel();
            if (!model) {
                return;
            }
            var htmlMessage = {
                tagName: 'div',
                className: 'goto-definition-link-hover',
                style: "tab-size: " + this.editor.getIndentationOptions().tabSize
            };
            if (text && text.trim().length > 0) {
                // not whitespace only
                htmlMessage.children = [isCode ? textToHtmlTokenizer_1.tokenizeToHtmlContent(text, model.getMode()) : { tagName: 'span', text: text }];
            }
            var newDecorations = {
                range: range,
                options: {
                    inlineClassName: 'goto-definition-link',
                    htmlMessage: [htmlMessage]
                }
            };
            this.decorations = this.editor.deltaDecorations(this.decorations, [newDecorations]);
        };
        GotoDefinitionWithMouseEditorContribution.prototype.removeDecorations = function () {
            if (this.decorations.length > 0) {
                this.decorations = this.editor.deltaDecorations(this.decorations, []);
            }
        };
        GotoDefinitionWithMouseEditorContribution.prototype.onEditorKeyDown = function (e) {
            if (e.keyCode === GotoDefinitionWithMouseEditorContribution.TRIGGER_KEY_VALUE && this.lastMouseMoveEvent) {
                this.startFindDefinition(this.lastMouseMoveEvent, e);
            }
            else if (e[GotoDefinitionWithMouseEditorContribution.TRIGGER_MODIFIER]) {
                this.removeDecorations(); // remove decorations if user holds another key with ctrl/cmd to prevent accident goto declaration
            }
        };
        GotoDefinitionWithMouseEditorContribution.prototype.resetHandler = function () {
            this.lastMouseMoveEvent = null;
            this.removeDecorations();
        };
        GotoDefinitionWithMouseEditorContribution.prototype.onEditorMouseDown = function (mouseEvent) {
            // We need to record if we had the trigger key on mouse down because someone might select something in the editor
            // holding the mouse down and then while mouse is down start to press Ctrl/Cmd to start a copy operation and then
            // release the mouse button without wanting to do the navigation.
            // With this flag we prevent goto definition if the mouse was down before the trigger key was pressed.
            this.hasTriggerKeyOnMouseDown = !!mouseEvent.event[GotoDefinitionWithMouseEditorContribution.TRIGGER_MODIFIER];
        };
        GotoDefinitionWithMouseEditorContribution.prototype.onEditorMouseUp = function (mouseEvent) {
            var _this = this;
            if (this.isEnabled(mouseEvent) && this.hasTriggerKeyOnMouseDown) {
                this.gotoDefinition(mouseEvent.target, mouseEvent.event.altKey).done(function () {
                    _this.removeDecorations();
                }, function (error) {
                    _this.removeDecorations();
                    Errors.onUnexpectedError(error);
                });
            }
        };
        GotoDefinitionWithMouseEditorContribution.prototype.onEditorKeyUp = function (e) {
            if (e.keyCode === GotoDefinitionWithMouseEditorContribution.TRIGGER_KEY_VALUE) {
                this.removeDecorations();
                this.currentWordUnderMouse = null;
            }
        };
        GotoDefinitionWithMouseEditorContribution.prototype.isEnabled = function (mouseEvent, withKey) {
            return this.hasRequiredServices &&
                this.editor.getModel() &&
                (Browser.isIE11orEarlier || mouseEvent.event.detail <= 1) &&
                mouseEvent.target.type === EditorCommon.MouseTargetType.CONTENT_TEXT &&
                (mouseEvent.event[GotoDefinitionWithMouseEditorContribution.TRIGGER_MODIFIER] || (withKey && withKey.keyCode === GotoDefinitionWithMouseEditorContribution.TRIGGER_KEY_VALUE)) &&
                goToDeclaration_1.DeclarationRegistry.has(this.editor.getModel());
        };
        GotoDefinitionWithMouseEditorContribution.prototype.findDefinition = function (target) {
            var model = this.editor.getModel();
            if (!model) {
                return winjs_base_1.TPromise.as(null);
            }
            return goToDeclaration_1.getDeclarationsAtPosition(this.editor.getModel(), target.position);
        };
        GotoDefinitionWithMouseEditorContribution.prototype.gotoDefinition = function (target, sideBySide) {
            var _this = this;
            var state = this.editor.captureState(EditorCommon.CodeEditorStateFlag.Position, EditorCommon.CodeEditorStateFlag.Value, EditorCommon.CodeEditorStateFlag.Selection, EditorCommon.CodeEditorStateFlag.Scroll);
            return this.findDefinition(target).then(function (results) {
                if (!results || !results.length || !state.validate(_this.editor)) {
                    return;
                }
                var position = target.position;
                var word = _this.editor.getModel().getWordAtPosition(position);
                // Find valid target (and not the same position as the current hovered word)
                var validResults = results
                    .filter(function (result) { return result.range && !(word && result.range.startColumn === word.startColumn && result.range.startLineNumber === target.position.lineNumber); })
                    .map(function (result) {
                    return {
                        resource: result.resource,
                        range: range_1.Range.collapseToStart(result.range)
                    };
                });
                if (!validResults.length) {
                    return;
                }
                // Muli result: Show in references UI
                if (validResults.length > 1) {
                    var controller = referenceSearch_1.FindReferencesController.getController(_this.editor);
                    return controller.processRequest(_this.editor.getSelection(), winjs_base_1.TPromise.as(validResults));
                }
                // Single result: Open
                return _this.editorService.openEditor({
                    resource: validResults[0].resource,
                    options: {
                        selection: validResults[0].range
                    }
                }, sideBySide);
            });
        };
        GotoDefinitionWithMouseEditorContribution.prototype.getId = function () {
            return GotoDefinitionWithMouseEditorContribution.ID;
        };
        GotoDefinitionWithMouseEditorContribution.prototype.dispose = function () {
            while (this.toUnhook.length > 0) {
                this.toUnhook.pop()();
            }
        };
        GotoDefinitionWithMouseEditorContribution.ID = 'editor.contrib.gotodefinitionwithmouse';
        GotoDefinitionWithMouseEditorContribution.TRIGGER_MODIFIER = Platform.isMacintosh ? 'metaKey' : 'ctrlKey';
        GotoDefinitionWithMouseEditorContribution.TRIGGER_KEY_VALUE = Platform.isMacintosh ? keyCodes_1.KeyCode.Meta : keyCodes_1.KeyCode.Ctrl;
        GotoDefinitionWithMouseEditorContribution.MAX_SOURCE_PREVIEW_LINES = 7;
        GotoDefinitionWithMouseEditorContribution = __decorate([
            __param(1, request_1.IRequestService),
            __param(2, message_1.IMessageService),
            __param(3, editor_1.IEditorService)
        ], GotoDefinitionWithMouseEditorContribution);
        return GotoDefinitionWithMouseEditorContribution;
    })();
    // register actions
    editorCommonExtensions_1.CommonEditorRegistry.registerEditorAction(new editorCommonExtensions_1.EditorActionDescriptor(PreviewDeclarationAction, PreviewDeclarationAction.ID, nls.localize('actions.previewDecl.label', "Peek Definition"), {
        context: editorCommonExtensions_1.ContextKey.EditorTextFocus,
        primary: keyCodes_1.KeyMod.Alt | keyCodes_1.KeyCode.F12,
        linux: { primary: keyCodes_1.KeyMod.CtrlCmd | keyCodes_1.KeyMod.Shift | keyCodes_1.KeyCode.F10 },
    }));
    var goToDeclarationKb;
    if (Platform.isWeb) {
        goToDeclarationKb = keyCodes_1.KeyMod.CtrlCmd | keyCodes_1.KeyCode.F12;
    }
    else {
        goToDeclarationKb = keyCodes_1.KeyCode.F12;
    }
    editorCommonExtensions_1.CommonEditorRegistry.registerEditorAction(new editorCommonExtensions_1.EditorActionDescriptor(GoToDeclarationAction, GoToDeclarationAction.ID, nls.localize('actions.goToDecl.label', "Go to Definition"), {
        context: editorCommonExtensions_1.ContextKey.EditorTextFocus,
        primary: goToDeclarationKb
    }));
    editorCommonExtensions_1.CommonEditorRegistry.registerEditorAction(new editorCommonExtensions_1.EditorActionDescriptor(GoToTypeDeclarationActions, GoToTypeDeclarationActions.ID, nls.localize('actions.gotoTypeDecl.label', "Go to Type Definition")));
    editorBrowserExtensions_1.EditorBrowserRegistry.registerEditorContribution(GotoDefinitionWithMouseEditorContribution);
});
//# sourceMappingURL=goToDeclaration.js.map