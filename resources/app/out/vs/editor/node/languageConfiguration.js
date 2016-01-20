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
define(["require", "exports", 'vs/editor/common/services/modeService', 'vs/editor/common/modes/languageExtensionPoint', 'vs/platform/plugins/common/pluginsRegistry', 'vs/base/node/pfs', 'vs/base/common/json'], function (require, exports, modeService_1, languageExtensionPoint_1, pluginsRegistry_1, pfs, json) {
    var LanguageConfigurationFileHandler = (function () {
        function LanguageConfigurationFileHandler(modeService) {
            var _this = this;
            this._modeService = modeService;
            languageExtensionPoint_1.LanguageExtensions.getRegisteredModes().forEach(function (modeId) { return _this._handleMode(modeId); });
            languageExtensionPoint_1.LanguageExtensions.onDidAddMode(function (modeId) { return _this._handleMode(modeId); });
        }
        LanguageConfigurationFileHandler.prototype._handleMode = function (modeId) {
            var _this = this;
            var activationEvent = 'onLanguage:' + modeId;
            pluginsRegistry_1.PluginsRegistry.registerOneTimeActivationEventListener(activationEvent, function () {
                var configurationFiles = languageExtensionPoint_1.LanguageExtensions.getConfigurationFiles(modeId);
                configurationFiles.forEach(function (configFilePath) { return _this._handleConfigFile(modeId, configFilePath); });
            });
        };
        LanguageConfigurationFileHandler.prototype._handleConfigFile = function (modeId, configFilePath) {
            var _this = this;
            pfs.readFile(configFilePath).then(function (fileContents) {
                var errors = [];
                var configuration = json.parse(fileContents.toString(), errors);
                if (errors.length) {
                    console.error("Errors parsing " + configFilePath + ": " + errors.join('\n'));
                }
                _this._handleConfig(modeId, configuration);
            }, function (err) {
                console.error(err);
            });
        };
        LanguageConfigurationFileHandler.prototype._handleConfig = function (modeId, configuration) {
            if (configuration.comments) {
                var comments = configuration.comments;
                var contrib = { commentsConfiguration: {} };
                if (comments.lineComment) {
                    contrib.commentsConfiguration.lineCommentTokens = [comments.lineComment];
                }
                if (comments.blockComment) {
                    contrib.commentsConfiguration.blockCommentStartToken = comments.blockComment[0];
                    contrib.commentsConfiguration.blockCommentEndToken = comments.blockComment[1];
                }
                this._modeService.registerDeclarativeCommentsSupport(modeId, contrib);
            }
            if (configuration.brackets) {
                var brackets = configuration.brackets;
                var onEnterContrib = {};
                onEnterContrib.brackets = brackets.map(function (pair) {
                    var open = pair[0], close = pair[1];
                    return { open: open, close: close };
                });
                this._modeService.registerDeclarativeOnEnterSupport(modeId, onEnterContrib);
                var characterPairContrib = {
                    autoClosingPairs: brackets.map(function (pair) {
                        var open = pair[0], close = pair[1];
                        return { open: open, close: close };
                    })
                };
                this._modeService.registerDeclarativeCharacterPairSupport(modeId, characterPairContrib);
            }
            // TMSyntax hard-codes these and tokenizes them as brackets
            this._modeService.registerDeclarativeElectricCharacterSupport(modeId, {
                brackets: [
                    { tokenType: 'delimiter.curly.' + modeId, open: '{', close: '}', isElectric: true },
                    { tokenType: 'delimiter.square.' + modeId, open: '[', close: ']', isElectric: true },
                    { tokenType: 'delimiter.paren.' + modeId, open: '(', close: ')', isElectric: true }
                ]
            });
        };
        LanguageConfigurationFileHandler = __decorate([
            __param(0, modeService_1.IModeService)
        ], LanguageConfigurationFileHandler);
        return LanguageConfigurationFileHandler;
    })();
    exports.LanguageConfigurationFileHandler = LanguageConfigurationFileHandler;
});
//# sourceMappingURL=languageConfiguration.js.map