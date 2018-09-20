"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
var ViewColumn;
(function (ViewColumn) {
    /**
     * A *symbolic* editor column representing the currently
     * active column. This value can be used when opening editors, but the
     * *resolved* [viewColumn](#TextEditor.viewColumn)-value of editors will always
     * be `One`, `Two`, `Three`, or `undefined` but never `Active`.
     */
    ViewColumn[ViewColumn["Active"] = -1] = "Active";
    /**
     * The left most editor column.
     */
    ViewColumn[ViewColumn["One"] = 1] = "One";
    /**
     * The center editor column.
     */
    ViewColumn[ViewColumn["Two"] = 2] = "Two";
    /**
     * The right most editor column.
     */
    ViewColumn[ViewColumn["Three"] = 3] = "Three";
})(ViewColumn = exports.ViewColumn || (exports.ViewColumn = {}));
/**
 * The configuration target
 */
var ConfigurationTarget;
(function (ConfigurationTarget) {
    /**
     * Global configuration
    */
    ConfigurationTarget[ConfigurationTarget["Global"] = 1] = "Global";
    /**
     * Workspace configuration
     */
    ConfigurationTarget[ConfigurationTarget["Workspace"] = 2] = "Workspace";
    /**
     * Workspace folder configuration
     */
    ConfigurationTarget[ConfigurationTarget["WorkspaceFolder"] = 3] = "WorkspaceFolder";
})(ConfigurationTarget = exports.ConfigurationTarget || (exports.ConfigurationTarget = {}));
/**
 * Represents the alignment of status bar items.
 */
var StatusBarAlignment;
(function (StatusBarAlignment) {
    /**
     * Aligned to the left side.
     */
    StatusBarAlignment[StatusBarAlignment["Left"] = 1] = "Left";
    /**
     * Aligned to the right side.
     */
    StatusBarAlignment[StatusBarAlignment["Right"] = 2] = "Right";
})(StatusBarAlignment = exports.StatusBarAlignment || (exports.StatusBarAlignment = {}));
/**
 * Represents an end of line character sequence in a [document](#TextDocument).
 */
var EndOfLine;
(function (EndOfLine) {
    /**
     * The line feed `\n` character.
     */
    EndOfLine[EndOfLine["LF"] = 1] = "LF";
    /**
     * The carriage return line feed `\r\n` sequence.
     */
    EndOfLine[EndOfLine["CRLF"] = 2] = "CRLF";
})(EndOfLine = exports.EndOfLine || (exports.EndOfLine = {}));

//# sourceMappingURL=vscodeAdapter.js.map
