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
define(["require", "exports", 'vs/nls', 'vs/base/common/winjs.base', 'vs/base/browser/dom', 'vs/base/common/objects', 'vs/base/common/bits/encoding', 'vs/base/common/strings', 'vs/base/common/types', 'vs/base/common/errors', 'vs/base/common/actions', 'vs/editor/common/modes/modesRegistry', 'vs/platform/platform', 'vs/workbench/common/editor/untitledEditorInput', 'vs/workbench/common/editor', 'vs/base/common/lifecycle', 'vs/editor/common/editorCommon', 'vs/workbench/common/events', 'vs/workbench/browser/parts/editor/textEditor', 'vs/workbench/services/editor/common/editorService', 'vs/workbench/services/quickopen/common/quickOpenService', 'vs/platform/configuration/common/configuration', 'vs/platform/event/common/event', 'vs/platform/instantiation/common/instantiation', 'vs/editor/common/services/modeService', 'vs/css!./media/editorstatus'], function (require, exports, nls, winjs_base_1, dom_1, objects, encoding, strings, types, errors, actions_1, modesRegistry_1, platform_1, untitledEditorInput_1, editor_1, lifecycle_1, editorCommon_1, events_1, textEditor_1, editorService_1, quickOpenService_1, configuration_1, event_1, instantiation_1, modeService_1) {
    function getTextModel(editorWidget) {
        var textModel;
        // Support for diff
        var model = editorWidget.getModel();
        if (model && !!model.modified) {
            textModel = model.modified;
        }
        else {
            textModel = model;
        }
        return textModel;
    }
    function asFileOrUntitledEditorInput(input) {
        if (input instanceof untitledEditorInput_1.UntitledEditorInput) {
            return input;
        }
        return editor_1.asFileEditorInput(input, true /* support diff editor */);
    }
    var nlsSingleSelectionRange = nls.localize('singleSelectionRange', "Ln {0}, Col {1} ({2} selected)");
    var nlsSingleSelection = nls.localize('singleSelection', "Ln {0}, Col {1}");
    var nlsMultiSelectionRange = nls.localize('multiSelectionRange', "{0} selections ({1} characters selected)");
    var nlsMultiSelection = nls.localize('multiSelection', "{0} selections");
    var nlsEOLLF = nls.localize('endOfLineLineFeed', "LF");
    var nlsEOLCRLF = nls.localize('endOfLineCarriageReturnLineFeed', "CRLF");
    var nlsTabFocusMode = nls.localize('tabFocusModeEnabled', "Accessibility Mode On");
    var EditorStatus = (function () {
        function EditorStatus(editorService, quickOpenService, instantiationService, eventService) {
            this.editorService = editorService;
            this.quickOpenService = quickOpenService;
            this.instantiationService = instantiationService;
            this.eventService = eventService;
            this.toDispose = [];
            this.state = {
                selectionStatus: null,
                mode: null,
                encoding: null,
                EOL: null,
                tabFocusMode: false,
            };
        }
        EditorStatus.prototype.render = function (container) {
            var _this = this;
            this.element = dom_1.append(container, dom_1.emmet('.editor-statusbar-item'));
            this.tabFocusModeElement = dom_1.append(this.element, dom_1.emmet('a.editor-status-tabfocusmode'));
            this.tabFocusModeElement.title = nls.localize('disableTabMode', "Disable Accessibility Mode");
            this.tabFocusModeElement.onclick = function () { return _this.onTabFocusModeClick(); };
            this.tabFocusModeElement.textContent = nlsTabFocusMode;
            this.selectionElement = dom_1.append(this.element, dom_1.emmet('a.editor-status-selection'));
            this.selectionElement.title = nls.localize('gotoLine', "Go to Line");
            this.selectionElement.onclick = function () { return _this.onSelectionClick(); };
            this.encodingElement = dom_1.append(this.element, dom_1.emmet('a.editor-status-encoding'));
            this.encodingElement.title = nls.localize('selectEncoding', "Select Encoding");
            this.encodingElement.onclick = function () { return _this.onEncodingClick(); };
            this.eolElement = dom_1.append(this.element, dom_1.emmet('a.editor-status-eol'));
            this.eolElement.title = nls.localize('selectEOL', "Select End of Line Sequence");
            this.eolElement.onclick = function () { return _this.onEOLClick(); };
            this.modeElement = dom_1.append(this.element, dom_1.emmet('a.editor-status-mode'));
            this.modeElement.title = nls.localize('selectLanguageMode', "Select Language Mode");
            this.modeElement.onclick = function () { return _this.onModeClick(); };
            this.setState(this.state);
            this.toDispose.push(this.eventService.addListener2(events_1.EventType.EDITOR_INPUT_CHANGED, function (e) { return _this.onEditorInputChange(e.editor); }), this.eventService.addListener2(events_1.EventType.RESOURCE_ENCODING_CHANGED, function (e) { return _this.onResourceEncodingChange(e.resource); }), this.eventService.addListener2(events_1.EventType.TEXT_EDITOR_SELECTION_CHANGED, function (e) { return _this.onSelectionChange(e.editor); }), this.eventService.addListener2(events_1.EventType.TEXT_EDITOR_MODE_CHANGED, function (e) { return _this.onModeChange(e.editor); }), this.eventService.addListener2(events_1.EventType.TEXT_EDITOR_CONTENT_CHANGED, function (e) { return _this.onEOLChange(e.editor); }), this.eventService.addListener2(events_1.EventType.TEXT_EDITOR_CONFIGURATION_CHANGED, function (e) { return _this.onTabFocusModeChange(e.editor); }));
            return lifecycle_1.combinedDispose.apply(void 0, this.toDispose);
        };
        EditorStatus.prototype.setState = function (state) {
            this.state = state;
            if (state.tabFocusMode && state.tabFocusMode === true) {
                dom_1.show(this.tabFocusModeElement);
            }
            else {
                dom_1.hide(this.tabFocusModeElement);
            }
            var selectionLabel = this.getSelectionLabel();
            if (selectionLabel) {
                this.selectionElement.textContent = selectionLabel;
                dom_1.show(this.selectionElement);
            }
            else {
                dom_1.hide(this.selectionElement);
            }
            if (state.encoding) {
                this.encodingElement.textContent = state.encoding;
                dom_1.show(this.encodingElement);
            }
            else {
                dom_1.hide(this.encodingElement);
            }
            if (state.EOL) {
                this.eolElement.textContent = state.EOL === '\r\n' ? nlsEOLCRLF : nlsEOLLF;
                dom_1.show(this.eolElement);
            }
            else {
                dom_1.hide(this.eolElement);
            }
            if (state.mode) {
                this.modeElement.textContent = state.mode;
                dom_1.show(this.modeElement);
            }
            else {
                dom_1.hide(this.modeElement);
            }
        };
        EditorStatus.prototype.updateState = function (update) {
            this.setState(objects.assign({}, this.state, update));
        };
        EditorStatus.prototype.getSelectionLabel = function () {
            var info = this.state.selectionStatus;
            if (!info || !info.selections) {
                return null;
            }
            if (info.selections.length === 1) {
                if (info.charactersSelected) {
                    return strings.format(nlsSingleSelectionRange, info.selections[0].positionLineNumber, info.selections[0].positionColumn, info.charactersSelected);
                }
                else {
                    return strings.format(nlsSingleSelection, info.selections[0].positionLineNumber, info.selections[0].positionColumn);
                }
            }
            else {
                if (info.charactersSelected) {
                    return strings.format(nlsMultiSelectionRange, info.selections.length, info.charactersSelected);
                }
                else {
                    return strings.format(nlsMultiSelection, info.selections.length);
                }
            }
        };
        EditorStatus.prototype.onModeClick = function () {
            var action = this.instantiationService.createInstance(ChangeModeAction, ChangeModeAction.ID, ChangeModeAction.LABEL);
            action.run().done(null, errors.onUnexpectedError);
            action.dispose();
        };
        EditorStatus.prototype.onSelectionClick = function () {
            this.quickOpenService.show(':'); // "Go to line"
        };
        EditorStatus.prototype.onEOLClick = function () {
            var action = this.instantiationService.createInstance(ChangeEOLAction, ChangeEOLAction.ID, ChangeEOLAction.LABEL);
            action.run().done(null, errors.onUnexpectedError);
            action.dispose();
        };
        EditorStatus.prototype.onEncodingClick = function () {
            var action = this.instantiationService.createInstance(ChangeEncodingAction, ChangeEncodingAction.ID, ChangeEncodingAction.LABEL);
            action.run().done(null, errors.onUnexpectedError);
            action.dispose();
        };
        EditorStatus.prototype.onTabFocusModeClick = function () {
            var activeEditor = this.editorService.getActiveEditor();
            if (activeEditor instanceof textEditor_1.BaseTextEditor && isCodeEditorWithTabFocusMode(activeEditor)) {
                activeEditor.getControl().updateOptions({ tabFocusMode: false });
            }
        };
        EditorStatus.prototype.onEditorInputChange = function (e) {
            this.onSelectionChange(e);
            this.onModeChange(e);
            this.onEOLChange(e);
            this.onEncodingChange(e);
            this.onTabFocusModeChange(e);
        };
        EditorStatus.prototype.onModeChange = function (e) {
            if (e && !this.isActiveEditor(e)) {
                return;
            }
            var info = { mode: null };
            // We only support text based editors
            if (e instanceof textEditor_1.BaseTextEditor) {
                var editorWidget = e.getControl();
                var textModel = getTextModel(editorWidget);
                if (textModel) {
                    var modesRegistry = platform_1.Registry.as(modesRegistry_1.Extensions.EditorModes);
                    // Compute mode
                    if (!!textModel.getMode) {
                        var mode = textModel.getMode();
                        if (mode) {
                            info = { mode: modesRegistry.getLanguageName(mode.getId()) };
                        }
                    }
                }
            }
            this.updateState(info);
        };
        EditorStatus.prototype.onSelectionChange = function (e) {
            if (e && !this.isActiveEditor(e)) {
                return;
            }
            var info = {};
            // We only support text based editors
            if (e instanceof textEditor_1.BaseTextEditor) {
                var editorWidget = e.getControl();
                // Compute selection(s)
                info.selections = editorWidget.getSelections() || [];
                // Compute selection length
                info.charactersSelected = 0;
                var textModel = getTextModel(editorWidget);
                if (textModel) {
                    info.selections.forEach(function (selection) {
                        info.charactersSelected += textModel.getValueLengthInRange(selection);
                    });
                }
                // Compute the visible column for one selection. This will properly handle tabs and their configured widths
                if (info.selections.length === 1) {
                    var visibleColumn = editorWidget.getVisibleColumnFromPosition(editorWidget.getPosition());
                    var selectionClone = info.selections[0].clone(); // do not modify the original position we got from the editor
                    selectionClone.positionColumn = visibleColumn;
                    info.selections[0] = selectionClone;
                }
            }
            this.updateState({ selectionStatus: info });
        };
        EditorStatus.prototype.onEOLChange = function (e) {
            if (e && !this.isActiveEditor(e)) {
                return;
            }
            var info = { EOL: null };
            // We only support writable text based code editors
            if (e instanceof textEditor_1.BaseTextEditor && isWritableCodeEditor(e)) {
                var editorWidget = e.getControl();
                var textModel = getTextModel(editorWidget);
                if (textModel) {
                    info = { EOL: textModel.getEOL() };
                }
            }
            this.updateState(info);
        };
        EditorStatus.prototype.onEncodingChange = function (e) {
            if (e && !this.isActiveEditor(e)) {
                return;
            }
            var info = { encoding: null };
            // We only support text based editors
            if (e instanceof textEditor_1.BaseTextEditor) {
                var encodingSupport = asFileOrUntitledEditorInput(e.input);
                if (encodingSupport && types.isFunction(encodingSupport.getEncoding)) {
                    var rawEncoding = encodingSupport.getEncoding();
                    var encodingInfo = encoding.SUPPORTED_ENCODINGS[rawEncoding];
                    if (encodingInfo) {
                        info.encoding = encodingInfo.labelShort; // if we have a label, take it from there
                    }
                    else {
                        info.encoding = rawEncoding; // otherwise use it raw
                    }
                }
            }
            this.updateState(info);
        };
        EditorStatus.prototype.onResourceEncodingChange = function (resource) {
            var activeEditor = this.editorService.getActiveEditor();
            if (activeEditor) {
                var activeResource = editor_1.getUntitledOrFileResource(activeEditor.input, true);
                if (activeResource && activeResource.toString() === resource.toString()) {
                    return this.onEncodingChange(activeEditor); // only update if the encoding changed for the active resource
                }
            }
        };
        EditorStatus.prototype.onTabFocusModeChange = function (e) {
            if (e && !this.isActiveEditor(e)) {
                return;
            }
            var info = { tabFocusMode: false };
            // We only support text based editors
            if (e instanceof textEditor_1.BaseTextEditor && isCodeEditorWithTabFocusMode(e)) {
                info = { tabFocusMode: true };
            }
            this.updateState(info);
        };
        EditorStatus.prototype.isActiveEditor = function (e) {
            var activeEditor = this.editorService.getActiveEditor();
            return activeEditor && e && activeEditor === e;
        };
        EditorStatus = __decorate([
            __param(0, editorService_1.IWorkbenchEditorService),
            __param(1, quickOpenService_1.IQuickOpenService),
            __param(2, instantiation_1.IInstantiationService),
            __param(3, event_1.IEventService)
        ], EditorStatus);
        return EditorStatus;
    })();
    exports.EditorStatus = EditorStatus;
    function isCodeEditorWithTabFocusMode(e) {
        var editorWidget = e.getControl();
        if (editorWidget.getEditorType() === editorCommon_1.EditorType.IDiffEditor) {
            editorWidget = editorWidget.getModifiedEditor();
        }
        return (editorWidget.getEditorType() === editorCommon_1.EditorType.ICodeEditor &&
            editorWidget.getConfiguration().tabFocusMode);
    }
    function isWritableCodeEditor(e) {
        var editorWidget = e.getControl();
        if (editorWidget.getEditorType() === editorCommon_1.EditorType.IDiffEditor) {
            editorWidget = editorWidget.getModifiedEditor();
        }
        return (editorWidget.getEditorType() === editorCommon_1.EditorType.ICodeEditor &&
            !editorWidget.getConfiguration().readOnly);
    }
    var ChangeModeAction = (function (_super) {
        __extends(ChangeModeAction, _super);
        function ChangeModeAction(actionId, actionLabel, modeService, editorService, quickOpenService) {
            _super.call(this, actionId, actionLabel);
            this.modeService = modeService;
            this.editorService = editorService;
            this.quickOpenService = quickOpenService;
        }
        ChangeModeAction.prototype.run = function () {
            var _this = this;
            var modesRegistry = platform_1.Registry.as(modesRegistry_1.Extensions.EditorModes);
            var languages = modesRegistry.getRegisteredLanguageNames();
            var activeEditor = this.editorService.getActiveEditor();
            if (!(activeEditor instanceof textEditor_1.BaseTextEditor)) {
                return this.quickOpenService.pick([{ label: nls.localize('noEditor', "No text editor active at this time") }]);
            }
            var editorWidget = activeEditor.getControl();
            var textModel = getTextModel(editorWidget);
            // Compute mode
            var currentModeId;
            if (!!textModel.getMode) {
                var mode = textModel.getMode();
                if (mode) {
                    currentModeId = modesRegistry.getLanguageName(mode.getId());
                }
            }
            // All languages are valid picks
            var selectedIndex;
            var picks = languages.sort().map(function (lang, index) {
                if (currentModeId === lang) {
                    selectedIndex = index;
                }
                return {
                    label: lang
                };
            });
            // Offer to "Auto Detect" if we have a file open
            var autoDetectMode = {
                label: nls.localize('autoDetect', "Auto Detect")
            };
            if (editor_1.asFileEditorInput(activeEditor.input, true)) {
                picks.unshift(autoDetectMode); // first entry
                selectedIndex++; // pushes selected index down
            }
            return this.quickOpenService.pick(picks, { placeHolder: nls.localize('pickLanguage', "Select Language Mode"), autoFocus: { autoFocusIndex: selectedIndex } }).then(function (language) {
                if (language) {
                    activeEditor = _this.editorService.getActiveEditor();
                    if (activeEditor instanceof textEditor_1.BaseTextEditor) {
                        var editorWidget_1 = activeEditor.getControl();
                        var textModel_1 = getTextModel(editorWidget_1);
                        // Change mode
                        if (!!textModel_1.getMode) {
                            if (language === autoDetectMode) {
                                var fileResource = editor_1.asFileEditorInput(activeEditor.input, true).getResource();
                                textModel_1.setMode(_this.modeService.getOrCreateModeByFilenameOrFirstLine(fileResource.fsPath, textModel_1.getLineContent(1)));
                            }
                            else {
                                textModel_1.setMode(_this.modeService.getOrCreateModeByLanguageName(language.label));
                            }
                        }
                    }
                }
            });
        };
        ChangeModeAction.ID = 'workbench.action.editor.changeLanguageMode';
        ChangeModeAction.LABEL = nls.localize('changeMode', "Change Language Mode");
        ChangeModeAction = __decorate([
            __param(2, modeService_1.IModeService),
            __param(3, editorService_1.IWorkbenchEditorService),
            __param(4, quickOpenService_1.IQuickOpenService)
        ], ChangeModeAction);
        return ChangeModeAction;
    })(actions_1.Action);
    exports.ChangeModeAction = ChangeModeAction;
    var ChangeEOLAction = (function (_super) {
        __extends(ChangeEOLAction, _super);
        function ChangeEOLAction(actionId, actionLabel, editorService, quickOpenService) {
            _super.call(this, actionId, actionLabel);
            this.editorService = editorService;
            this.quickOpenService = quickOpenService;
        }
        ChangeEOLAction.prototype.run = function () {
            var _this = this;
            var activeEditor = this.editorService.getActiveEditor();
            if (!(activeEditor instanceof textEditor_1.BaseTextEditor)) {
                return this.quickOpenService.pick([{ label: nls.localize('noEditor', "No text editor active at this time") }]);
            }
            if (!isWritableCodeEditor(activeEditor)) {
                return this.quickOpenService.pick([{ label: nls.localize('noWritableCodeEditor', "The active code editor is read-only.") }]);
            }
            var editorWidget = activeEditor.getControl();
            var textModel = getTextModel(editorWidget);
            var EOLOptions = [
                { label: nlsEOLLF, eol: editorCommon_1.EndOfLineSequence.LF },
                { label: nlsEOLCRLF, eol: editorCommon_1.EndOfLineSequence.CRLF },
            ];
            var selectedIndex = (textModel.getEOL() === '\n') ? 0 : 1;
            return this.quickOpenService.pick(EOLOptions, { placeHolder: nls.localize('pickEndOfLine', "Select End of Line Sequence"), autoFocus: { autoFocusIndex: selectedIndex } }).then(function (eol) {
                if (eol) {
                    activeEditor = _this.editorService.getActiveEditor();
                    if (activeEditor instanceof textEditor_1.BaseTextEditor && isWritableCodeEditor(activeEditor)) {
                        var editorWidget_2 = activeEditor.getControl();
                        var textModel_2 = getTextModel(editorWidget_2);
                        textModel_2.setEOL(eol.eol);
                    }
                }
            });
        };
        ChangeEOLAction.ID = 'workbench.action.editor.changeEOL';
        ChangeEOLAction.LABEL = nls.localize('changeEndOfLine', "Change End of Line Sequence");
        ChangeEOLAction = __decorate([
            __param(2, editorService_1.IWorkbenchEditorService),
            __param(3, quickOpenService_1.IQuickOpenService)
        ], ChangeEOLAction);
        return ChangeEOLAction;
    })(actions_1.Action);
    exports.ChangeEOLAction = ChangeEOLAction;
    var ChangeEncodingAction = (function (_super) {
        __extends(ChangeEncodingAction, _super);
        function ChangeEncodingAction(actionId, actionLabel, editorService, quickOpenService, configurationService) {
            _super.call(this, actionId, actionLabel);
            this.editorService = editorService;
            this.quickOpenService = quickOpenService;
            this.configurationService = configurationService;
        }
        ChangeEncodingAction.prototype.run = function () {
            var _this = this;
            var activeEditor = this.editorService.getActiveEditor();
            if (!(activeEditor instanceof textEditor_1.BaseTextEditor) || !activeEditor.input) {
                return this.quickOpenService.pick([{ label: nls.localize('noEditor', "No text editor active at this time") }]);
            }
            var encodingSupport = asFileOrUntitledEditorInput(activeEditor.input);
            if (!types.areFunctions(encodingSupport.setEncoding, encodingSupport.getEncoding)) {
                return this.quickOpenService.pick([{ label: nls.localize('noFileEditor', "No file active at this time") }]);
            }
            var pickActionPromise;
            var saveWithEncodingPick = { label: nls.localize('saveWithEncoding', "Save with Encoding") };
            var reopenWithEncodingPick = { label: nls.localize('reopenWithEncoding', "Reopen with Encoding") };
            if (encodingSupport instanceof untitledEditorInput_1.UntitledEditorInput) {
                pickActionPromise = winjs_base_1.Promise.as(saveWithEncodingPick);
            }
            else if (!isWritableCodeEditor(activeEditor)) {
                pickActionPromise = winjs_base_1.Promise.as(reopenWithEncodingPick);
            }
            else {
                pickActionPromise = this.quickOpenService.pick([reopenWithEncodingPick, saveWithEncodingPick], { placeHolder: nls.localize('pickAction', "Select Action") });
            }
            return pickActionPromise.then(function (action) {
                if (!action) {
                    return;
                }
                return winjs_base_1.Promise.timeout(50 /* quick open is sensitive to being opened so soon after another */).then(function () {
                    var isReopenWithEncoding = (action === reopenWithEncodingPick);
                    return _this.configurationService.loadConfiguration().then(function (configuration) {
                        var defaultEncoding = configuration && configuration.files && configuration.files.encoding;
                        var selectedIndex;
                        // All encodings are valid picks
                        var picks = Object.keys(encoding.SUPPORTED_ENCODINGS)
                            .sort(function (k1, k2) {
                            if (k1 === defaultEncoding) {
                                return -1;
                            }
                            else if (k2 === defaultEncoding) {
                                return 1;
                            }
                            return encoding.SUPPORTED_ENCODINGS[k1].order - encoding.SUPPORTED_ENCODINGS[k2].order;
                        })
                            .map(function (key, index) {
                            if (key === encodingSupport.getEncoding()) {
                                selectedIndex = index;
                            }
                            return { id: key, label: encoding.SUPPORTED_ENCODINGS[key].labelLong, description: key === defaultEncoding ? nls.localize('defaultEncoding', "Default Encoding") : void 0 };
                        });
                        return _this.quickOpenService.pick(picks, {
                            placeHolder: isReopenWithEncoding ? nls.localize('pickEncodingForReopen', "Select File Encoding to Reopen File") : nls.localize('pickEncodingForSave', "Select File Encoding to Save with"),
                            autoFocus: { autoFocusIndex: selectedIndex }
                        }).then(function (encoding) {
                            if (encoding) {
                                activeEditor = _this.editorService.getActiveEditor();
                                encodingSupport = asFileOrUntitledEditorInput(activeEditor.input);
                                if (encodingSupport && types.areFunctions(encodingSupport.setEncoding, encodingSupport.getEncoding) && encodingSupport.getEncoding() !== encoding.id) {
                                    encodingSupport.setEncoding(encoding.id, isReopenWithEncoding ? editor_1.EncodingMode.Decode : editor_1.EncodingMode.Encode); // Set new encoding
                                }
                            }
                        });
                    });
                });
            });
        };
        ChangeEncodingAction.ID = 'workbench.action.editor.changeEncoding';
        ChangeEncodingAction.LABEL = nls.localize('changeEncoding', "Change File Encoding");
        ChangeEncodingAction = __decorate([
            __param(2, editorService_1.IWorkbenchEditorService),
            __param(3, quickOpenService_1.IQuickOpenService),
            __param(4, configuration_1.IConfigurationService)
        ], ChangeEncodingAction);
        return ChangeEncodingAction;
    })(actions_1.Action);
    exports.ChangeEncodingAction = ChangeEncodingAction;
});
//# sourceMappingURL=editorStatus.js.map