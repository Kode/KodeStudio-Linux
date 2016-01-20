/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/editor/common/modes/languageExtensionPoint', 'vs/base/common/strings', 'vs/platform/platform', 'vs/platform/instantiation/common/descriptors'], function (require, exports, languageExtensionPoint_1, Strings, platform_1, descriptors_1) {
    // Define extension point ids
    exports.Extensions = {
        EditorModes: 'editor.modes'
    };
    var EditorModesRegistry = (function () {
        function EditorModesRegistry() {
            this.workerParticipants = [];
        }
        // --- worker participants registration
        EditorModesRegistry.prototype.registerWorkerParticipant = function (modeId, descriptor) {
            this.workerParticipants.push({
                modeId: modeId,
                descriptor: descriptor
            });
        };
        EditorModesRegistry.prototype._getAllWorkerParticipants = function () {
            return this.workerParticipants;
        };
        EditorModesRegistry.prototype._setWorkerParticipants = function (participants) {
            this.workerParticipants = participants;
        };
        EditorModesRegistry.prototype.getWorkerParticipants = function (modeId) {
            return this.workerParticipants.filter(function (p) { return p.modeId === modeId; }).map(function (p) { return p.descriptor; });
        };
        // --- modes registration
        EditorModesRegistry.prototype.isRegisteredMode = function (mimetypeOrModeId) {
            return languageExtensionPoint_1.LanguageExtensions.isRegisteredMode(mimetypeOrModeId);
        };
        EditorModesRegistry.prototype.getRegisteredModes = function () {
            return languageExtensionPoint_1.LanguageExtensions.getRegisteredModes();
        };
        EditorModesRegistry.prototype.getRegisteredMimetypes = function () {
            return languageExtensionPoint_1.LanguageExtensions.getRegisteredMimetypes();
        };
        EditorModesRegistry.prototype.getRegisteredLanguageNames = function () {
            return languageExtensionPoint_1.LanguageExtensions.getRegisteredLanguageNames();
        };
        EditorModesRegistry.prototype.getExtensions = function (alias) {
            return languageExtensionPoint_1.LanguageExtensions.getExtensions(alias);
        };
        EditorModesRegistry.prototype.getMimeForMode = function (modeId) {
            return languageExtensionPoint_1.LanguageExtensions.getMimeForMode(modeId);
        };
        EditorModesRegistry.prototype.getLanguageName = function (modeId) {
            return languageExtensionPoint_1.LanguageExtensions.getLanguageName(modeId);
        };
        EditorModesRegistry.prototype.getModeIdForLanguageName = function (alias) {
            return languageExtensionPoint_1.LanguageExtensions.getModeIdForLanguageNameLowercase(alias);
        };
        EditorModesRegistry.prototype.registerMode = function (def) {
            languageExtensionPoint_1.LanguageExtensions.registerCompatMode(def);
        };
        EditorModesRegistry.prototype.getModeId = function (commaSeparatedMimetypesOrCommaSeparatedIds) {
            var modeIds = languageExtensionPoint_1.LanguageExtensions.extractModeIds(commaSeparatedMimetypesOrCommaSeparatedIds);
            if (modeIds.length > 0) {
                return modeIds[0];
            }
            return null;
        };
        return EditorModesRegistry;
    })();
    var mR = new EditorModesRegistry();
    platform_1.Registry.add(exports.Extensions.EditorModes, mR);
    function registerMode(def) {
        mR.registerMode(def);
    }
    exports.registerMode = registerMode;
    function registerWorkerParticipant(modeId, moduleId, ctorName) {
        mR.registerWorkerParticipant(modeId, descriptors_1.createAsyncDescriptor0(moduleId, ctorName));
    }
    exports.registerWorkerParticipant = registerWorkerParticipant;
    // TODO@Martin: find a better home for this code:
    // TODO@Martin: modify suggestSupport to return a boolean if snippets should be presented or not
    //       and turn this into a real registry
    var _defaultSnippets = Object.create(null);
    var _snippets = Object.create(null);
    function registerDefaultSnippets(modeId, snippets) {
        _defaultSnippets[modeId] = (_defaultSnippets[modeId] || []).concat(snippets);
    }
    exports.registerDefaultSnippets = registerDefaultSnippets;
    function registerSnippets(modeId, path, snippets) {
        var snippetsByMode = _snippets[modeId];
        if (!snippetsByMode) {
            _snippets[modeId] = snippetsByMode = {};
        }
        snippetsByMode[path] = snippets;
    }
    exports.registerSnippets = registerSnippets;
    function getSnippets(model, position) {
        var word = model.getWordAtPosition(position);
        var currentPrefix = word ? word.word.substring(0, position.column - word.startColumn) : '';
        var result = {
            currentWord: currentPrefix,
            suggestions: []
        };
        // to avoid that snippets are too prominent in the intellisense proposals:
        // - force that the current prefix matches with the snippet prefix
        // if there's no prfix, only show snippets at the beginning of the line, or after a whitespace
        var filter = null;
        if (currentPrefix.length === 0) {
            if (position.column > 1) {
                var previousCharacter = model.getValueInRange({ startLineNumber: position.lineNumber, startColumn: position.column - 1, endLineNumber: position.lineNumber, endColumn: position.column });
                if (previousCharacter.trim().length !== 0) {
                    return result;
                }
            }
        }
        else {
            var lowerCasePrefix = currentPrefix.toLowerCase();
            filter = function (p) {
                return Strings.startsWith(p.label.toLowerCase(), lowerCasePrefix);
            };
        }
        var modeId = model.getMode().getId();
        var snippets = [];
        var snipppetsByMode = _snippets[modeId];
        if (snipppetsByMode) {
            for (var s in snipppetsByMode) {
                snippets = snippets.concat(snipppetsByMode[s]);
            }
        }
        var defaultSnippets = _defaultSnippets[modeId];
        if (defaultSnippets) {
            snippets = snippets.concat(defaultSnippets);
        }
        result.suggestions = filter ? snippets.filter(filter) : snippets;
        // if (result.suggestions.length > 0) {
        // 	if (word) {
        // 		// Push also the current word as first suggestion, to avoid unexpected snippet acceptance on Enter.
        // 		result.suggestions = result.suggestions.slice(0);
        // 		result.suggestions.unshift({
        // 			codeSnippet: word.word,
        // 			label: word.word,
        // 			type: 'text'
        // 		});
        // 	}
        // 	result.incomplete = true;
        // }
        return result;
    }
    exports.getSnippets = getSnippets;
});
//# sourceMappingURL=modesRegistry.js.map