/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/base/common/collections', 'vs/languages/typescript/common/lib/typescriptServices', 'vs/languages/typescript/common/features/converter', 'vs/languages/typescript/common/features/previewer'], function (require, exports, collections, ts, converter, previewer) {
    function getWordAtOffset(text, offset) {
        var endOffset = offset;
        while (offset > 0 && /(-?\d*\.\d\w*)|([^\`\~\!\@\#\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s])/.test(text.charAt(offset - 1))) {
            offset -= 1;
        }
        return text.substring(offset, endOffset);
    }
    function suggestionHashFn(suggestion) {
        return suggestion.type + suggestion.label + suggestion.codeSnippet;
    }
    function computeSuggestions(languageService, resource, position, options) {
        var filename = resource.toString(), sourceFile = languageService.getSourceFile(filename), offset = converter.getOffset(sourceFile, position);
        // ask language service to complete at this offset
        var completions = languageService.getCompletionsAtPosition(filename, offset), suggestions = collections.createStringDictionary();
        if (completions) {
            for (var i = 0, len = completions.entries.length; i < len; i++) {
                var entry = completions.entries[i];
                collections.insert(suggestions, {
                    label: entry.name,
                    codeSnippet: entry.name,
                    type: monacoTypeFromEntryKind(entry.kind)
                }, suggestionHashFn);
            }
        }
        var fullText = sourceFile.getFullText();
        var currentWord = getWordAtOffset(fullText, offset);
        if (options.suggest.alwaysAllWords) {
            var words = fullText.split(/\W+/);
            for (var _i = 0; _i < words.length; _i++) {
                var word = words[_i];
                word = word.trim();
                if (word) {
                    collections.insert(suggestions, {
                        label: word,
                        codeSnippet: word,
                        type: 'text'
                    }, suggestionHashFn);
                }
            }
        }
        return {
            currentWord: currentWord,
            suggestions: collections.values(suggestions)
        };
    }
    exports.computeSuggestions = computeSuggestions;
    function getSuggestionDetails(languageService, resource, position, suggestion, options) {
        if (suggestion.type === 'snippet') {
            return suggestion;
        }
        var filename = resource.toString(), sourceFile = languageService.getSourceFile(filename), offset = converter.getOffset(sourceFile, position), details = languageService.getCompletionEntryDetails(filename, offset, suggestion.label);
        if (!details) {
            return suggestion;
        }
        suggestion.documentationLabel = previewer.plain(details.documentation);
        suggestion.typeLabel = previewer.plain(details.displayParts);
        suggestion.codeSnippet = details.name;
        if (options.suggest.useCodeSnippetsOnMethodSuggest && monacoTypeFromEntryKind(details.kind) === 'function') {
            var codeSnippet = details.name, suggestionArgumentNames;
            suggestionArgumentNames = details.displayParts
                .filter(function (part) { return part.kind === 'parameterName'; })
                .map(function (part) { return ("{{" + part.text + "}}"); });
            if (suggestionArgumentNames.length > 0) {
                codeSnippet += '(' + suggestionArgumentNames.join(', ') + '){{}}';
            }
            else {
                codeSnippet += '()';
            }
            suggestion.codeSnippet = codeSnippet;
        }
        return suggestion;
    }
    exports.getSuggestionDetails = getSuggestionDetails;
    function monacoTypeFromEntryKind(kind) {
        switch (kind) {
            case ts.ScriptElementKind.primitiveType:
            case ts.ScriptElementKind.keyword:
                return 'keyword';
            case ts.ScriptElementKind.variableElement:
            case ts.ScriptElementKind.localVariableElement:
            case ts.ScriptElementKind.memberVariableElement:
            case ts.ScriptElementKind.memberGetAccessorElement:
            case ts.ScriptElementKind.memberSetAccessorElement:
                return 'field';
            case ts.ScriptElementKind.functionElement:
            case ts.ScriptElementKind.memberFunctionElement:
            case ts.ScriptElementKind.constructSignatureElement:
            case ts.ScriptElementKind.callSignatureElement:
                return 'function';
        }
        return kind;
    }
});
//# sourceMappingURL=suggestions.js.map