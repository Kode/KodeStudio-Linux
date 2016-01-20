/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/editor/common/model/tokensBinaryEncoding'], function (require, exports, TokensBinaryEncoding) {
    /**
     * The direction of a selection.
     */
    (function (SelectionDirection) {
        /**
         * The selection starts above where it ends.
         */
        SelectionDirection[SelectionDirection["LTR"] = 0] = "LTR";
        /**
         * The selection starts below where it ends.
         */
        SelectionDirection[SelectionDirection["RTL"] = 1] = "RTL";
    })(exports.SelectionDirection || (exports.SelectionDirection = {}));
    var SelectionDirection = exports.SelectionDirection;
    ;
    (function (WrappingIndent) {
        WrappingIndent[WrappingIndent["None"] = 0] = "None";
        WrappingIndent[WrappingIndent["Same"] = 1] = "Same";
        WrappingIndent[WrappingIndent["Indent"] = 2] = "Indent";
    })(exports.WrappingIndent || (exports.WrappingIndent = {}));
    var WrappingIndent = exports.WrappingIndent;
    function wrappingIndentFromString(wrappingIndent) {
        if (wrappingIndent === 'indent') {
            return WrappingIndent.Indent;
        }
        else if (wrappingIndent === 'same') {
            return WrappingIndent.Same;
        }
        else {
            return WrappingIndent.None;
        }
    }
    exports.wrappingIndentFromString = wrappingIndentFromString;
    /**
     * Vertical Lane in the overview ruler of the editor.
     */
    (function (OverviewRulerLane) {
        OverviewRulerLane[OverviewRulerLane["Left"] = 1] = "Left";
        OverviewRulerLane[OverviewRulerLane["Center"] = 2] = "Center";
        OverviewRulerLane[OverviewRulerLane["Right"] = 4] = "Right";
        OverviewRulerLane[OverviewRulerLane["Full"] = 7] = "Full";
    })(exports.OverviewRulerLane || (exports.OverviewRulerLane = {}));
    var OverviewRulerLane = exports.OverviewRulerLane;
    /**
     * End of line character preference.
     */
    (function (EndOfLinePreference) {
        /**
         * Use the end of line character identified in the text buffer.
         */
        EndOfLinePreference[EndOfLinePreference["TextDefined"] = 0] = "TextDefined";
        /**
         * Use line feed (\n) as the end of line character.
         */
        EndOfLinePreference[EndOfLinePreference["LF"] = 1] = "LF";
        /**
         * Use carriage return and line feed (\r\n) as the end of line character.
         */
        EndOfLinePreference[EndOfLinePreference["CRLF"] = 2] = "CRLF";
    })(exports.EndOfLinePreference || (exports.EndOfLinePreference = {}));
    var EndOfLinePreference = exports.EndOfLinePreference;
    /**
     * End of line character preference.
     */
    (function (EndOfLineSequence) {
        /**
         * Use line feed (\n) as the end of line character.
         */
        EndOfLineSequence[EndOfLineSequence["LF"] = 0] = "LF";
        /**
         * Use carriage return and line feed (\r\n) as the end of line character.
         */
        EndOfLineSequence[EndOfLineSequence["CRLF"] = 1] = "CRLF";
    })(exports.EndOfLineSequence || (exports.EndOfLineSequence = {}));
    var EndOfLineSequence = exports.EndOfLineSequence;
    exports.LineTokensBinaryEncoding = TokensBinaryEncoding;
    (function (TrackedRangeStickiness) {
        TrackedRangeStickiness[TrackedRangeStickiness["AlwaysGrowsWhenTypingAtEdges"] = 0] = "AlwaysGrowsWhenTypingAtEdges";
        TrackedRangeStickiness[TrackedRangeStickiness["NeverGrowsWhenTypingAtEdges"] = 1] = "NeverGrowsWhenTypingAtEdges";
        TrackedRangeStickiness[TrackedRangeStickiness["GrowsOnlyWhenTypingBefore"] = 2] = "GrowsOnlyWhenTypingBefore";
        TrackedRangeStickiness[TrackedRangeStickiness["GrowsOnlyWhenTypingAfter"] = 3] = "GrowsOnlyWhenTypingAfter";
    })(exports.TrackedRangeStickiness || (exports.TrackedRangeStickiness = {}));
    var TrackedRangeStickiness = exports.TrackedRangeStickiness;
    (function (VerticalRevealType) {
        VerticalRevealType[VerticalRevealType["Simple"] = 0] = "Simple";
        VerticalRevealType[VerticalRevealType["Center"] = 1] = "Center";
        VerticalRevealType[VerticalRevealType["CenterIfOutsideViewport"] = 2] = "CenterIfOutsideViewport";
    })(exports.VerticalRevealType || (exports.VerticalRevealType = {}));
    var VerticalRevealType = exports.VerticalRevealType;
    /**
     * Type of hit element with the mouse in the editor.
     */
    (function (MouseTargetType) {
        /**
         * Mouse is on top of an unknown element.
         */
        MouseTargetType[MouseTargetType["UNKNOWN"] = 0] = "UNKNOWN";
        /**
         * Mouse is on top of the textarea used for input.
         */
        MouseTargetType[MouseTargetType["TEXTAREA"] = 1] = "TEXTAREA";
        /**
         * Mouse is on top of the glyph margin
         */
        MouseTargetType[MouseTargetType["GUTTER_GLYPH_MARGIN"] = 2] = "GUTTER_GLYPH_MARGIN";
        /**
         * Mouse is on top of the line numbers
         */
        MouseTargetType[MouseTargetType["GUTTER_LINE_NUMBERS"] = 3] = "GUTTER_LINE_NUMBERS";
        /**
         * Mouse is on top of the line decorations
         */
        MouseTargetType[MouseTargetType["GUTTER_LINE_DECORATIONS"] = 4] = "GUTTER_LINE_DECORATIONS";
        /**
         * Mouse is on top of the whitespace left in the gutter by a view zone.
         */
        MouseTargetType[MouseTargetType["GUTTER_VIEW_ZONE"] = 5] = "GUTTER_VIEW_ZONE";
        /**
         * Mouse is on top of text in the content.
         */
        MouseTargetType[MouseTargetType["CONTENT_TEXT"] = 6] = "CONTENT_TEXT";
        /**
         * Mouse is on top of empty space in the content (e.g. after line text or below last line)
         */
        MouseTargetType[MouseTargetType["CONTENT_EMPTY"] = 7] = "CONTENT_EMPTY";
        /**
         * Mouse is on top of a view zone in the content.
         */
        MouseTargetType[MouseTargetType["CONTENT_VIEW_ZONE"] = 8] = "CONTENT_VIEW_ZONE";
        /**
         * Mouse is on top of a content widget.
         */
        MouseTargetType[MouseTargetType["CONTENT_WIDGET"] = 9] = "CONTENT_WIDGET";
        /**
         * Mouse is on top of the decorations overview ruler.
         */
        MouseTargetType[MouseTargetType["OVERVIEW_RULER"] = 10] = "OVERVIEW_RULER";
        /**
         * Mouse is on top of a scrollbar.
         */
        MouseTargetType[MouseTargetType["SCROLLBAR"] = 11] = "SCROLLBAR";
        /**
         * Mouse is on top of an overlay widget.
         */
        MouseTargetType[MouseTargetType["OVERLAY_WIDGET"] = 12] = "OVERLAY_WIDGET";
    })(exports.MouseTargetType || (exports.MouseTargetType = {}));
    var MouseTargetType = exports.MouseTargetType;
    exports.KEYBINDING_CONTEXT_EDITOR_TEXT_FOCUS = 'editorTextFocus';
    exports.KEYBINDING_CONTEXT_EDITOR_FOCUS = 'editorFocus';
    exports.KEYBINDING_CONTEXT_EDITOR_TAB_MOVES_FOCUS = 'editorTabMovesFocus';
    exports.KEYBINDING_CONTEXT_EDITOR_HAS_MULTIPLE_SELECTIONS = 'editorHasMultipleSelections';
    exports.KEYBINDING_CONTEXT_EDITOR_HAS_NON_EMPTY_SELECTION = 'editorHasSelection';
    exports.KEYBINDING_CONTEXT_EDITOR_LANGUAGE_ID = 'editorLangId';
    exports.ViewEventNames = {
        ModelFlushedEvent: 'modelFlushedEvent',
        LinesDeletedEvent: 'linesDeletedEvent',
        LinesInsertedEvent: 'linesInsertedEvent',
        LineChangedEvent: 'lineChangedEvent',
        TokensChangedEvent: 'tokensChangedEvent',
        DecorationsChangedEvent: 'decorationsChangedEvent',
        CursorPositionChangedEvent: 'cursorPositionChangedEvent',
        CursorSelectionChangedEvent: 'cursorSelectionChangedEvent',
        RevealRangeEvent: 'revealRangeEvent',
        LineMappingChangedEvent: 'lineMappingChangedEvent',
        ScrollRequestEvent: 'scrollRequestEvent'
    };
    (function (CodeEditorStateFlag) {
        CodeEditorStateFlag[CodeEditorStateFlag["Value"] = 0] = "Value";
        CodeEditorStateFlag[CodeEditorStateFlag["Selection"] = 1] = "Selection";
        CodeEditorStateFlag[CodeEditorStateFlag["Position"] = 2] = "Position";
        CodeEditorStateFlag[CodeEditorStateFlag["Scroll"] = 3] = "Scroll";
    })(exports.CodeEditorStateFlag || (exports.CodeEditorStateFlag = {}));
    var CodeEditorStateFlag = exports.CodeEditorStateFlag;
    exports.EditorType = {
        ICodeEditor: 'vs.editor.ICodeEditor',
        IDiffEditor: 'vs.editor.IDiffEditor'
    };
    exports.ClassName = {
        EditorWarningDecoration: 'greensquiggly',
        EditorErrorDecoration: 'redsquiggly'
    };
    exports.EventType = {
        Disposed: 'disposed',
        ConfigurationChanged: 'configurationChanged',
        ModelDispose: 'modelDispose',
        ModelChanged: 'modelChanged',
        ModelTokensChanged: 'modelTokensChanged',
        ModelModeChanged: 'modelsModeChanged',
        ModelModeSupportChanged: 'modelsModeSupportChanged',
        ModelContentChanged: 'contentChanged',
        ModelContentChanged2: 'contentChanged2',
        ModelContentChangedFlush: 'flush',
        ModelContentChangedLinesDeleted: 'linesDeleted',
        ModelContentChangedLinesInserted: 'linesInserted',
        ModelContentChangedLineChanged: 'lineChanged',
        EditorTextBlur: 'blur',
        EditorTextFocus: 'focus',
        EditorFocus: 'widgetFocus',
        EditorBlur: 'widgetBlur',
        ModelPropertiesChanged: 'propertiesChanged',
        ModelDecorationsChanged: 'decorationsChanged',
        CursorPositionChanged: 'positionChanged',
        CursorSelectionChanged: 'selectionChanged',
        CursorRevealRange: 'revealRange',
        CursorScrollRequest: 'scrollRequest',
        ViewFocusGained: 'focusGained',
        ViewFocusLost: 'focusLost',
        ViewFocusChanged: 'focusChanged',
        ViewScrollWidthChanged: 'scrollWidthChanged',
        ViewScrollHeightChanged: 'scrollHeightChanged',
        ViewScrollChanged: 'scrollChanged',
        ViewZonesChanged: 'zonesChanged',
        ViewLayoutChanged: 'viewLayoutChanged',
        ContextMenu: 'contextMenu',
        MouseDown: 'mousedown',
        MouseUp: 'mouseup',
        MouseMove: 'mousemove',
        MouseLeave: 'mouseleave',
        KeyDown: 'keydown',
        KeyUp: 'keyup',
        EditorLayout: 'editorLayout',
        DiffUpdated: 'diffUpdated'
    };
    exports.Handler = {
        ExecuteCommand: 'executeCommand',
        ExecuteCommands: 'executeCommands',
        CursorLeft: 'cursorLeft',
        CursorLeftSelect: 'cursorLeftSelect',
        CursorWordLeft: 'cursorWordLeft',
        CursorWordLeftSelect: 'cursorWordLeftSelect',
        CursorRight: 'cursorRight',
        CursorRightSelect: 'cursorRightSelect',
        CursorWordRight: 'cursorWordRight',
        CursorWordRightSelect: 'cursorWordRightSelect',
        CursorUp: 'cursorUp',
        CursorUpSelect: 'cursorUpSelect',
        CursorDown: 'cursorDown',
        CursorDownSelect: 'cursorDownSelect',
        CursorPageUp: 'cursorPageUp',
        CursorPageUpSelect: 'cursorPageUpSelect',
        CursorPageDown: 'cursorPageDown',
        CursorPageDownSelect: 'cursorPageDownSelect',
        CursorHome: 'cursorHome',
        CursorHomeSelect: 'cursorHomeSelect',
        CursorEnd: 'cursorEnd',
        CursorEndSelect: 'cursorEndSelect',
        ExpandLineSelection: 'expandLineSelection',
        CursorTop: 'cursorTop',
        CursorTopSelect: 'cursorTopSelect',
        CursorBottom: 'cursorBottom',
        CursorBottomSelect: 'cursorBottomSelect',
        AddCursorDown: 'addCursorDown',
        AddCursorUp: 'addCursorUp',
        CursorUndo: 'cursorUndo',
        MoveTo: 'moveTo',
        MoveToSelect: 'moveToSelect',
        CreateCursor: 'createCursor',
        LastCursorMoveToSelect: 'lastCursorMoveToSelect',
        JumpToBracket: 'jumpToBracket',
        Type: 'type',
        ReplacePreviousChar: 'replacePreviousChar',
        Paste: 'paste',
        Tab: 'tab',
        Indent: 'indent',
        Outdent: 'outdent',
        DeleteLeft: 'deleteLeft',
        DeleteRight: 'deleteRight',
        DeleteWordLeft: 'deleteWordLeft',
        DeleteWordRight: 'deleteWordRight',
        DeleteAllLeft: 'deleteAllLeft',
        DeleteAllRight: 'deleteAllRight',
        Enter: 'enter',
        RemoveSecondaryCursors: 'removeSecondaryCursors',
        CancelSelection: 'cancelSelection',
        Cut: 'cut',
        Undo: 'undo',
        Redo: 'redo',
        WordSelect: 'wordSelect',
        WordSelectDrag: 'wordSelectDrag',
        LastCursorWordSelect: 'lastCursorWordSelect',
        LineSelect: 'lineSelect',
        LineSelectDrag: 'lineSelectDrag',
        LastCursorLineSelect: 'lastCursorLineSelect',
        LastCursorLineSelectDrag: 'lastCursorLineSelectDrag',
        LineInsertBefore: 'lineInsertBefore',
        LineInsertAfter: 'lineInsertAfter',
        LineBreakInsert: 'lineBreakInsert',
        SelectAll: 'selectAll',
        ScrollLineUp: 'scrollLineUp',
        ScrollLineDown: 'scrollLineDown',
        ScrollPageUp: 'scrollPageUp',
        ScrollPageDown: 'scrollPageDown'
    };
});
//# sourceMappingURL=editorCommon.js.map