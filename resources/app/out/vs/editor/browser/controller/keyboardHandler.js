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
define(["require", "exports", 'vs/editor/common/editorCommon', 'vs/base/browser/keyboardController', 'vs/base/browser/dom', 'vs/base/common/platform', 'vs/base/browser/browser', 'vs/editor/common/viewModel/viewEventHandler', 'vs/base/common/async', 'vs/base/common/strings', 'vs/editor/common/core/range', 'vs/editor/common/core/position', 'vs/base/common/keyCodes'], function (require, exports, EditorCommon, keyboardController, DomUtils, Platform, Browser, viewEventHandler_1, Schedulers, Strings, range_1, position_1, keyCodes_1) {
    var ReadFromTextArea;
    (function (ReadFromTextArea) {
        ReadFromTextArea[ReadFromTextArea["Type"] = 0] = "Type";
        ReadFromTextArea[ReadFromTextArea["Paste"] = 1] = "Paste";
    })(ReadFromTextArea || (ReadFromTextArea = {}));
    var TextAreaState = (function () {
        function TextAreaState(value, selectionStart, selectionEnd, selectionToken) {
            this.value = value;
            this.selectionStart = selectionStart;
            this.selectionEnd = selectionEnd;
            this.selectionToken = selectionToken;
        }
        TextAreaState.prototype.toString = function () {
            return '[ <' + this.value + '>, selectionStart: ' + this.selectionStart + ', selectionEnd: ' + this.selectionEnd + ']';
        };
        TextAreaState.fromTextArea = function (textArea, selectionToken) {
            return new TextAreaState(textArea.value, textArea.selectionStart, textArea.selectionEnd, selectionToken);
        };
        TextAreaState.fromEditorSelectionAndPreviousState = function (model, selection, previousSelectionToken) {
            if (Browser.isIPad) {
                // Do not place anything in the textarea for the iPad
                return new TextAreaState('', 0, 0, selectionStartLineNumber);
            }
            var LIMIT_CHARS = 100;
            var PADDING_LINES_COUNT = 0;
            var selectionStartLineNumber = selection.startLineNumber, selectionStartColumn = selection.startColumn, selectionEndLineNumber = selection.endLineNumber, selectionEndColumn = selection.endColumn, selectionEndLineNumberMaxColumn = model.getLineMaxColumn(selectionEndLineNumber);
            // If the selection is empty and we have switched line numbers, expand selection to full line (helps Narrator trigger a full line read)
            if (selection.isEmpty() && previousSelectionToken !== selectionStartLineNumber) {
                selectionStartColumn = 1;
                selectionEndColumn = selectionEndLineNumberMaxColumn;
            }
            // `pretext` contains the text before the selection
            var pretext = '';
            var startLineNumber = Math.max(1, selectionStartLineNumber - PADDING_LINES_COUNT);
            if (startLineNumber < selectionStartLineNumber) {
                pretext = model.getValueInRange(new range_1.Range(startLineNumber, 1, selectionStartLineNumber, 1), EditorCommon.EndOfLinePreference.LF);
            }
            pretext += model.getValueInRange(new range_1.Range(selectionStartLineNumber, 1, selectionStartLineNumber, selectionStartColumn), EditorCommon.EndOfLinePreference.LF);
            if (pretext.length > LIMIT_CHARS) {
                pretext = pretext.substring(pretext.length - LIMIT_CHARS, pretext.length);
            }
            // `posttext` contains the text after the selection
            var posttext = '';
            var endLineNumber = Math.min(selectionEndLineNumber + PADDING_LINES_COUNT, model.getLineCount());
            posttext += model.getValueInRange(new range_1.Range(selectionEndLineNumber, selectionEndColumn, selectionEndLineNumber, selectionEndLineNumberMaxColumn), EditorCommon.EndOfLinePreference.LF);
            if (endLineNumber > selectionEndLineNumber) {
                posttext = '\n' + model.getValueInRange(new range_1.Range(selectionEndLineNumber + 1, 1, endLineNumber, model.getLineMaxColumn(endLineNumber)), EditorCommon.EndOfLinePreference.LF);
            }
            if (posttext.length > LIMIT_CHARS) {
                posttext = posttext.substring(0, LIMIT_CHARS);
            }
            // `text` contains the text of the selection
            var text = model.getValueInRange(new range_1.Range(selectionStartLineNumber, selectionStartColumn, selectionEndLineNumber, selectionEndColumn), EditorCommon.EndOfLinePreference.LF);
            if (text.length > 2 * LIMIT_CHARS) {
                text = text.substring(0, LIMIT_CHARS) + String.fromCharCode(8230) + text.substring(text.length - LIMIT_CHARS, text.length);
            }
            return new TextAreaState(pretext + text + posttext, pretext.length, pretext.length + text.length, selectionStartLineNumber);
        };
        TextAreaState.prototype.getSelectionStart = function () {
            return this.selectionStart;
        };
        TextAreaState.prototype.resetSelection = function () {
            this.selectionStart = this.value.length;
            this.selectionEnd = this.value.length;
        };
        TextAreaState.prototype.getValue = function () {
            return this.value;
        };
        TextAreaState.prototype.getSelectionToken = function () {
            return this.selectionToken;
        };
        TextAreaState.prototype.applyToTextArea = function (textArea, select) {
            if (textArea.value !== this.value) {
                textArea.value = this.value;
            }
            if (select) {
                try {
                    var scrollState = DomUtils.saveParentsScrollTop(textArea);
                    textArea.focus();
                    textArea.setSelectionRange(this.selectionStart, this.selectionEnd);
                    DomUtils.restoreParentsScrollTop(textArea, scrollState);
                }
                catch (e) {
                }
            }
        };
        TextAreaState.prototype.extractNewText = function (previousState) {
            if (this.selectionStart !== this.selectionEnd) {
                // There is a selection in the textarea => ignore input
                return '';
            }
            if (!previousState) {
                return this.value;
            }
            var previousPrefix = previousState.value.substring(0, previousState.selectionStart);
            var previousSuffix = previousState.value.substring(previousState.selectionEnd, previousState.value.length);
            // In IE, pressing Insert will bring the typing into overwrite mode
            if (Browser.isIE11orEarlier && document.queryCommandValue('OverWrite')) {
                previousSuffix = previousSuffix.substr(1);
            }
            var value = this.value;
            if (value.substring(0, previousPrefix.length) === previousPrefix) {
                value = value.substring(previousPrefix.length);
            }
            if (value.substring(value.length - previousSuffix.length, value.length) === previousSuffix) {
                value = value.substring(0, value.length - previousSuffix.length);
            }
            return value;
        };
        return TextAreaState;
    })();
    var KeyboardHandler = (function (_super) {
        __extends(KeyboardHandler, _super);
        function KeyboardHandler(context, viewController, viewHelper) {
            var _this = this;
            _super.call(this);
            this.context = context;
            this.viewController = viewController;
            this.textArea = viewHelper.textArea;
            this.viewHelper = viewHelper;
            this.selection = new range_1.Range(1, 1, 1, 1);
            this.cursorPosition = new position_1.Position(1, 1);
            this.contentLeft = 0;
            this.contentWidth = 0;
            this.scrollLeft = 0;
            this.asyncReadFromTextArea = new Schedulers.RunOnceScheduler(null, 0);
            this.asyncSetSelectionToTextArea = new Schedulers.RunOnceScheduler(function () { return _this._writePlaceholderAndSelectTextArea(); }, 0);
            this.asyncTriggerCut = new Schedulers.RunOnceScheduler(function () { return _this._triggerCut(); }, 0);
            this.lastCopiedValue = null;
            this.lastCopiedValueIsFromEmptySelection = false;
            this.previousSetTextAreaState = null;
            this.hasFocus = false;
            this.justHadAPaste = false;
            this.justHadACut = false;
            this.lastKeyPressTime = 0;
            this.lastCompositionEndTime = 0;
            this.lastValueWrittenToTheTextArea = '';
            this.kbController = new keyboardController.KeyboardController(this.textArea);
            this.listenersToRemove = [];
            this.listenersToRemove.push(this.kbController.addListener('keydown', function (e) { return _this._onKeyDown(e); }));
            this.listenersToRemove.push(this.kbController.addListener('keyup', function (e) { return _this._onKeyUp(e); }));
            this.listenersToRemove.push(this.kbController.addListener('keypress', function (e) { return _this._onKeyPress(e); }));
            //		this.listenersToRemove.push(DomUtils.addListener(this.textArea, 'change', (e) => this._scheduleLookout(EditorCommon.Handler.Type)));
            this.textareaIsShownAtCursor = false;
            this.listenersToRemove.push(DomUtils.addListener(this.textArea, 'compositionstart', function (e) {
                var timeSinceLastCompositionEnd = (new Date().getTime()) - _this.lastCompositionEndTime;
                if (!_this.textareaIsShownAtCursor) {
                    _this.textareaIsShownAtCursor = true;
                    _this.showTextAreaAtCursor(timeSinceLastCompositionEnd >= 100);
                }
                _this.asyncReadFromTextArea.cancel();
            }));
            this.listenersToRemove.push(DomUtils.addListener(this.textArea, 'compositionend', function (e) {
                if (_this.textareaIsShownAtCursor) {
                    _this.textareaIsShownAtCursor = false;
                    _this.hideTextArea();
                }
                _this.lastCompositionEndTime = (new Date()).getTime();
                _this._scheduleReadFromTextArea(ReadFromTextArea.Type);
            }));
            // on the iPad the text area is not fast enough to get the content of the keypress,
            // so we leverage the input event instead
            if (Browser.isIPad) {
                this.listenersToRemove.push(DomUtils.addListener(this.textArea, 'input', function (e) {
                    var myTime = (new Date()).getTime();
                    // A keypress will trigger an input event (very quickly)
                    var keyPressDeltaTime = myTime - _this.lastKeyPressTime;
                    if (keyPressDeltaTime <= 500) {
                        _this._scheduleReadFromTextArea(ReadFromTextArea.Type);
                        _this.lastKeyPressTime = 0;
                    }
                }));
            }
            // on the mac the character viewer input generates an input event (no keypress)
            // on windows, the Chinese IME, when set to insert wide punctuation generates an input event (no keypress)
            this.listenersToRemove.push(this.kbController.addListener('input', function (e) {
                // Ignore input event if we are in composition mode
                if (!_this.textareaIsShownAtCursor) {
                    _this._scheduleReadFromTextArea(ReadFromTextArea.Type);
                }
            }));
            if (Platform.isMacintosh) {
                this.listenersToRemove.push(DomUtils.addListener(this.textArea, 'input', function (e) {
                    // We are fishing for the input event that comes in the mac popover input method case
                    // A paste will trigger an input event, but the event might happen very late
                    if (_this.justHadAPaste) {
                        _this.justHadAPaste = false;
                        return;
                    }
                    // A cut will trigger an input event, but the event might happen very late
                    if (_this.justHadACut) {
                        _this.justHadACut = false;
                        return;
                    }
                    var myTime = (new Date()).getTime();
                    // A keypress will trigger an input event (very quickly)
                    var keyPressDeltaTime = myTime - _this.lastKeyPressTime;
                    if (keyPressDeltaTime <= 500) {
                        return;
                    }
                    // A composition end will trigger an input event (very quickly)
                    var compositionEndDeltaTime = myTime - _this.lastCompositionEndTime;
                    if (compositionEndDeltaTime <= 500) {
                        return;
                    }
                    // Ignore input if we are in the middle of a composition
                    if (_this.textareaIsShownAtCursor) {
                        return;
                    }
                    // Ignore if the textarea has selection
                    if (_this.textArea.selectionStart !== _this.textArea.selectionEnd) {
                        return;
                    }
                    // In Chrome, only the first character gets replaced, while in Safari the entire line gets replaced
                    var typedText;
                    var textAreaValue = _this.textArea.value;
                    if (!Browser.isChrome) {
                        // TODO: Also check this on Safari & FF before removing this
                        return;
                    }
                    if (_this.lastValueWrittenToTheTextArea.length !== textAreaValue.length) {
                        return;
                    }
                    var prefixLength = Strings.commonPrefixLength(_this.lastValueWrittenToTheTextArea, textAreaValue);
                    var suffixLength = Strings.commonSuffixLength(_this.lastValueWrittenToTheTextArea, textAreaValue);
                    if (prefixLength + suffixLength + 1 !== textAreaValue.length) {
                        return;
                    }
                    typedText = textAreaValue.charAt(prefixLength);
                    _this.executeReplacePreviousChar(typedText);
                    _this.previousSetTextAreaState = TextAreaState.fromTextArea(_this.textArea, 0);
                    _this.asyncSetSelectionToTextArea.schedule();
                }));
            }
            this.listenersToRemove.push(DomUtils.addListener(this.textArea, 'cut', function (e) { return _this._onCut(e); }));
            this.listenersToRemove.push(DomUtils.addListener(this.textArea, 'copy', function (e) { return _this._onCopy(e); }));
            this.listenersToRemove.push(DomUtils.addListener(this.textArea, 'paste', function (e) { return _this._onPaste(e); }));
            this._writePlaceholderAndSelectTextArea();
            this.context.addEventHandler(this);
        }
        KeyboardHandler.prototype.dispose = function () {
            this.context.removeEventHandler(this);
            this.listenersToRemove.forEach(function (element) {
                element();
            });
            this.listenersToRemove = [];
            this.kbController.dispose();
            this.asyncReadFromTextArea.dispose();
            this.asyncSetSelectionToTextArea.dispose();
            this.asyncTriggerCut.dispose();
        };
        KeyboardHandler.prototype.showTextAreaAtCursor = function (emptyIt) {
            var interestingLineNumber, interestingColumn1, interestingColumn2;
            // In IE we cannot set .value when handling 'compositionstart' because the entire composition will get canceled.
            if (Browser.isIE11orEarlier) {
                // Ensure selection start is in viewport
                interestingLineNumber = this.selection.startLineNumber;
                interestingColumn1 = this.selection.startColumn;
                interestingColumn2 = this.previousSetTextAreaState.getSelectionStart() + 1;
            }
            else {
                // Ensure primary cursor is in viewport
                interestingLineNumber = this.cursorPosition.lineNumber;
                interestingColumn1 = this.cursorPosition.column;
                interestingColumn2 = interestingColumn1;
            }
            // Ensure range is in viewport
            var revealInterestingColumn1Event = {
                range: new range_1.Range(interestingLineNumber, interestingColumn1, interestingLineNumber, interestingColumn1),
                verticalType: EditorCommon.VerticalRevealType.Simple,
                revealHorizontal: true
            };
            this.context.privateViewEventBus.emit(EditorCommon.ViewEventNames.RevealRangeEvent, revealInterestingColumn1Event);
            // Find range pixel position
            var visibleRange1 = this.viewHelper.visibleRangeForPositionRelativeToEditor(interestingLineNumber, interestingColumn1);
            var visibleRange2 = this.viewHelper.visibleRangeForPositionRelativeToEditor(interestingLineNumber, interestingColumn2);
            if (Browser.isIE11orEarlier) {
                // Position textarea at the beginning of the line
                if (visibleRange1 && visibleRange2) {
                    this.textArea.style.top = visibleRange1.top + 'px';
                    this.textArea.style.left = this.contentLeft + visibleRange1.left - visibleRange2.left - this.scrollLeft + 'px';
                    this.textArea.style.width = this.contentWidth + 'px';
                }
            }
            else {
                // Position textarea at cursor location
                if (visibleRange1) {
                    this.textArea.style.left = this.contentLeft + visibleRange1.left - this.scrollLeft + 'px';
                    this.textArea.style.top = visibleRange1.top + 'px';
                }
                // Empty the textarea
                if (emptyIt) {
                    this.setTextAreaState(new TextAreaState('', 0, 0, 0), false);
                }
            }
            // Show the textarea
            this.textArea.style.height = this.context.configuration.editor.lineHeight + 'px';
            DomUtils.addClass(this.viewHelper.viewDomNode, 'ime-input');
        };
        KeyboardHandler.prototype.hideTextArea = function () {
            this.textArea.style.height = '';
            this.textArea.style.width = '';
            this.textArea.style.left = '0px';
            this.textArea.style.top = '0px';
            DomUtils.removeClass(this.viewHelper.viewDomNode, 'ime-input');
        };
        // --- begin event handlers
        KeyboardHandler.prototype.onScrollChanged = function (e) {
            this.scrollLeft = e.scrollLeft;
            return false;
        };
        KeyboardHandler.prototype.onViewFocusChanged = function (isFocused) {
            this.hasFocus = isFocused;
            if (this.hasFocus) {
                this.asyncSetSelectionToTextArea.schedule();
            }
            return false;
        };
        KeyboardHandler.prototype.onCursorSelectionChanged = function (e) {
            this.selection = e.selection;
            this.asyncSetSelectionToTextArea.schedule();
            return false;
        };
        KeyboardHandler.prototype.onCursorPositionChanged = function (e) {
            this.cursorPosition = e.position;
            return false;
        };
        KeyboardHandler.prototype.onLayoutChanged = function (layoutInfo) {
            this.contentLeft = layoutInfo.contentLeft;
            this.contentWidth = layoutInfo.contentWidth;
            return false;
        };
        // --- end event handlers
        KeyboardHandler.prototype.setTextAreaState = function (textAreaState, select) {
            // IE doesn't like calling select on a hidden textarea and the textarea is hidden during the tests
            var shouldSetSelection = select && this.hasFocus;
            if (!shouldSetSelection) {
                textAreaState.resetSelection();
            }
            this.lastValueWrittenToTheTextArea = textAreaState.getValue();
            textAreaState.applyToTextArea(this.textArea, shouldSetSelection);
            this.previousSetTextAreaState = textAreaState;
        };
        KeyboardHandler.prototype._onKeyDown = function (e) {
            var _this = this;
            if (e.equals(keyCodes_1.CommonKeybindings.ESCAPE)) {
                // Prevent default always for `Esc`, otherwise it will generate a keypress
                // See http://msdn.microsoft.com/en-us/library/ie/ms536939(v=vs.85).aspx
                e.preventDefault();
            }
            this.viewController.emitKeyDown(e);
            // Work around for issue spotted in electron on the mac
            // TODO@alex: check if this issue exists after updating electron
            // Steps:
            //  * enter a line at an offset
            //  * go down to a line with [
            //  * go up, go left, go right
            //  => press ctrl+h => a keypress is generated even though the keydown is prevent defaulted
            // Another case would be if focus goes outside the app on keydown (spotted under windows)
            // Steps:
            //  * press Ctrl+K
            //  * press R
            //  => focus moves out while keydown is not finished
            setTimeout(function () {
                // cancel reading if previous keydown was canceled, but a keypress/input were still generated
                if (e.browserEvent && e.browserEvent.defaultPrevented) {
                    // this._scheduleReadFromTextArea
                    _this.asyncReadFromTextArea.cancel();
                    _this.asyncSetSelectionToTextArea.schedule();
                }
            }, 0);
        };
        KeyboardHandler.prototype._onKeyUp = function (e) {
            this.viewController.emitKeyUp(e);
        };
        KeyboardHandler.prototype._onKeyPress = function (e) {
            if (!this.hasFocus) {
                // Sometimes, when doing Alt-Tab, in FF, a 'keypress' is sent before a 'focus'
                return;
            }
            this.lastKeyPressTime = (new Date()).getTime();
            // on the iPad the text area is not fast enough to get the content of the keypress,
            // so we leverage the input event instead
            if (!Browser.isIPad) {
                this._scheduleReadFromTextArea(ReadFromTextArea.Type);
            }
        };
        // ------------- Operations that are always executed asynchronously
        KeyboardHandler.prototype._scheduleReadFromTextArea = function (command) {
            var _this = this;
            this.asyncSetSelectionToTextArea.cancel();
            this.asyncReadFromTextArea.setRunner(function () { return _this._readFromTextArea(command); });
            this.asyncReadFromTextArea.schedule();
        };
        /**
         * Read text from textArea and trigger `command` on the editor
         */
        KeyboardHandler.prototype._readFromTextArea = function (command) {
            var previousSelectionToken = this.previousSetTextAreaState ? this.previousSetTextAreaState.getSelectionToken() : 0;
            var observedState = TextAreaState.fromTextArea(this.textArea, previousSelectionToken);
            var txt = observedState.extractNewText(this.previousSetTextAreaState);
            if (txt !== '') {
                if (command === ReadFromTextArea.Type) {
                    //				console.log("deduced input:", txt);
                    this.executeType(txt);
                }
                else {
                    this.executePaste(txt);
                }
            }
            this.previousSetTextAreaState = observedState;
            this.asyncSetSelectionToTextArea.schedule();
        };
        KeyboardHandler.prototype.executePaste = function (txt) {
            if (txt === '') {
                return;
            }
            var pasteOnNewLine = false;
            if (Browser.enableEmptySelectionClipboard) {
                pasteOnNewLine = (txt === this.lastCopiedValue && this.lastCopiedValueIsFromEmptySelection);
            }
            this.viewController.paste('keyboard', txt, pasteOnNewLine);
        };
        KeyboardHandler.prototype.executeType = function (txt) {
            if (txt === '') {
                return;
            }
            this.viewController.type('keyboard', txt);
        };
        KeyboardHandler.prototype.executeReplacePreviousChar = function (txt) {
            this.viewController.replacePreviousChar('keyboard', txt);
        };
        KeyboardHandler.prototype._writePlaceholderAndSelectTextArea = function () {
            if (!this.textareaIsShownAtCursor) {
                // Do not write to the textarea if it is visible.
                var previousSelectionToken = this.previousSetTextAreaState ? this.previousSetTextAreaState.getSelectionToken() : 0;
                var newState = TextAreaState.fromEditorSelectionAndPreviousState(this.context.model, this.selection, previousSelectionToken);
                this.setTextAreaState(newState, true);
            }
        };
        // ------------- Clipboard operations
        KeyboardHandler.prototype._onPaste = function (e) {
            if (e && e.clipboardData) {
                e.preventDefault();
                this.executePaste(e.clipboardData.getData('text/plain'));
            }
            else if (e && window.clipboardData) {
                e.preventDefault();
                this.executePaste(window.clipboardData.getData('Text'));
            }
            else {
                if (this.textArea.selectionStart !== this.textArea.selectionEnd) {
                    // Clean up the textarea, to get a clean paste
                    this.setTextAreaState(new TextAreaState('', 0, 0, 0), false);
                }
                this._scheduleReadFromTextArea(ReadFromTextArea.Paste);
            }
            this.justHadAPaste = true;
        };
        KeyboardHandler.prototype._onCopy = function (e) {
            this._ensureClipboardGetsEditorSelection(e);
        };
        KeyboardHandler.prototype._triggerCut = function () {
            this.viewController.cut('keyboard');
        };
        KeyboardHandler.prototype._onCut = function (e) {
            this._ensureClipboardGetsEditorSelection(e);
            this.asyncTriggerCut.schedule();
            this.justHadACut = true;
        };
        KeyboardHandler.prototype._ensureClipboardGetsEditorSelection = function (e) {
            var whatToCopy = this._getPlainTextToCopy();
            if (e && e.clipboardData) {
                e.clipboardData.setData('text/plain', whatToCopy);
                //			(<any>e).clipboardData.setData('text/html', this._getHTMLToCopy());
                e.preventDefault();
            }
            else if (e && window.clipboardData) {
                window.clipboardData.setData('Text', whatToCopy);
                e.preventDefault();
            }
            else {
                this.setTextAreaState(new TextAreaState(whatToCopy, 0, whatToCopy.length, 0), true);
            }
            if (Browser.enableEmptySelectionClipboard) {
                if (Browser.isFirefox) {
                    // When writing "LINE\r\n" to the clipboard and then pasting,
                    // Firefox pastes "LINE\n", so let's work around this quirk
                    this.lastCopiedValue = whatToCopy.replace(/\r\n/g, '\n');
                }
                else {
                    this.lastCopiedValue = whatToCopy;
                }
                var selections = this.context.model.getSelections();
                this.lastCopiedValueIsFromEmptySelection = (selections.length === 1 && selections[0].isEmpty());
            }
        };
        KeyboardHandler.prototype._getPlainTextToCopy = function () {
            var newLineCharacter = (Platform.isWindows ? '\r\n' : '\n');
            var eolPref = (Platform.isWindows ? EditorCommon.EndOfLinePreference.CRLF : EditorCommon.EndOfLinePreference.LF);
            var selections = this.context.model.getSelections();
            if (selections.length === 1) {
                var range = selections[0];
                if (range.isEmpty()) {
                    if (Browser.enableEmptySelectionClipboard) {
                        var modelLineNumber = this.context.model.convertViewPositionToModelPosition(range.startLineNumber, 1).lineNumber;
                        return this.context.model.getModelLineContent(modelLineNumber) + newLineCharacter;
                    }
                    else {
                        return '';
                    }
                }
                return this.context.model.getValueInRange(range, eolPref);
            }
            else {
                selections = selections.slice(0).sort(range_1.Range.compareRangesUsingStarts);
                var result = [];
                for (var i = 0; i < selections.length; i++) {
                    result.push(this.context.model.getValueInRange(selections[i], eolPref));
                }
                return result.join(newLineCharacter);
            }
        };
        return KeyboardHandler;
    })(viewEventHandler_1.ViewEventHandler);
    exports.KeyboardHandler = KeyboardHandler;
});
//# sourceMappingURL=keyboardHandler.js.map