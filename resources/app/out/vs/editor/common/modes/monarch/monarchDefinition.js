/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/base/common/winjs.base', 'vs/editor/common/modes/abstractMode'], function (require, exports, winjs_base_1, abstractMode_1) {
    function createCommentsSupport(lexer) {
        return {
            commentsConfiguration: {
                lineCommentTokens: [lexer.lineComment],
                blockCommentStartToken: lexer.blockCommentStart,
                blockCommentEndToken: lexer.blockCommentEnd
            }
        };
    }
    exports.createCommentsSupport = createCommentsSupport;
    function createBracketElectricCharacterContribution(lexer) {
        return {
            brackets: lexer.standardBrackets,
            regexBrackets: lexer.enhancedBrackets,
            caseInsensitive: lexer.ignoreCase,
            embeddedElectricCharacters: lexer.outdentTriggers.split('')
        };
    }
    exports.createBracketElectricCharacterContribution = createBracketElectricCharacterContribution;
    function createTokenTypeClassificationSupportContribution(lexer) {
        return {
            wordDefinition: lexer.wordDefinition
        };
    }
    exports.createTokenTypeClassificationSupportContribution = createTokenTypeClassificationSupportContribution;
    function createCharacterPairContribution(lexer) {
        return {
            autoClosingPairs: lexer.autoClosingPairs
        };
    }
    exports.createCharacterPairContribution = createCharacterPairContribution;
    function _addSuggestionsAtPosition(model, position, lexer, superSuggestions) {
        var extra = lexer.suggestSupport.snippets;
        if (!extra || extra.length === 0) {
            return superSuggestions;
        }
        if (!superSuggestions) {
            superSuggestions = [];
        }
        superSuggestions.push({
            currentWord: model.getWordUntilPosition(position).word,
            suggestions: extra.slice(0)
        });
        return superSuggestions;
    }
    function createOnEnterSupportOptions(lexer) {
        return {
            brackets: lexer.standardBrackets
        };
    }
    exports.createOnEnterSupportOptions = createOnEnterSupportOptions;
    function createSuggestSupport(modelService, mode, lexer) {
        if (lexer.suggestSupport.textualCompletions && mode instanceof abstractMode_1.AbstractMode) {
            return {
                triggerCharacters: lexer.suggestSupport.triggerCharacters,
                disableAutoTrigger: lexer.suggestSupport.disableAutoTrigger,
                excludeTokens: [],
                suggest: function (resource, position) { return mode.suggest(resource, position); },
                composeSuggest: function (resource, position, superSuggestions) {
                    return winjs_base_1.TPromise.as(_addSuggestionsAtPosition(modelService.getModel(resource), position, lexer, superSuggestions));
                }
            };
        }
        else {
            return {
                triggerCharacters: lexer.suggestSupport.triggerCharacters,
                disableAutoTrigger: lexer.suggestSupport.disableAutoTrigger,
                excludeTokens: [],
                suggest: function (resource, position) {
                    return winjs_base_1.TPromise.as(_addSuggestionsAtPosition(modelService.getModel(resource), position, lexer, null));
                },
                composeSuggest: function (resource, position, superSuggestions) {
                    return winjs_base_1.TPromise.as(superSuggestions);
                }
            };
        }
    }
    exports.createSuggestSupport = createSuggestSupport;
});
//# sourceMappingURL=monarchDefinition.js.map