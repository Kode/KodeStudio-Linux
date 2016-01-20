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
define(["require", "exports", 'vs/nls', 'vs/base/common/objects', 'vs/base/common/event', 'vs/base/common/strings', 'vs/platform/platform', 'vs/platform/configuration/common/configurationRegistry', 'vs/editor/common/editorCommon', 'vs/editor/common/config/defaultConfig', 'vs/editor/common/controller/handlerDispatcher', 'vs/editor/common/viewLayout/editorLayoutProvider', 'vs/base/common/lifecycle'], function (require, exports, nls, Objects, event_1, Strings, platform_1, ConfigurationRegistry, EditorCommon, defaultConfig_1, handlerDispatcher_1, editorLayoutProvider_1, lifecycle_1) {
    var ConfigurationWithDefaults = (function () {
        function ConfigurationWithDefaults(options) {
            this._editor = Objects.clone(defaultConfig_1.DefaultConfig.editor);
            this._mergeOptionsIn(options);
        }
        ConfigurationWithDefaults.prototype.getEditorOptions = function () {
            return this._editor;
        };
        ConfigurationWithDefaults.prototype._mergeOptionsIn = function (newOptions) {
            this._editor = Objects.mixin(this._editor, newOptions || {});
        };
        ConfigurationWithDefaults.prototype.updateOptions = function (newOptions) {
            // Apply new options
            this._mergeOptionsIn(newOptions);
        };
        return ConfigurationWithDefaults;
    })();
    exports.ConfigurationWithDefaults = ConfigurationWithDefaults;
    var InternalEditorOptionsHelper = (function () {
        function InternalEditorOptionsHelper() {
        }
        InternalEditorOptionsHelper.createInternalEditorOptions = function (outerWidth, outerHeight, opts, editorClassName, requestedFontFamily, requestedFontSize, requestedLineHeight, adjustedLineHeight, themeOpts, isDominatedByLongLines, lineCount, indentationOptions) {
            var wrappingColumn = toInteger(opts.wrappingColumn, -1);
            var stopLineTokenizationAfter;
            if (typeof opts.stopLineTokenizationAfter !== 'undefined') {
                stopLineTokenizationAfter = toInteger(opts.stopLineTokenizationAfter, -1);
            }
            else if (wrappingColumn >= 0) {
                stopLineTokenizationAfter = -1;
            }
            else {
                stopLineTokenizationAfter = 10000;
            }
            var stopRenderingLineAfter;
            if (typeof opts.stopRenderingLineAfter !== 'undefined') {
                stopRenderingLineAfter = toInteger(opts.stopRenderingLineAfter, -1);
            }
            else if (wrappingColumn >= 0) {
                stopRenderingLineAfter = -1;
            }
            else {
                stopRenderingLineAfter = 10000;
            }
            var mouseWheelScrollSensitivity = toFloat(opts.mouseWheelScrollSensitivity, 1);
            var scrollbar = this._sanitizeScrollbarOpts(opts.scrollbar, mouseWheelScrollSensitivity);
            var glyphMargin = toBoolean(opts.glyphMargin);
            var lineNumbers = opts.lineNumbers;
            var lineNumbersMinChars = toInteger(opts.lineNumbersMinChars, 1);
            var lineDecorationsWidth = toInteger(opts.lineDecorationsWidth, 0);
            var layoutInfo = editorLayoutProvider_1.EditorLayoutProvider.compute({
                outerWidth: outerWidth,
                outerHeight: outerHeight,
                showGlyphMargin: glyphMargin,
                lineHeight: themeOpts.lineHeight,
                showLineNumbers: !!lineNumbers,
                lineNumbersMinChars: lineNumbersMinChars,
                lineDecorationsWidth: lineDecorationsWidth,
                maxDigitWidth: themeOpts.maxDigitWidth,
                lineCount: lineCount,
                verticalScrollbarWidth: scrollbar.verticalScrollbarSize,
                horizontalScrollbarHeight: scrollbar.horizontalScrollbarSize,
                scrollbarArrowSize: scrollbar.arrowSize,
                verticalScrollbarHasArrows: scrollbar.verticalHasArrows
            });
            var pageSize = Math.floor(layoutInfo.height / themeOpts.lineHeight) - 2;
            if (isDominatedByLongLines && wrappingColumn > 0) {
                // Force viewport width wrapping if model is dominated by long lines
                wrappingColumn = 0;
            }
            var wrappingInfo;
            if (wrappingColumn === 0) {
                // If viewport width wrapping is enabled
                wrappingInfo = {
                    isViewportWrapping: true,
                    wrappingColumn: Math.max(1, Math.floor((layoutInfo.contentWidth - layoutInfo.verticalScrollbarWidth) / themeOpts.typicalHalfwidthCharacterWidth))
                };
            }
            else if (wrappingColumn > 0) {
                // Wrapping is enabled
                wrappingInfo = {
                    isViewportWrapping: false,
                    wrappingColumn: wrappingColumn
                };
            }
            else {
                wrappingInfo = {
                    isViewportWrapping: false,
                    wrappingColumn: -1
                };
            }
            return {
                // ---- Options that are transparent - get no massaging
                lineNumbers: lineNumbers,
                selectOnLineNumbers: toBoolean(opts.selectOnLineNumbers),
                glyphMargin: glyphMargin,
                revealHorizontalRightPadding: toInteger(opts.revealHorizontalRightPadding, 0),
                roundedSelection: toBoolean(opts.roundedSelection),
                theme: opts.theme,
                readOnly: toBoolean(opts.readOnly),
                scrollbar: scrollbar,
                overviewRulerLanes: toInteger(opts.overviewRulerLanes, 0, 3),
                cursorBlinking: opts.cursorBlinking,
                cursorStyle: opts.cursorStyle,
                fontLigatures: toBoolean(opts.fontLigatures),
                hideCursorInOverviewRuler: toBoolean(opts.hideCursorInOverviewRuler),
                scrollBeyondLastLine: toBoolean(opts.scrollBeyondLastLine),
                wrappingIndent: opts.wrappingIndent,
                wordWrapBreakBeforeCharacters: opts.wordWrapBreakBeforeCharacters,
                wordWrapBreakAfterCharacters: opts.wordWrapBreakAfterCharacters,
                wordWrapBreakObtrusiveCharacters: opts.wordWrapBreakObtrusiveCharacters,
                tabFocusMode: toBoolean(opts.tabFocusMode),
                stopLineTokenizationAfter: stopLineTokenizationAfter,
                stopRenderingLineAfter: stopRenderingLineAfter,
                longLineBoundary: toInteger(opts.longLineBoundary),
                forcedTokenizationBoundary: toInteger(opts.forcedTokenizationBoundary),
                hover: toBoolean(opts.hover),
                contextmenu: toBoolean(opts.contextmenu),
                quickSuggestions: toBoolean(opts.quickSuggestions),
                quickSuggestionsDelay: toInteger(opts.quickSuggestionsDelay),
                iconsInSuggestions: toBoolean(opts.iconsInSuggestions),
                autoClosingBrackets: toBoolean(opts.autoClosingBrackets),
                formatOnType: toBoolean(opts.formatOnType),
                suggestOnTriggerCharacters: toBoolean(opts.suggestOnTriggerCharacters),
                selectionHighlight: toBoolean(opts.selectionHighlight),
                outlineMarkers: toBoolean(opts.outlineMarkers),
                referenceInfos: toBoolean(opts.referenceInfos),
                renderWhitespace: toBoolean(opts.renderWhitespace),
                layoutInfo: layoutInfo,
                stylingInfo: {
                    editorClassName: editorClassName,
                    fontFamily: requestedFontFamily,
                    fontSize: requestedFontSize,
                    lineHeight: adjustedLineHeight
                },
                wrappingInfo: wrappingInfo,
                indentInfo: indentationOptions,
                observedOuterWidth: outerWidth,
                observedOuterHeight: outerHeight,
                lineHeight: themeOpts.lineHeight,
                pageSize: pageSize,
                typicalHalfwidthCharacterWidth: themeOpts.typicalHalfwidthCharacterWidth,
                typicalFullwidthCharacterWidth: themeOpts.typicalFullwidthCharacterWidth,
                fontSize: themeOpts.fontSize,
            };
        };
        InternalEditorOptionsHelper._sanitizeScrollbarOpts = function (raw, mouseWheelScrollSensitivity) {
            var horizontalScrollbarSize = toIntegerWithDefault(raw.horizontalScrollbarSize, 10);
            var verticalScrollbarSize = toIntegerWithDefault(raw.verticalScrollbarSize, 14);
            return {
                vertical: toStringSet(raw.vertical, ['auto', 'visible', 'hidden'], 'auto'),
                horizontal: toStringSet(raw.horizontal, ['auto', 'visible', 'hidden'], 'auto'),
                arrowSize: toIntegerWithDefault(raw.arrowSize, 11),
                useShadows: toBooleanWithDefault(raw.useShadows, true),
                verticalHasArrows: toBooleanWithDefault(raw.verticalHasArrows, false),
                horizontalHasArrows: toBooleanWithDefault(raw.horizontalHasArrows, false),
                horizontalScrollbarSize: horizontalScrollbarSize,
                horizontalSliderSize: toIntegerWithDefault(raw.horizontalSliderSize, horizontalScrollbarSize),
                verticalScrollbarSize: verticalScrollbarSize,
                verticalSliderSize: toIntegerWithDefault(raw.verticalSliderSize, verticalScrollbarSize),
                handleMouseWheel: toBooleanWithDefault(raw.handleMouseWheel, true),
                mouseWheelScrollSensitivity: mouseWheelScrollSensitivity
            };
        };
        InternalEditorOptionsHelper.createConfigurationChangedEvent = function (prevOpts, newOpts) {
            return {
                layoutInfo: (!editorLayoutProvider_1.EditorLayoutProvider.layoutEqual(prevOpts.layoutInfo, newOpts.layoutInfo)),
                stylingInfo: (!this._stylingInfoEqual(prevOpts.stylingInfo, newOpts.stylingInfo)),
                wrappingInfo: (!this._wrappingInfoEqual(prevOpts.wrappingInfo, newOpts.wrappingInfo)),
                indentInfo: (!this._indentInfoEqual(prevOpts.indentInfo, newOpts.indentInfo)),
                observedOuterWidth: (prevOpts.observedOuterWidth !== newOpts.observedOuterWidth),
                observedOuterHeight: (prevOpts.observedOuterHeight !== newOpts.observedOuterHeight),
                lineHeight: (prevOpts.lineHeight !== newOpts.lineHeight),
                pageSize: (prevOpts.pageSize !== newOpts.pageSize),
                typicalHalfwidthCharacterWidth: (prevOpts.typicalHalfwidthCharacterWidth !== newOpts.typicalHalfwidthCharacterWidth),
                typicalFullwidthCharacterWidth: (prevOpts.typicalFullwidthCharacterWidth !== newOpts.typicalFullwidthCharacterWidth),
                fontSize: (prevOpts.fontSize !== newOpts.fontSize),
                lineNumbers: (prevOpts.lineNumbers !== newOpts.lineNumbers),
                selectOnLineNumbers: (prevOpts.selectOnLineNumbers !== newOpts.selectOnLineNumbers),
                glyphMargin: (prevOpts.glyphMargin !== newOpts.glyphMargin),
                revealHorizontalRightPadding: (prevOpts.revealHorizontalRightPadding !== newOpts.revealHorizontalRightPadding),
                roundedSelection: (prevOpts.roundedSelection !== newOpts.roundedSelection),
                theme: (prevOpts.theme !== newOpts.theme),
                readOnly: (prevOpts.readOnly !== newOpts.readOnly),
                scrollbar: (!this._scrollbarOptsEqual(prevOpts.scrollbar, newOpts.scrollbar)),
                overviewRulerLanes: (prevOpts.overviewRulerLanes !== newOpts.overviewRulerLanes),
                cursorBlinking: (prevOpts.cursorBlinking !== newOpts.cursorBlinking),
                cursorStyle: (prevOpts.cursorStyle !== newOpts.cursorStyle),
                fontLigatures: (prevOpts.fontLigatures !== newOpts.fontLigatures),
                hideCursorInOverviewRuler: (prevOpts.hideCursorInOverviewRuler !== newOpts.hideCursorInOverviewRuler),
                scrollBeyondLastLine: (prevOpts.scrollBeyondLastLine !== newOpts.scrollBeyondLastLine),
                wrappingIndent: (prevOpts.wrappingIndent !== newOpts.wrappingIndent),
                wordWrapBreakBeforeCharacters: (prevOpts.wordWrapBreakBeforeCharacters !== newOpts.wordWrapBreakBeforeCharacters),
                wordWrapBreakAfterCharacters: (prevOpts.wordWrapBreakAfterCharacters !== newOpts.wordWrapBreakAfterCharacters),
                wordWrapBreakObtrusiveCharacters: (prevOpts.wordWrapBreakObtrusiveCharacters !== newOpts.wordWrapBreakObtrusiveCharacters),
                tabFocusMode: (prevOpts.tabFocusMode !== newOpts.tabFocusMode),
                stopLineTokenizationAfter: (prevOpts.stopLineTokenizationAfter !== newOpts.stopLineTokenizationAfter),
                stopRenderingLineAfter: (prevOpts.stopRenderingLineAfter !== newOpts.stopRenderingLineAfter),
                longLineBoundary: (prevOpts.longLineBoundary !== newOpts.longLineBoundary),
                forcedTokenizationBoundary: (prevOpts.forcedTokenizationBoundary !== newOpts.forcedTokenizationBoundary),
                hover: (prevOpts.hover !== newOpts.hover),
                contextmenu: (prevOpts.contextmenu !== newOpts.contextmenu),
                quickSuggestions: (prevOpts.quickSuggestions !== newOpts.quickSuggestions),
                quickSuggestionsDelay: (prevOpts.quickSuggestionsDelay !== newOpts.quickSuggestionsDelay),
                iconsInSuggestions: (prevOpts.iconsInSuggestions !== newOpts.iconsInSuggestions),
                autoClosingBrackets: (prevOpts.autoClosingBrackets !== newOpts.autoClosingBrackets),
                formatOnType: (prevOpts.formatOnType !== newOpts.formatOnType),
                suggestOnTriggerCharacters: (prevOpts.suggestOnTriggerCharacters !== newOpts.suggestOnTriggerCharacters),
                selectionHighlight: (prevOpts.selectionHighlight !== newOpts.selectionHighlight),
                outlineMarkers: (prevOpts.outlineMarkers !== newOpts.outlineMarkers),
                referenceInfos: (prevOpts.referenceInfos !== newOpts.referenceInfos)
            };
        };
        InternalEditorOptionsHelper._scrollbarOptsEqual = function (a, b) {
            return (a.arrowSize === b.arrowSize
                && a.vertical === b.vertical
                && a.horizontal === b.horizontal
                && a.useShadows === b.useShadows
                && a.verticalHasArrows === b.verticalHasArrows
                && a.horizontalHasArrows === b.horizontalHasArrows
                && a.handleMouseWheel === b.handleMouseWheel
                && a.horizontalScrollbarSize === b.horizontalScrollbarSize
                && a.horizontalSliderSize === b.horizontalSliderSize
                && a.verticalScrollbarSize === b.verticalScrollbarSize
                && a.verticalSliderSize === b.verticalSliderSize
                && a.mouseWheelScrollSensitivity === b.mouseWheelScrollSensitivity);
        };
        InternalEditorOptionsHelper._stylingInfoEqual = function (a, b) {
            return (a.editorClassName === b.editorClassName
                && a.fontFamily === b.fontFamily
                && a.fontSize === b.fontSize
                && a.lineHeight === b.lineHeight);
        };
        InternalEditorOptionsHelper._wrappingInfoEqual = function (a, b) {
            return (a.isViewportWrapping === b.isViewportWrapping
                && a.wrappingColumn === b.wrappingColumn);
        };
        InternalEditorOptionsHelper._indentInfoEqual = function (a, b) {
            return (a.insertSpaces === b.insertSpaces
                && a.tabSize === b.tabSize);
        };
        return InternalEditorOptionsHelper;
    })();
    function toBoolean(value) {
        return value === 'false' ? false : Boolean(value);
    }
    function toBooleanWithDefault(value, defaultValue) {
        if (typeof value === 'undefined') {
            return defaultValue;
        }
        return toBoolean(value);
    }
    function toFloat(source, defaultValue) {
        var r = parseFloat(source);
        if (isNaN(r)) {
            r = defaultValue;
        }
        return r;
    }
    function toInteger(source, minimum, maximum) {
        var r = parseInt(source, 10);
        if (isNaN(r)) {
            r = 0;
        }
        if (typeof minimum === 'number') {
            r = Math.max(minimum, r);
        }
        if (typeof maximum === 'number') {
            r = Math.min(maximum, r);
        }
        return r;
    }
    function toIntegerWithDefault(source, defaultValue) {
        if (typeof source === 'undefined') {
            return defaultValue;
        }
        return toInteger(source);
    }
    function toStringSet(source, allowedValues, defaultValue) {
        if (typeof source !== 'string') {
            return defaultValue;
        }
        if (allowedValues.indexOf(source) === -1) {
            return defaultValue;
        }
        return source;
    }
    var CommonEditorConfiguration = (function (_super) {
        __extends(CommonEditorConfiguration, _super);
        function CommonEditorConfiguration(options, indentationGuesser) {
            if (indentationGuesser === void 0) { indentationGuesser = null; }
            _super.call(this);
            this._onDidChange = this._register(new event_1.Emitter());
            this.onDidChange = this._onDidChange.event;
            this._configWithDefaults = new ConfigurationWithDefaults(options);
            this._indentationGuesser = indentationGuesser;
            this._cachedGuessedIndentationTabSize = -1;
            this._cachedGuessedIndentation = null;
            this._isDominatedByLongLines = false;
            this._lineCount = 1;
            this.handlerDispatcher = new handlerDispatcher_1.HandlerDispatcher();
            this.editor = this._computeInternalOptions();
        }
        CommonEditorConfiguration.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
        };
        CommonEditorConfiguration.prototype._recomputeOptions = function () {
            var oldOpts = this.editor;
            this.editor = this._computeInternalOptions();
            var changeEvent = InternalEditorOptionsHelper.createConfigurationChangedEvent(oldOpts, this.editor);
            var hasChanged = false;
            for (var key in changeEvent) {
                if (changeEvent.hasOwnProperty(key)) {
                    if (changeEvent[key]) {
                        hasChanged = true;
                        break;
                    }
                }
            }
            if (hasChanged) {
                this._onDidChange.fire(changeEvent);
            }
        };
        CommonEditorConfiguration.prototype.getRawOptions = function () {
            return this._configWithDefaults.getEditorOptions();
        };
        CommonEditorConfiguration.prototype._computeInternalOptions = function () {
            var _this = this;
            var opts = this._configWithDefaults.getEditorOptions();
            var editorClassName = this._getEditorClassName(opts.theme, toBoolean(opts.fontLigatures));
            var requestedFontFamily = opts.fontFamily || '';
            var requestedFontSize = toInteger(opts.fontSize, 0, 100);
            var requestedLineHeight = toInteger(opts.lineHeight, 0, 150);
            var adjustedLineHeight = requestedLineHeight;
            if (requestedFontSize > 0 && requestedLineHeight === 0) {
                adjustedLineHeight = Math.round(1.3 * requestedFontSize);
            }
            var indentationOptions = CommonEditorConfiguration._computeIndentationOptions(opts, function (tabSize) { return _this._guessIndentationOptionsCached(tabSize); });
            return InternalEditorOptionsHelper.createInternalEditorOptions(this.getOuterWidth(), this.getOuterHeight(), opts, editorClassName, requestedFontFamily, requestedFontSize, requestedLineHeight, adjustedLineHeight, this.readConfiguration(editorClassName, requestedFontFamily, requestedFontSize, adjustedLineHeight), this._isDominatedByLongLines, this._lineCount, indentationOptions);
        };
        CommonEditorConfiguration.prototype.updateOptions = function (newOptions) {
            this._configWithDefaults.updateOptions(newOptions);
            this._recomputeOptions();
        };
        CommonEditorConfiguration.prototype.setIsDominatedByLongLines = function (isDominatedByLongLines) {
            this._isDominatedByLongLines = isDominatedByLongLines;
            this._recomputeOptions();
        };
        CommonEditorConfiguration.prototype.setLineCount = function (lineCount) {
            this._lineCount = lineCount;
            this._recomputeOptions();
        };
        CommonEditorConfiguration.prototype.resetIndentationOptions = function () {
            this._cachedGuessedIndentationTabSize = -1;
            this._cachedGuessedIndentation = null;
            this._recomputeOptions();
        };
        CommonEditorConfiguration.prototype._guessIndentationOptionsCached = function (tabSize) {
            if (!this._cachedGuessedIndentation || this._cachedGuessedIndentationTabSize !== tabSize) {
                this._cachedGuessedIndentationTabSize = tabSize;
                if (this._indentationGuesser) {
                    this._cachedGuessedIndentation = this._indentationGuesser(tabSize);
                }
                else {
                    this._cachedGuessedIndentation = null;
                }
            }
            return this._cachedGuessedIndentation;
        };
        CommonEditorConfiguration._getValidatedIndentationOptions = function (opts) {
            var r = {
                tabSizeIsAuto: false,
                tabSize: 4,
                insertSpacesIsAuto: false,
                insertSpaces: true
            };
            if (opts.tabSize === 'auto') {
                r.tabSizeIsAuto = true;
            }
            else {
                r.tabSize = toInteger(opts.tabSize, 1, 20);
            }
            if (opts.insertSpaces === 'auto') {
                r.insertSpacesIsAuto = true;
            }
            else {
                r.insertSpaces = toBoolean(opts.insertSpaces);
            }
            return r;
        };
        CommonEditorConfiguration._computeIndentationOptions = function (allOpts, indentationGuesser) {
            var opts = this._getValidatedIndentationOptions(allOpts);
            var guessedIndentation = null;
            if (opts.tabSizeIsAuto || opts.insertSpacesIsAuto) {
                // We must use the indentation guesser to come up with the indentation options
                guessedIndentation = indentationGuesser(opts.tabSize);
            }
            var r = {
                insertSpaces: opts.insertSpaces,
                tabSize: opts.tabSize
            };
            if (guessedIndentation && opts.tabSizeIsAuto) {
                r.tabSize = guessedIndentation.tabSize;
            }
            if (guessedIndentation && opts.insertSpacesIsAuto) {
                r.insertSpaces = guessedIndentation.insertSpaces;
            }
            return r;
        };
        CommonEditorConfiguration.prototype.getIndentationOptions = function () {
            return this.editor.indentInfo;
        };
        CommonEditorConfiguration.prototype._normalizeIndentationFromWhitespace = function (str) {
            var indentation = this.getIndentationOptions(), spacesCnt = 0, i;
            for (i = 0; i < str.length; i++) {
                if (str.charAt(i) === '\t') {
                    spacesCnt += indentation.tabSize;
                }
                else {
                    spacesCnt++;
                }
            }
            var result = '';
            if (!indentation.insertSpaces) {
                var tabsCnt = Math.floor(spacesCnt / indentation.tabSize);
                spacesCnt = spacesCnt % indentation.tabSize;
                for (i = 0; i < tabsCnt; i++) {
                    result += '\t';
                }
            }
            for (i = 0; i < spacesCnt; i++) {
                result += ' ';
            }
            return result;
        };
        CommonEditorConfiguration.prototype.normalizeIndentation = function (str) {
            var firstNonWhitespaceIndex = Strings.firstNonWhitespaceIndex(str);
            if (firstNonWhitespaceIndex === -1) {
                firstNonWhitespaceIndex = str.length;
            }
            return this._normalizeIndentationFromWhitespace(str.substring(0, firstNonWhitespaceIndex)) + str.substring(firstNonWhitespaceIndex);
        };
        CommonEditorConfiguration.prototype.getOneIndent = function () {
            var indentation = this.getIndentationOptions();
            if (indentation.insertSpaces) {
                var result = '';
                for (var i = 0; i < indentation.tabSize; i++) {
                    result += ' ';
                }
                return result;
            }
            else {
                return '\t';
            }
        };
        return CommonEditorConfiguration;
    })(lifecycle_1.Disposable);
    exports.CommonEditorConfiguration = CommonEditorConfiguration;
    /**
     * Helper to update Monaco Editor Settings from configurations service.
     */
    var EditorConfiguration = (function () {
        function EditorConfiguration() {
        }
        EditorConfiguration.apply = function (config, editorOrArray) {
            if (!config) {
                return;
            }
            var editors = editorOrArray;
            if (!Array.isArray(editorOrArray)) {
                editors = [editorOrArray];
            }
            for (var i = 0; i < editors.length; i++) {
                var editor = editors[i];
                // Editor Settings (Code Editor, Diff, Terminal)
                if (editor && typeof editor.updateOptions === 'function') {
                    var type = editor.getEditorType();
                    if (type !== EditorCommon.EditorType.ICodeEditor && type !== EditorCommon.EditorType.IDiffEditor) {
                        continue;
                    }
                    var editorConfig = config[EditorConfiguration.EDITOR_SECTION];
                    if (type === EditorCommon.EditorType.IDiffEditor) {
                        var diffEditorConfig = config[EditorConfiguration.DIFF_EDITOR_SECTION];
                        if (diffEditorConfig) {
                            if (!editorConfig) {
                                editorConfig = diffEditorConfig;
                            }
                            else {
                                editorConfig = Objects.mixin(editorConfig, diffEditorConfig);
                            }
                        }
                    }
                    if (editorConfig) {
                        delete editorConfig.readOnly; // Prevent someone from making editor readonly
                        editor.updateOptions(editorConfig);
                    }
                }
            }
        };
        EditorConfiguration.EDITOR_SECTION = 'editor';
        EditorConfiguration.DIFF_EDITOR_SECTION = 'diffEditor';
        return EditorConfiguration;
    })();
    exports.EditorConfiguration = EditorConfiguration;
    var configurationRegistry = platform_1.Registry.as(ConfigurationRegistry.Extensions.Configuration);
    configurationRegistry.registerConfiguration({
        'id': 'editor',
        'order': 5,
        'type': 'object',
        'title': nls.localize('editorConfigurationTitle', "Editor configuration"),
        'properties': {
            'editor.fontFamily': {
                'type': 'string',
                'default': defaultConfig_1.DefaultConfig.editor.fontFamily,
                'description': nls.localize('fontFamily', "Controls the font family.")
            },
            'editor.fontSize': {
                'type': 'number',
                'default': defaultConfig_1.DefaultConfig.editor.fontSize,
                'description': nls.localize('fontSize', "Controls the font size.")
            },
            'editor.lineHeight': {
                'type': 'number',
                'default': defaultConfig_1.DefaultConfig.editor.lineHeight,
                'description': nls.localize('lineHeight', "Controls the line height.")
            },
            'editor.lineNumbers': {
                'type': 'boolean',
                'default': defaultConfig_1.DefaultConfig.editor.lineNumbers,
                'description': nls.localize('lineNumbers', "Controls visibility of line numbers")
            },
            'editor.glyphMargin': {
                'type': 'boolean',
                'default': defaultConfig_1.DefaultConfig.editor.glyphMargin,
                'description': nls.localize('glyphMargin', "Controls visibility of the glyph margin")
            },
            'editor.tabSize': {
                'oneOf': [
                    {
                        'type': 'number'
                    },
                    {
                        'type': 'string',
                        'enum': ['auto']
                    }
                ],
                'default': defaultConfig_1.DefaultConfig.editor.tabSize,
                'minimum': 1,
                'description': nls.localize('tabSize', "Controls the rendering size of tabs in characters. Accepted values: \"auto\", 2, 4, 6, etc. If set to \"auto\", the value will be guessed when a file is opened.")
            },
            'editor.insertSpaces': {
                'oneOf': [
                    {
                        'type': 'boolean'
                    },
                    {
                        'type': 'string',
                        'enum': ['auto']
                    }
                ],
                'default': defaultConfig_1.DefaultConfig.editor.insertSpaces,
                'description': nls.localize('insertSpaces', "Controls if the editor will insert spaces for tabs. Accepted values:  \"auto\", true, false. If set to \"auto\", the value will be guessed when a file is opened.")
            },
            'editor.roundedSelection': {
                'type': 'boolean',
                'default': defaultConfig_1.DefaultConfig.editor.roundedSelection,
                'description': nls.localize('roundedSelection', "Controls if selections have rounded corners")
            },
            'editor.scrollBeyondLastLine': {
                'type': 'boolean',
                'default': defaultConfig_1.DefaultConfig.editor.scrollBeyondLastLine,
                'description': nls.localize('scrollBeyondLastLine', "Controls if the editor will scroll beyond the last line")
            },
            'editor.wrappingColumn': {
                'type': 'integer',
                'default': defaultConfig_1.DefaultConfig.editor.wrappingColumn,
                'minimum': -1,
                'description': nls.localize('wrappingColumn', "Controls after how many characters the editor will wrap to the next line. Setting this to 0 turns on viewport width wrapping")
            },
            'editor.wrappingIndent': {
                'type': 'string',
                'enum': ['none', 'same', 'indent'],
                'default': defaultConfig_1.DefaultConfig.editor.wrappingIndent,
                'description': nls.localize('wrappingIndent', "Controls the indentation of wrapped lines. Can be one of 'none', 'same' or 'indent'.")
            },
            'editor.mouseWheelScrollSensitivity': {
                'type': 'number',
                'default': defaultConfig_1.DefaultConfig.editor.mouseWheelScrollSensitivity,
                'description': nls.localize('mouseWheelScrollSensitivity', "A multiplier to be used on the `deltaX` and `deltaY` of mouse wheel scroll events")
            },
            'editor.quickSuggestions': {
                'type': 'boolean',
                'default': defaultConfig_1.DefaultConfig.editor.quickSuggestions,
                'description': nls.localize('quickSuggestions', "Controls if quick suggestions should show up or not while typing")
            },
            'editor.quickSuggestionsDelay': {
                'type': 'integer',
                'default': defaultConfig_1.DefaultConfig.editor.quickSuggestionsDelay,
                'minimum': 0,
                'description': nls.localize('quickSuggestionsDelay', "Controls the delay in ms after which quick suggestions will show up")
            },
            'editor.autoClosingBrackets': {
                'type': 'boolean',
                'default': defaultConfig_1.DefaultConfig.editor.autoClosingBrackets,
                'description': nls.localize('autoClosingBrackets', "Controls if the editor should automatically close brackets after opening them")
            },
            'editor.formatOnType': {
                'type': 'boolean',
                'default': defaultConfig_1.DefaultConfig.editor.formatOnType,
                'description': nls.localize('formatOnType', "Controls if the editor should automatically format the line after typing")
            },
            'editor.suggestOnTriggerCharacters': {
                'type': 'boolean',
                'default': defaultConfig_1.DefaultConfig.editor.suggestOnTriggerCharacters,
                'description': nls.localize('suggestOnTriggerCharacters', "Controls if suggestions should automatically show up when typing trigger characters")
            },
            'editor.selectionHighlight': {
                'type': 'boolean',
                'default': defaultConfig_1.DefaultConfig.editor.selectionHighlight,
                'description': nls.localize('selectionHighlight', "Controls whether the editor should highlight similar matches to the selection")
            },
            //		'editor.outlineMarkers' : {
            //			'type': 'boolean',
            //			'default': DefaultConfig.editor.outlineMarkers,
            //			'description': nls.localize('outlineMarkers', "Controls whether the editor should draw horizontal lines before classes and methods")
            //		},
            'editor.overviewRulerLanes': {
                'type': 'integer',
                'default': 3,
                'description': nls.localize('overviewRulerLanes', "Controls the number of decorations that can show up at the same position in the overview ruler")
            },
            'editor.cursorBlinking': {
                'type': 'string',
                'enum': ['blink', 'visible', 'hidden'],
                'default': defaultConfig_1.DefaultConfig.editor.cursorBlinking,
                'description': nls.localize('cursorBlinking', "Controls the cursor blinking animation, accepted values are 'blink', 'visible', and 'hidden'")
            },
            'editor.cursorStyle': {
                'type': 'string',
                'enum': ['block', 'line'],
                'default': defaultConfig_1.DefaultConfig.editor.cursorStyle,
                'description': nls.localize('cursorStyle', "Controls the cursor style, accepted values are 'block' and 'line'")
            },
            'editor.fontLigatures': {
                'type': 'boolean',
                'default': defaultConfig_1.DefaultConfig.editor.fontLigatures,
                'description': nls.localize('fontLigatures', "Enables font ligatures")
            },
            'editor.hideCursorInOverviewRuler': {
                'type': 'boolean',
                'default': defaultConfig_1.DefaultConfig.editor.hideCursorInOverviewRuler,
                'description': nls.localize('hideCursorInOverviewRuler', "Controls if the cursor should be hidden in the overview ruler.")
            },
            'editor.renderWhitespace': {
                'type': 'boolean',
                default: defaultConfig_1.DefaultConfig.editor.renderWhitespace,
                description: nls.localize('renderWhitespace', "Controls whether the editor should render whitespace characters")
            },
            'editor.referenceInfos': {
                'type': 'boolean',
                'default': defaultConfig_1.DefaultConfig.editor.referenceInfos,
                'description': nls.localize('referenceInfos', "Controls if the editor shows reference information for the modes that support it")
            },
            'diffEditor.renderSideBySide': {
                'type': 'boolean',
                'default': true,
                'description': nls.localize('sideBySide', "Controls if the diff editor shows the diff side by side or inline")
            },
            'diffEditor.ignoreTrimWhitespace': {
                'type': 'boolean',
                'default': true,
                'description': nls.localize('ignoreTrimWhitespace', "Controls if the diff editor shows changes in leading or trailing whitespace as diffs")
            }
        }
    });
});
//# sourceMappingURL=commonEditorConfig.js.map