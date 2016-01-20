/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/languages/typescript/common/lib/typescriptServices'], function (require, exports, ts) {
    var CompilerHost = (function () {
        function CompilerHost() {
            this._data = Object.create(null);
        }
        CompilerHost.prototype.add = function (filename, contents) {
            this._data[filename] = contents;
            return this;
        };
        CompilerHost.prototype.getSourceFile = function (filename, languageVersion, onError) {
            return this._data[filename]
                ? ts.createSourceFile(filename, this._data[filename], 1 /* ES5 */)
                : null;
        };
        CompilerHost.prototype.getDefaultLibFileName = function () {
            return '';
        };
        CompilerHost.prototype.writeFile = function (filename, data, writeByteOrderMark, onError) {
            //
        };
        CompilerHost.prototype.getCurrentDirectory = function () {
            return '';
        };
        CompilerHost.prototype.getCanonicalFileName = function (fileName) {
            return fileName;
        };
        CompilerHost.prototype.useCaseSensitiveFileNames = function () {
            return false;
        };
        CompilerHost.prototype.getNewLine = function () {
            return '\n';
        };
        return CompilerHost;
    })();
    exports.CompilerHost = CompilerHost;
    var LanguageServiceHost = (function () {
        function LanguageServiceHost() {
            this._compilationSettings = { noLib: true };
            this._data = Object.create(null);
        }
        LanguageServiceHost.prototype.add = function (fileName, contents, version, open) {
            if (version === void 0) { version = '1'; }
            if (open === void 0) { open = true; }
            this._data[fileName] = {
                filename: fileName,
                version: version,
                open: open,
                snapshot: ts.ScriptSnapshot.fromString(contents)
            };
            return this;
        };
        LanguageServiceHost.prototype.log = function (s) {
            // nothing
        };
        LanguageServiceHost.prototype.getCompilationSettings = function () {
            return this._compilationSettings;
        };
        LanguageServiceHost.prototype.getScriptFileNames = function () {
            return Object.keys(this._data);
        };
        LanguageServiceHost.prototype.getScriptVersion = function (fileName) {
            return this._data[fileName].version;
        };
        LanguageServiceHost.prototype.getScriptIsOpen = function (fileName) {
            return this._data[fileName].open;
        };
        LanguageServiceHost.prototype.getScriptSnapshot = function (fileName) {
            var container = this._data[fileName];
            return container ? container.snapshot : undefined;
        };
        LanguageServiceHost.prototype.getLocalizedDiagnosticMessages = function () {
            return null;
        };
        LanguageServiceHost.prototype.getCancellationToken = function () {
            return null;
        };
        LanguageServiceHost.prototype.getCurrentDirectory = function () {
            return '';
        };
        LanguageServiceHost.prototype.getDefaultLibFileName = function () {
            return null;
        };
        return LanguageServiceHost;
    })();
    exports.LanguageServiceHost = LanguageServiceHost;
});
//# sourceMappingURL=utils.js.map