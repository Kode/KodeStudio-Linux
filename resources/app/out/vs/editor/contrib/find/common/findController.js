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
define(["require", "exports", 'vs/nls', 'vs/base/common/winjs.base', 'vs/editor/common/editorCommonExtensions', 'vs/editor/common/editorAction', 'vs/editor/contrib/find/common/findModel', 'vs/base/common/lifecycle', 'vs/editor/common/editorCommon', 'vs/editor/common/core/selection', 'vs/platform/keybinding/common/keybindingService', 'vs/platform/instantiation/common/instantiation', 'vs/base/common/keyCodes', 'vs/editor/common/core/range', 'vs/editor/contrib/wordHighlighter/common/wordHighlighter', 'vs/editor/contrib/find/common/findState'], function (require, exports, nls, winjs_base_1, editorCommonExtensions_1, editorAction_1, findModel_1, lifecycle_1, EditorCommon, selection_1, keybindingService_1, instantiation_1, keyCodes_1, range_1, wordHighlighter_1, findState_1) {
    (function (FindStartFocusAction) {
        FindStartFocusAction[FindStartFocusAction["NoFocusChange"] = 0] = "NoFocusChange";
        FindStartFocusAction[FindStartFocusAction["FocusFindInput"] = 1] = "FocusFindInput";
        FindStartFocusAction[FindStartFocusAction["FocusReplaceInput"] = 2] = "FocusReplaceInput";
    })(exports.FindStartFocusAction || (exports.FindStartFocusAction = {}));
    var FindStartFocusAction = exports.FindStartFocusAction;
    var CONTEXT_FIND_WIDGET_VISIBLE = 'findWidgetVisible';
    var CommonFindController = (function (_super) {
        __extends(CommonFindController, _super);
        function CommonFindController(editor, keybindingService) {
            var _this = this;
            _super.call(this);
            this._editor = editor;
            this._findWidgetVisible = keybindingService.createKey(CONTEXT_FIND_WIDGET_VISIBLE, false);
            this._state = this._register(new findState_1.FindReplaceState());
            this._register(this._state.addChangeListener(function (e) { return _this._onStateChanged(e); }));
            this._model = null;
            this._register(this._editor.addListener2(EditorCommon.EventType.ModelChanged, function () {
                var shouldRestartFind = (_this._editor.getModel() && _this._state.isRevealed);
                _this.disposeModel();
                if (shouldRestartFind) {
                    _this._start({
                        forceRevealReplace: false,
                        seedSearchStringFromSelection: false,
                        seedSearchScopeFromSelection: false,
                        shouldFocus: FindStartFocusAction.NoFocusChange,
                        shouldAnimate: false
                    });
                }
            }));
        }
        CommonFindController.getFindController = function (editor) {
            return editor.getContribution(CommonFindController.ID);
        };
        CommonFindController.prototype.dispose = function () {
            this.disposeModel();
            _super.prototype.dispose.call(this);
        };
        CommonFindController.prototype.disposeModel = function () {
            if (this._model) {
                this._model.dispose();
                this._model = null;
            }
        };
        CommonFindController.prototype.getId = function () {
            return CommonFindController.ID;
        };
        CommonFindController.prototype._onStateChanged = function (e) {
            if (e.isRevealed) {
                if (this._state.isRevealed) {
                    this._findWidgetVisible.set(true);
                }
                else {
                    this._findWidgetVisible.reset();
                    this.disposeModel();
                }
            }
        };
        CommonFindController.prototype.getState = function () {
            return this._state;
        };
        CommonFindController.prototype.closeFindWidget = function () {
            this._state.change({ isRevealed: false }, false);
            this._editor.focus();
        };
        CommonFindController.prototype.toggleCaseSensitive = function () {
            this._state.change({ matchCase: !this._state.matchCase }, false);
        };
        CommonFindController.prototype.toggleWholeWords = function () {
            this._state.change({ wholeWord: !this._state.wholeWord }, false);
        };
        CommonFindController.prototype.toggleRegex = function () {
            this._state.change({ isRegex: !this._state.isRegex }, false);
        };
        CommonFindController.prototype.setSearchString = function (searchString) {
            this._state.change({ searchString: searchString }, false);
        };
        CommonFindController.prototype.getSelectionSearchString = function () {
            var selection = this._editor.getSelection();
            if (selection.startLineNumber === selection.endLineNumber) {
                if (selection.isEmpty()) {
                    var wordAtPosition = this._editor.getModel().getWordAtPosition(selection.getStartPosition());
                    if (wordAtPosition) {
                        return wordAtPosition.word;
                    }
                }
                else {
                    return this._editor.getModel().getValueInRange(selection);
                }
            }
            return null;
        };
        CommonFindController.prototype._start = function (opts) {
            this.disposeModel();
            if (!this._editor.getModel()) {
                // cannot do anything with an editor that doesn't have a model...
                return;
            }
            var stateChanges = {
                isRevealed: true
            };
            // Consider editor selection and overwrite the state with it
            if (opts.seedSearchStringFromSelection) {
                var selectionSearchString = this.getSelectionSearchString();
                if (selectionSearchString) {
                    stateChanges.searchString = selectionSearchString;
                }
            }
            var selection = this._editor.getSelection();
            stateChanges.searchScope = null;
            if (opts.seedSearchScopeFromSelection && selection.startLineNumber < selection.endLineNumber) {
                // Take search scope into account only if it is more than one line.
                stateChanges.searchScope = selection;
            }
            // Overwrite isReplaceRevealed
            if (opts.forceRevealReplace) {
                stateChanges.isReplaceRevealed = true;
            }
            this._state.change(stateChanges, false);
            if (!this._model) {
                this._model = new findModel_1.FindModelBoundToEditorModel(this._editor, this._state);
            }
        };
        CommonFindController.prototype.start = function (opts) {
            this._start(opts);
        };
        CommonFindController.prototype.moveToNextMatch = function () {
            if (this._model) {
                this._model.moveToNextMatch();
                return true;
            }
            return false;
        };
        CommonFindController.prototype.moveToPrevMatch = function () {
            if (this._model) {
                this._model.moveToPrevMatch();
                return true;
            }
            return false;
        };
        CommonFindController.prototype.replace = function () {
            if (this._model) {
                this._model.replace();
                return true;
            }
            return false;
        };
        CommonFindController.prototype.replaceAll = function () {
            if (this._model) {
                this._model.replaceAll();
                return true;
            }
            return false;
        };
        CommonFindController.ID = 'editor.contrib.findController';
        CommonFindController = __decorate([
            __param(1, keybindingService_1.IKeybindingService)
        ], CommonFindController);
        return CommonFindController;
    })(lifecycle_1.Disposable);
    exports.CommonFindController = CommonFindController;
    var StartFindAction = (function (_super) {
        __extends(StartFindAction, _super);
        function StartFindAction(descriptor, editor, ns) {
            _super.call(this, descriptor, editor, editorAction_1.Behaviour.WidgetFocus);
        }
        StartFindAction.prototype.run = function () {
            var controller = CommonFindController.getFindController(this.editor);
            controller.start({
                forceRevealReplace: false,
                seedSearchStringFromSelection: true,
                seedSearchScopeFromSelection: true,
                shouldFocus: FindStartFocusAction.FocusFindInput,
                shouldAnimate: true
            });
            return winjs_base_1.TPromise.as(true);
        };
        StartFindAction = __decorate([
            __param(2, instantiation_1.INullService)
        ], StartFindAction);
        return StartFindAction;
    })(editorAction_1.EditorAction);
    exports.StartFindAction = StartFindAction;
    var MatchFindAction = (function (_super) {
        __extends(MatchFindAction, _super);
        function MatchFindAction(descriptor, editor, ns) {
            _super.call(this, descriptor, editor, editorAction_1.Behaviour.WidgetFocus);
        }
        MatchFindAction.prototype.run = function () {
            var controller = CommonFindController.getFindController(this.editor);
            if (!this._run(controller)) {
                controller.start({
                    forceRevealReplace: false,
                    seedSearchStringFromSelection: (controller.getState().searchString.length === 0),
                    seedSearchScopeFromSelection: false,
                    shouldFocus: FindStartFocusAction.NoFocusChange,
                    shouldAnimate: true
                });
                this._run(controller);
            }
            return winjs_base_1.TPromise.as(true);
        };
        MatchFindAction = __decorate([
            __param(2, instantiation_1.INullService)
        ], MatchFindAction);
        return MatchFindAction;
    })(editorAction_1.EditorAction);
    exports.MatchFindAction = MatchFindAction;
    var NextMatchFindAction = (function (_super) {
        __extends(NextMatchFindAction, _super);
        function NextMatchFindAction() {
            _super.apply(this, arguments);
        }
        NextMatchFindAction.prototype._run = function (controller) {
            return controller.moveToNextMatch();
        };
        return NextMatchFindAction;
    })(MatchFindAction);
    exports.NextMatchFindAction = NextMatchFindAction;
    var PreviousMatchFindAction = (function (_super) {
        __extends(PreviousMatchFindAction, _super);
        function PreviousMatchFindAction() {
            _super.apply(this, arguments);
        }
        PreviousMatchFindAction.prototype._run = function (controller) {
            return controller.moveToPrevMatch();
        };
        return PreviousMatchFindAction;
    })(MatchFindAction);
    exports.PreviousMatchFindAction = PreviousMatchFindAction;
    var SelectionMatchFindAction = (function (_super) {
        __extends(SelectionMatchFindAction, _super);
        function SelectionMatchFindAction(descriptor, editor, ns) {
            _super.call(this, descriptor, editor, editorAction_1.Behaviour.WidgetFocus);
        }
        SelectionMatchFindAction.prototype.run = function () {
            var controller = CommonFindController.getFindController(this.editor);
            var selectionSearchString = controller.getSelectionSearchString();
            if (selectionSearchString) {
                controller.setSearchString(selectionSearchString);
            }
            if (!this._run(controller)) {
                controller.start({
                    forceRevealReplace: false,
                    seedSearchStringFromSelection: false,
                    seedSearchScopeFromSelection: false,
                    shouldFocus: FindStartFocusAction.NoFocusChange,
                    shouldAnimate: true
                });
                this._run(controller);
            }
            return winjs_base_1.TPromise.as(true);
        };
        SelectionMatchFindAction = __decorate([
            __param(2, instantiation_1.INullService)
        ], SelectionMatchFindAction);
        return SelectionMatchFindAction;
    })(editorAction_1.EditorAction);
    exports.SelectionMatchFindAction = SelectionMatchFindAction;
    var NextSelectionMatchFindAction = (function (_super) {
        __extends(NextSelectionMatchFindAction, _super);
        function NextSelectionMatchFindAction() {
            _super.apply(this, arguments);
        }
        NextSelectionMatchFindAction.prototype._run = function (controller) {
            return controller.moveToNextMatch();
        };
        return NextSelectionMatchFindAction;
    })(SelectionMatchFindAction);
    exports.NextSelectionMatchFindAction = NextSelectionMatchFindAction;
    var PreviousSelectionMatchFindAction = (function (_super) {
        __extends(PreviousSelectionMatchFindAction, _super);
        function PreviousSelectionMatchFindAction() {
            _super.apply(this, arguments);
        }
        PreviousSelectionMatchFindAction.prototype._run = function (controller) {
            return controller.moveToPrevMatch();
        };
        return PreviousSelectionMatchFindAction;
    })(SelectionMatchFindAction);
    exports.PreviousSelectionMatchFindAction = PreviousSelectionMatchFindAction;
    var StartFindReplaceAction = (function (_super) {
        __extends(StartFindReplaceAction, _super);
        function StartFindReplaceAction(descriptor, editor, ns) {
            _super.call(this, descriptor, editor, editorAction_1.Behaviour.WidgetFocus | editorAction_1.Behaviour.Writeable);
        }
        StartFindReplaceAction.prototype.run = function () {
            var controller = CommonFindController.getFindController(this.editor);
            controller.start({
                forceRevealReplace: true,
                seedSearchStringFromSelection: (controller.getState().searchString.length === 0),
                seedSearchScopeFromSelection: true,
                shouldFocus: FindStartFocusAction.FocusReplaceInput,
                shouldAnimate: true
            });
            return winjs_base_1.TPromise.as(true);
        };
        StartFindReplaceAction = __decorate([
            __param(2, instantiation_1.INullService)
        ], StartFindReplaceAction);
        return StartFindReplaceAction;
    })(editorAction_1.EditorAction);
    exports.StartFindReplaceAction = StartFindReplaceAction;
    function multiCursorFind(editor, changeFindSearchString) {
        var controller = CommonFindController.getFindController(editor);
        var state = controller.getState();
        var searchText, nextMatch;
        // In any case, if the find widget was ever opened, the options are taken from it
        var wholeWord = state.wholeWord;
        var matchCase = state.matchCase;
        // Find widget owns what we search for if:
        //  - focus is not in the editor (i.e. it is in the find widget)
        //  - and the search widget is visible
        //  - and the search string is non-empty
        if (!editor.isFocused() && state.isRevealed && state.searchString.length > 0) {
            // Find widget owns what is searched for
            searchText = state.searchString;
        }
        else {
            // Selection owns what is searched for
            var s = editor.getSelection();
            if (s.startLineNumber !== s.endLineNumber) {
                // Cannot search for multiline string... yet...
                return null;
            }
            if (s.isEmpty()) {
                // selection is empty => expand to current word
                var word = editor.getModel().getWordAtPosition(s.getStartPosition());
                if (!word) {
                    return null;
                }
                searchText = word.word;
                nextMatch = selection_1.Selection.createSelection(s.startLineNumber, word.startColumn, s.startLineNumber, word.endColumn);
            }
            else {
                searchText = editor.getModel().getValueInRange(s);
            }
            if (changeFindSearchString) {
                controller.setSearchString(searchText);
            }
        }
        return {
            searchText: searchText,
            matchCase: matchCase,
            wholeWord: wholeWord,
            nextMatch: nextMatch
        };
    }
    exports.multiCursorFind = multiCursorFind;
    var SelectNextFindMatchAction = (function (_super) {
        __extends(SelectNextFindMatchAction, _super);
        function SelectNextFindMatchAction(descriptor, editor, ns) {
            _super.call(this, descriptor, editor, editorAction_1.Behaviour.WidgetFocus);
        }
        SelectNextFindMatchAction.prototype._getNextMatch = function () {
            var r = multiCursorFind(this.editor, true);
            if (!r) {
                return null;
            }
            if (r.nextMatch) {
                return r.nextMatch;
            }
            var allSelections = this.editor.getSelections();
            var lastAddedSelection = allSelections[allSelections.length - 1];
            var nextMatch = this.editor.getModel().findNextMatch(r.searchText, lastAddedSelection.getEndPosition(), false, r.matchCase, r.wholeWord);
            if (!nextMatch) {
                return null;
            }
            return selection_1.Selection.createSelection(nextMatch.startLineNumber, nextMatch.startColumn, nextMatch.endLineNumber, nextMatch.endColumn);
        };
        SelectNextFindMatchAction = __decorate([
            __param(2, instantiation_1.INullService)
        ], SelectNextFindMatchAction);
        return SelectNextFindMatchAction;
    })(editorAction_1.EditorAction);
    exports.SelectNextFindMatchAction = SelectNextFindMatchAction;
    var AddSelectionToNextFindMatchAction = (function (_super) {
        __extends(AddSelectionToNextFindMatchAction, _super);
        function AddSelectionToNextFindMatchAction(descriptor, editor, ns) {
            _super.call(this, descriptor, editor, ns);
        }
        AddSelectionToNextFindMatchAction.prototype.run = function () {
            var nextMatch = this._getNextMatch();
            if (!nextMatch) {
                return winjs_base_1.TPromise.as(false);
            }
            var allSelections = this.editor.getSelections();
            this.editor.setSelections(allSelections.concat(nextMatch));
            this.editor.revealRangeInCenterIfOutsideViewport(nextMatch);
            return winjs_base_1.TPromise.as(true);
        };
        AddSelectionToNextFindMatchAction.ID = findModel_1.FIND_IDS.AddSelectionToNextFindMatchAction;
        AddSelectionToNextFindMatchAction = __decorate([
            __param(2, instantiation_1.INullService)
        ], AddSelectionToNextFindMatchAction);
        return AddSelectionToNextFindMatchAction;
    })(SelectNextFindMatchAction);
    exports.AddSelectionToNextFindMatchAction = AddSelectionToNextFindMatchAction;
    var MoveSelectionToNextFindMatchAction = (function (_super) {
        __extends(MoveSelectionToNextFindMatchAction, _super);
        function MoveSelectionToNextFindMatchAction(descriptor, editor, ns) {
            _super.call(this, descriptor, editor, ns);
        }
        MoveSelectionToNextFindMatchAction.prototype.run = function () {
            var nextMatch = this._getNextMatch();
            if (!nextMatch) {
                return winjs_base_1.TPromise.as(false);
            }
            var allSelections = this.editor.getSelections();
            var lastAddedSelection = allSelections[allSelections.length - 1];
            this.editor.setSelections(allSelections.slice(0, allSelections.length - 1).concat(nextMatch));
            this.editor.revealRangeInCenterIfOutsideViewport(nextMatch);
            return winjs_base_1.TPromise.as(true);
        };
        MoveSelectionToNextFindMatchAction.ID = findModel_1.FIND_IDS.MoveSelectionToNextFindMatchAction;
        MoveSelectionToNextFindMatchAction = __decorate([
            __param(2, instantiation_1.INullService)
        ], MoveSelectionToNextFindMatchAction);
        return MoveSelectionToNextFindMatchAction;
    })(SelectNextFindMatchAction);
    exports.MoveSelectionToNextFindMatchAction = MoveSelectionToNextFindMatchAction;
    var SelectHighlightsAction = (function (_super) {
        __extends(SelectHighlightsAction, _super);
        function SelectHighlightsAction(descriptor, editor, ns) {
            var behaviour = editorAction_1.Behaviour.WidgetFocus;
            if (descriptor.id === SelectHighlightsAction.COMPAT_ID) {
                behaviour |= editorAction_1.Behaviour.ShowInContextMenu;
            }
            _super.call(this, descriptor, editor, behaviour);
        }
        SelectHighlightsAction.prototype.getGroupId = function () {
            return '2_change/1_changeAll';
        };
        SelectHighlightsAction.prototype.run = function () {
            var r = multiCursorFind(this.editor, true);
            if (!r) {
                return winjs_base_1.TPromise.as(false);
            }
            var matches = this.editor.getModel().findMatches(r.searchText, true, false, r.matchCase, r.wholeWord);
            if (matches.length > 0) {
                this.editor.setSelections(matches.map(function (m) { return selection_1.Selection.createSelection(m.startLineNumber, m.startColumn, m.endLineNumber, m.endColumn); }));
            }
            return winjs_base_1.TPromise.as(true);
        };
        SelectHighlightsAction.ID = 'editor.action.selectHighlights';
        SelectHighlightsAction.COMPAT_ID = 'editor.action.changeAll';
        SelectHighlightsAction = __decorate([
            __param(2, instantiation_1.INullService)
        ], SelectHighlightsAction);
        return SelectHighlightsAction;
    })(editorAction_1.EditorAction);
    exports.SelectHighlightsAction = SelectHighlightsAction;
    var SelectionHighlighter = (function (_super) {
        __extends(SelectionHighlighter, _super);
        function SelectionHighlighter(editor, ns) {
            var _this = this;
            _super.call(this);
            this.editor = editor;
            this.decorations = [];
            this._register(editor.addListener2(EditorCommon.EventType.CursorPositionChanged, function (_) { return _this._update(); }));
            this._register(editor.addListener2(EditorCommon.EventType.ModelChanged, function (e) {
                _this.removeDecorations();
            }));
            this._register(CommonFindController.getFindController(editor).getState().addChangeListener(function (e) { return _this._update(); }));
        }
        SelectionHighlighter.prototype.getId = function () {
            return SelectionHighlighter.ID;
        };
        SelectionHighlighter.prototype.removeDecorations = function () {
            if (this.decorations.length > 0) {
                this.decorations = this.editor.deltaDecorations(this.decorations, []);
            }
        };
        SelectionHighlighter.prototype._update = function () {
            if (!this.editor.getConfiguration().selectionHighlight) {
                return;
            }
            var r = multiCursorFind(this.editor, false);
            if (!r) {
                this.removeDecorations();
                return;
            }
            var model = this.editor.getModel();
            if (r.nextMatch) {
                // This is an empty selection
                if (wordHighlighter_1.OccurrencesRegistry.has(model)) {
                    // Do not interfere with semantic word highlighting in the no selection case
                    this.removeDecorations();
                    return;
                }
            }
            if (/^[ \t]+$/.test(r.searchText)) {
                // whitespace only selection
                this.removeDecorations();
                return;
            }
            if (r.searchText.length > 200) {
                // very long selection
                this.removeDecorations();
                return;
            }
            var allMatches = model.findMatches(r.searchText, true, false, r.matchCase, r.wholeWord);
            allMatches.sort(range_1.Range.compareRangesUsingStarts);
            var selections = this.editor.getSelections();
            selections.sort(range_1.Range.compareRangesUsingStarts);
            // do not overlap with selection (issue #64 and #512)
            var matches = [];
            for (var i = 0, j = 0, len = allMatches.length, lenJ = selections.length; i < len;) {
                var match = allMatches[i];
                if (j >= lenJ) {
                    // finished all editor selections
                    matches.push(match);
                    i++;
                }
                else {
                    var cmp = range_1.Range.compareRangesUsingStarts(match, selections[j]);
                    if (cmp < 0) {
                        // match is before sel
                        matches.push(match);
                        i++;
                    }
                    else if (cmp > 0) {
                        // sel is before match
                        j++;
                    }
                    else {
                        // sel is equal to match
                        i++;
                        j++;
                    }
                }
            }
            var decorations = matches.map(function (r) {
                return {
                    range: r,
                    options: {
                        stickiness: EditorCommon.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
                        className: 'selectionHighlight'
                    }
                };
            });
            this.decorations = this.editor.deltaDecorations(this.decorations, decorations);
        };
        SelectionHighlighter.prototype.dispose = function () {
            this.removeDecorations();
            _super.prototype.dispose.call(this);
        };
        SelectionHighlighter.ID = 'editor.contrib.selectionHighlighter';
        SelectionHighlighter = __decorate([
            __param(1, instantiation_1.INullService)
        ], SelectionHighlighter);
        return SelectionHighlighter;
    })(lifecycle_1.Disposable);
    exports.SelectionHighlighter = SelectionHighlighter;
    editorCommonExtensions_1.CommonEditorRegistry.registerEditorAction(new editorCommonExtensions_1.EditorActionDescriptor(SelectHighlightsAction, SelectHighlightsAction.ID, nls.localize('selectAllOccurencesOfFindMatch', "Select All Occurences of Find Match"), {
        context: editorCommonExtensions_1.ContextKey.EditorFocus,
        primary: keyCodes_1.KeyMod.CtrlCmd | keyCodes_1.KeyMod.Shift | keyCodes_1.KeyCode.KEY_L
    }));
    // register SelectHighlightsAction again to replace the now removed Change All action
    editorCommonExtensions_1.CommonEditorRegistry.registerEditorAction(new editorCommonExtensions_1.EditorActionDescriptor(SelectHighlightsAction, SelectHighlightsAction.COMPAT_ID, nls.localize('changeAll.label', "Change All Occurrences"), {
        context: editorCommonExtensions_1.ContextKey.EditorTextFocus,
        primary: keyCodes_1.KeyMod.CtrlCmd | keyCodes_1.KeyCode.F2
    }));
    // register actions
    editorCommonExtensions_1.CommonEditorRegistry.registerEditorAction(new editorCommonExtensions_1.EditorActionDescriptor(StartFindAction, findModel_1.FIND_IDS.StartFindAction, nls.localize('startFindAction', "Find"), {
        context: editorCommonExtensions_1.ContextKey.None,
        primary: keyCodes_1.KeyMod.CtrlCmd | keyCodes_1.KeyCode.KEY_F
    }));
    editorCommonExtensions_1.CommonEditorRegistry.registerEditorAction(new editorCommonExtensions_1.EditorActionDescriptor(NextMatchFindAction, findModel_1.FIND_IDS.NextMatchFindAction, nls.localize('findNextMatchAction', "Find Next"), {
        context: editorCommonExtensions_1.ContextKey.EditorFocus,
        primary: keyCodes_1.KeyCode.F3,
        mac: { primary: keyCodes_1.KeyMod.CtrlCmd | keyCodes_1.KeyCode.KEY_G, secondary: [keyCodes_1.KeyCode.F3] }
    }));
    editorCommonExtensions_1.CommonEditorRegistry.registerEditorAction(new editorCommonExtensions_1.EditorActionDescriptor(PreviousMatchFindAction, findModel_1.FIND_IDS.PreviousMatchFindAction, nls.localize('findPreviousMatchAction', "Find Previous"), {
        context: editorCommonExtensions_1.ContextKey.EditorFocus,
        primary: keyCodes_1.KeyMod.Shift | keyCodes_1.KeyCode.F3,
        mac: { primary: keyCodes_1.KeyMod.CtrlCmd | keyCodes_1.KeyMod.Shift | keyCodes_1.KeyCode.KEY_G, secondary: [keyCodes_1.KeyMod.Shift | keyCodes_1.KeyCode.F3] }
    }));
    editorCommonExtensions_1.CommonEditorRegistry.registerEditorAction(new editorCommonExtensions_1.EditorActionDescriptor(NextSelectionMatchFindAction, findModel_1.FIND_IDS.NextSelectionMatchFindAction, nls.localize('nextSelectionMatchFindAction', "Find Next Selection"), {
        context: editorCommonExtensions_1.ContextKey.EditorFocus,
        primary: keyCodes_1.KeyMod.CtrlCmd | keyCodes_1.KeyCode.F3
    }));
    editorCommonExtensions_1.CommonEditorRegistry.registerEditorAction(new editorCommonExtensions_1.EditorActionDescriptor(PreviousSelectionMatchFindAction, findModel_1.FIND_IDS.PreviousSelectionMatchFindAction, nls.localize('previousSelectionMatchFindAction', "Find Previous Selection"), {
        context: editorCommonExtensions_1.ContextKey.EditorFocus,
        primary: keyCodes_1.KeyMod.CtrlCmd | keyCodes_1.KeyMod.Shift | keyCodes_1.KeyCode.F3
    }));
    editorCommonExtensions_1.CommonEditorRegistry.registerEditorAction(new editorCommonExtensions_1.EditorActionDescriptor(StartFindReplaceAction, findModel_1.FIND_IDS.StartFindReplaceAction, nls.localize('startReplace', "Replace"), {
        context: editorCommonExtensions_1.ContextKey.None,
        primary: keyCodes_1.KeyMod.CtrlCmd | keyCodes_1.KeyCode.KEY_H,
        mac: { primary: keyCodes_1.KeyMod.CtrlCmd | keyCodes_1.KeyMod.Alt | keyCodes_1.KeyCode.KEY_F }
    }));
    editorCommonExtensions_1.CommonEditorRegistry.registerEditorAction(new editorCommonExtensions_1.EditorActionDescriptor(MoveSelectionToNextFindMatchAction, MoveSelectionToNextFindMatchAction.ID, nls.localize('moveSelectionToNextFindMatch', "Move Last Selection To Next Find Match"), {
        context: editorCommonExtensions_1.ContextKey.EditorFocus,
        primary: keyCodes_1.KeyMod.chord(keyCodes_1.KeyMod.CtrlCmd | keyCodes_1.KeyCode.KEY_K, keyCodes_1.KeyMod.CtrlCmd | keyCodes_1.KeyCode.KEY_D)
    }));
    editorCommonExtensions_1.CommonEditorRegistry.registerEditorAction(new editorCommonExtensions_1.EditorActionDescriptor(AddSelectionToNextFindMatchAction, AddSelectionToNextFindMatchAction.ID, nls.localize('addSelectionToNextFindMatch', "Add Selection To Next Find Match"), {
        context: editorCommonExtensions_1.ContextKey.EditorFocus,
        primary: keyCodes_1.KeyMod.CtrlCmd | keyCodes_1.KeyCode.KEY_D
    }));
    function registerFindCommand(id, callback, keybindings, needsKey) {
        if (needsKey === void 0) { needsKey = null; }
        editorCommonExtensions_1.CommonEditorRegistry.registerEditorCommand(id, editorCommonExtensions_1.CommonEditorRegistry.commandWeight(5), keybindings, false, needsKey, function (ctx, editor, args) {
            callback(CommonFindController.getFindController(editor));
        });
    }
    registerFindCommand(findModel_1.FIND_IDS.CloseFindWidgetCommand, function (x) { return x.closeFindWidget(); }, {
        primary: keyCodes_1.KeyCode.Escape
    }, CONTEXT_FIND_WIDGET_VISIBLE);
    registerFindCommand(findModel_1.FIND_IDS.ToggleCaseSensitiveCommand, function (x) { return x.toggleCaseSensitive(); }, {
        primary: keyCodes_1.KeyMod.Alt | keyCodes_1.KeyCode.KEY_C,
        mac: { primary: keyCodes_1.KeyMod.CtrlCmd | keyCodes_1.KeyMod.Alt | keyCodes_1.KeyCode.KEY_C }
    });
    registerFindCommand(findModel_1.FIND_IDS.ToggleWholeWordCommand, function (x) { return x.toggleWholeWords(); }, {
        primary: keyCodes_1.KeyMod.Alt | keyCodes_1.KeyCode.KEY_W,
        mac: { primary: keyCodes_1.KeyMod.CtrlCmd | keyCodes_1.KeyMod.Alt | keyCodes_1.KeyCode.KEY_W }
    });
    registerFindCommand(findModel_1.FIND_IDS.ToggleRegexCommand, function (x) { return x.toggleRegex(); }, {
        primary: keyCodes_1.KeyMod.Alt | keyCodes_1.KeyCode.KEY_R,
        mac: { primary: keyCodes_1.KeyMod.CtrlCmd | keyCodes_1.KeyMod.Alt | keyCodes_1.KeyCode.KEY_R }
    });
});
//# sourceMappingURL=findController.js.map