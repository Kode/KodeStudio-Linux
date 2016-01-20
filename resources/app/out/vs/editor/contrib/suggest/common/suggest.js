/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/base/common/async', 'vs/base/common/winjs.base', 'vs/base/common/errors', 'vs/editor/common/modes/languageFeatureRegistry', 'vs/editor/common/editorCommonExtensions', 'vs/editor/common/modes/modesRegistry'], function (require, exports, async_1, winjs_base_1, errors_1, languageFeatureRegistry_1, editorCommonExtensions_1, modesRegistry_1) {
    exports.CONTEXT_SUGGEST_WIDGET_VISIBLE = 'suggestWidgetVisible';
    exports.CONTEXT_SUGGESTION_SUPPORTS_ACCEPT_ON_KEY = 'suggestionSupportsAcceptOnKey';
    exports.ACCEPT_SELECTED_SUGGESTION_CMD = 'acceptSelectedSuggestion';
    exports.SuggestRegistry = new languageFeatureRegistry_1.default('suggestSupport');
    function suggest(model, position, triggerCharacter, groups) {
        if (!groups) {
            groups = exports.SuggestRegistry.orderedGroups(model);
        }
        var resource = model.getAssociatedResource();
        var suggestions = [];
        var factory = groups.map(function (supports, index) {
            return function () {
                // stop as soon as a group produced a result
                if (suggestions.length > 0) {
                    return;
                }
                // for each support in the group ask for suggestions
                var promises = supports.map(function (support) {
                    return support.suggest(resource, position, triggerCharacter).then(function (values) {
                        var result = [];
                        for (var _i = 0; _i < values.length; _i++) {
                            var suggestResult = values[_i];
                            if (!suggestResult
                                || !Array.isArray(suggestResult.suggestions)
                                || suggestResult.suggestions.length === 0) {
                                continue;
                            }
                            result.push({
                                support: support,
                                currentWord: suggestResult.currentWord,
                                incomplete: suggestResult.incomplete,
                                suggestions: suggestResult.suggestions
                            });
                        }
                        return result;
                    }, errors_1.onUnexpectedError);
                });
                return winjs_base_1.TPromise.join(promises).then(function (values) {
                    for (var _i = 0; _i < values.length; _i++) {
                        var value = values[_i];
                        if (Array.isArray(value) && value.length > 0) {
                            suggestions.push(value);
                        }
                    }
                });
            };
        });
        return async_1.sequence(factory).then(function () {
            // add snippets to the first group
            var snippets = modesRegistry_1.getSnippets(model, position);
            if (suggestions.length === 0) {
                suggestions.push([snippets]);
            }
            else {
                suggestions[0].push(snippets);
            }
            return suggestions;
        });
    }
    exports.suggest = suggest;
    editorCommonExtensions_1.CommonEditorRegistry.registerDefaultLanguageCommand('_executeCompletionItemProvider', function (model, position, args) {
        var triggerCharacter = args['triggerCharacter'];
        if (typeof triggerCharacter !== 'undefined' && typeof triggerCharacter !== 'string') {
            throw errors_1.illegalArgument('triggerCharacter');
        }
        return suggest(model, position, triggerCharacter);
    });
});
//# sourceMappingURL=suggest.js.map