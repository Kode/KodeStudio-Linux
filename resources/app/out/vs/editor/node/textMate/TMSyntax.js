/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
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
define(["require", "exports", 'vs/nls', 'vs/base/common/paths', 'vs/base/common/errors', 'vs/editor/common/modes', 'vs/editor/common/modes/supports', 'vs/base/common/collections', 'vscode-textmate', 'vs/editor/common/modes/TMState', 'vs/editor/common/services/modeService', 'vs/platform/plugins/common/pluginsRegistry', 'vs/editor/common/modes/languageExtensionPoint'], function (require, exports, nls, paths, errors, Modes, supports, collections, textMate, TMState, modeService_1, pluginsRegistry_1, languageExtensionPoint_1) {
    var grammarsExtPoint = pluginsRegistry_1.PluginsRegistry.registerExtensionPoint('grammars', {
        description: nls.localize('vscode.extension.contributes.grammars', 'Contributes textmate tokenizers.'),
        type: 'array',
        default: [{ id: '', extensions: [] }],
        items: {
            type: 'object',
            default: { language: '{{id}}', scopeName: 'source.{{id}}', path: './syntaxes/{{id}}.tmLanguage.' },
            properties: {
                language: {
                    description: nls.localize('vscode.extension.contributes.grammars.language', 'Language id for which this syntax is contributed to.'),
                    type: 'string'
                },
                scopeName: {
                    description: nls.localize('vscode.extension.contributes.grammars.scopeName', 'Textmate scope name used by the tmLanguage file.'),
                    type: 'string'
                },
                path: {
                    description: nls.localize('vscode.extension.contributes.grammars.path', 'Path of the tmLanguage file. The path is relative to the extension folder and typically starts with \'./syntaxes/\'.'),
                    type: 'string'
                }
            }
        }
    });
    var MainProcessTextMateSyntax = (function () {
        function MainProcessTextMateSyntax(modeService) {
            var _this = this;
            this._modeService = modeService;
            this._grammarRegistry = new textMate.Registry({
                getFilePath: function (scopeName) {
                    return _this._scopeNameToFilePath[scopeName];
                }
            });
            this._scopeNameToFilePath = {};
            grammarsExtPoint.setHandler(function (extensions) {
                for (var i = 0; i < extensions.length; i++) {
                    var grammars = extensions[i].value;
                    for (var j = 0; j < grammars.length; j++) {
                        _this._handleGrammarExtensionPointUser(extensions[i].description.extensionFolderPath, grammars[j], extensions[i].collector);
                    }
                }
            });
        }
        MainProcessTextMateSyntax.prototype._handleGrammarExtensionPointUser = function (extensionFolderPath, syntax, collector) {
            var _this = this;
            if (syntax.language && ((typeof syntax.language !== 'string') || !languageExtensionPoint_1.LanguageExtensions.isRegisteredMode(syntax.language))) {
                collector.error(nls.localize('invalid.language', "Unknown language in `contributes.{0}.language`. Provided value: {1}", grammarsExtPoint.name, String(syntax.language)));
                return;
            }
            if (!syntax.scopeName || (typeof syntax.scopeName !== 'string')) {
                collector.error(nls.localize('invalid.scopeName', "Expected string in `contributes.{0}.scopeName`. Provided value: {1}", grammarsExtPoint.name, String(syntax.scopeName)));
                return;
            }
            if (!syntax.path || (typeof syntax.path !== 'string')) {
                collector.error(nls.localize('invalid.path.0', "Expected string in `contributes.{0}.path`. Provided value: {1}", grammarsExtPoint.name, String(syntax.path)));
                return;
            }
            var normalizedAbsolutePath = paths.normalize(paths.join(extensionFolderPath, syntax.path));
            if (normalizedAbsolutePath.indexOf(extensionFolderPath) !== 0) {
                collector.warn(nls.localize('invalid.path.1', "Expected `contributes.{0}.path` ({1}) to be included inside extension's folder ({2}). This might make the extension non-portable.", grammarsExtPoint.name, normalizedAbsolutePath, extensionFolderPath));
            }
            this._scopeNameToFilePath[syntax.scopeName] = normalizedAbsolutePath;
            var modeId = syntax.language;
            if (modeId) {
                pluginsRegistry_1.PluginsRegistry.registerOneTimeActivationEventListener('onLanguage:' + modeId, function () {
                    _this.registerDefinition(modeId, syntax.scopeName);
                });
            }
        };
        MainProcessTextMateSyntax.prototype.registerDefinition = function (modeId, scopeName) {
            var _this = this;
            this._grammarRegistry.loadGrammar(scopeName, function (err, grammar) {
                if (err) {
                    errors.onUnexpectedError(err);
                    return;
                }
                _this._modeService.registerTokenizationSupport(modeId, function (mode) {
                    return createTokenizationSupport(mode, grammar);
                });
            });
        };
        MainProcessTextMateSyntax = __decorate([
            __param(0, modeService_1.IModeService)
        ], MainProcessTextMateSyntax);
        return MainProcessTextMateSyntax;
    })();
    exports.MainProcessTextMateSyntax = MainProcessTextMateSyntax;
    function createTokenizationSupport(mode, grammar) {
        var tokenizer = new Tokenizer(mode.getId(), grammar);
        return {
            shouldGenerateEmbeddedModels: false,
            getInitialState: function () { return new TMState.TMState(mode, null, null); },
            tokenize: function (line, state, offsetDelta, stopAtOffset) { return tokenizer.tokenize(line, state, offsetDelta, stopAtOffset); }
        };
    }
    var Tokenizer = (function () {
        function Tokenizer(modeId, grammar) {
            this._modeId = modeId;
            this._grammar = grammar;
        }
        Tokenizer.prototype.tokenize = function (line, state, offsetDelta, stopAtOffset) {
            if (offsetDelta === void 0) { offsetDelta = 0; }
            if (line.length >= 20000) {
                return {
                    tokens: [{
                            startIndex: offsetDelta,
                            type: '',
                            bracket: Modes.Bracket.None
                        }],
                    actualStopOffset: offsetDelta,
                    endState: state,
                    modeTransitions: [{ startIndex: offsetDelta, mode: state.getMode() }],
                };
            }
            var freshState = state.clone();
            var textMateResult = this._grammar.tokenizeLine(line, freshState.getRuleStack());
            freshState.setRuleStack(textMateResult.ruleStack);
            // Create the result early and fill in the tokens later
            var ret = {
                tokens: [],
                actualStopOffset: offsetDelta + line.length,
                endState: freshState,
                modeTransitions: [{ startIndex: offsetDelta, mode: freshState.getMode() }],
            };
            var noBracket = Modes.Bracket.None, openBracket = Modes.Bracket.Open, closeBracket = Modes.Bracket.Close;
            for (var tokenIndex = 0, len = textMateResult.tokens.length; tokenIndex < len; tokenIndex++) {
                var token = textMateResult.tokens[tokenIndex];
                var tokenStartIndex = token.startIndex;
                var tokenEndIndex = (tokenIndex + 1 < len ? textMateResult.tokens[tokenIndex + 1].startIndex : line.length);
                var t = decodeTextMateToken(this._modeId, token);
                if (t.isOpaqueToken) {
                    // Should not do any smartness to detect brackets on this token
                    ret.tokens.push(new supports.Token(tokenStartIndex + offsetDelta, t.tokenType, noBracket));
                    continue;
                }
                var i = void 0, charCode = void 0, isBracket = void 0, bracketType = void 0;
                for (i = tokenStartIndex; i < tokenEndIndex; i++) {
                    charCode = line.charCodeAt(i);
                    isBracket = null;
                    bracketType = noBracket;
                    switch (charCode) {
                        case _openParen:
                            isBracket = 'delimiter.paren';
                            bracketType = openBracket;
                            break;
                        case _closeParen:
                            isBracket = 'delimiter.paren';
                            bracketType = closeBracket;
                            break;
                        case _openCurly:
                            isBracket = 'delimiter.curly';
                            bracketType = openBracket;
                            break;
                        case _closeCurly:
                            isBracket = 'delimiter.curly';
                            bracketType = closeBracket;
                            break;
                        case _openSquare:
                            isBracket = 'delimiter.square';
                            bracketType = openBracket;
                            break;
                        case _closeSquare:
                            isBracket = 'delimiter.square';
                            bracketType = closeBracket;
                            break;
                    }
                    if (isBracket) {
                        if (tokenStartIndex < i) {
                            // push a token before character `i`
                            ret.tokens.push(new supports.Token(tokenStartIndex + offsetDelta, t.tokenType, noBracket));
                            tokenStartIndex = i;
                        }
                        // push character `i` as a token
                        ret.tokens.push(new supports.Token(tokenStartIndex + offsetDelta, isBracket + '.' + t.modeToken, bracketType));
                        tokenStartIndex = i + 1;
                    }
                }
                if (tokenStartIndex < tokenEndIndex) {
                    // push the remaining text as a token
                    ret.tokens.push(new supports.Token(tokenStartIndex + offsetDelta, t.tokenType, noBracket));
                }
            }
            return ret;
        };
        return Tokenizer;
    })();
    function decodeTextMateToken(modeId, entry) {
        var tokenTypeArray = [];
        for (var level = 1; level < entry.scopes.length; ++level) {
            tokenTypeArray = tokenTypeArray.concat(entry.scopes[level].split('.'));
        }
        var modeToken = '';
        if (entry.scopes.length > 0) {
            var dotIndex = entry.scopes[0].lastIndexOf('.');
            if (dotIndex >= 0) {
                modeToken = entry.scopes[0].substr(dotIndex + 1);
            }
        }
        var tokenTypes = [];
        var isOpaqueToken = dedupTokens(tokenTypeArray, modeToken, tokenTypes);
        return {
            isOpaqueToken: isOpaqueToken,
            tokenType: tokenTypes.join('.'),
            modeToken: modeId
        };
    }
    /**
     * Remove duplicate entries, collect result in `result`, place `modeToken` at the end
     * and detect if this is a comment => return true if it looks like a comment
     */
    function dedupTokens(tokenTypeArray, modeToken, result) {
        tokenTypeArray.sort();
        var prev = null, curr = null, isOpaqueToken = false;
        for (var i = 0, len = tokenTypeArray.length; i < len; i++) {
            prev = curr;
            curr = tokenTypeArray[i];
            if (curr === prev || curr === modeToken) {
                continue;
            }
            result.push(curr);
            if (!isOpaqueToken && (curr === 'comment' || curr === 'string' || curr === 'regexp')) {
                isOpaqueToken = true;
            }
        }
        result.push(modeToken);
        return isOpaqueToken;
    }
    var _openParen = '('.charCodeAt(0);
    var _closeParen = ')'.charCodeAt(0);
    var _openCurly = '{'.charCodeAt(0);
    var _closeCurly = '}'.charCodeAt(0);
    var _openSquare = '['.charCodeAt(0);
    var _closeSquare = ']'.charCodeAt(0);
    var characterToBracket = collections.createNumberDictionary();
    characterToBracket['('.charCodeAt(0)] = Modes.Bracket.Open;
    characterToBracket[')'.charCodeAt(0)] = Modes.Bracket.Close;
    characterToBracket['{'.charCodeAt(0)] = Modes.Bracket.Open;
    characterToBracket['}'.charCodeAt(0)] = Modes.Bracket.Close;
    characterToBracket['['.charCodeAt(0)] = Modes.Bracket.Open;
    characterToBracket[']'.charCodeAt(0)] = Modes.Bracket.Close;
});
//# sourceMappingURL=TMSyntax.js.map