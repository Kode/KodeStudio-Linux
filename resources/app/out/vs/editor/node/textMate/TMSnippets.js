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
define(["require", "exports", 'vs/nls', 'vs/editor/contrib/snippet/common/snippet', 'vs/base/common/json', 'vs/editor/common/modes/modesRegistry', 'vs/base/common/paths', 'vs/editor/common/services/modelService', 'vs/platform/plugins/common/pluginsRegistry', 'vs/editor/common/modes/languageExtensionPoint', 'vs/base/node/pfs'], function (require, exports, nls, snippets, json, modesExt, paths, modelService_1, pluginsRegistry_1, languageExtensionPoint_1, pfs) {
    function snippetUpdated(modeId, filePath) {
        return pfs.readFile(filePath).then(function (fileContents) {
            var errors = [];
            var snippets = json.parse(fileContents.toString(), errors);
            var adaptedSnippets = TMSnippetsAdaptor.adapt(snippets);
            modesExt.registerSnippets(modeId, filePath, adaptedSnippets);
        });
    }
    exports.snippetUpdated = snippetUpdated;
    var snippetsExtensionPoint = pluginsRegistry_1.PluginsRegistry.registerExtensionPoint('snippets', {
        description: nls.localize('vscode.extension.contributes.snippets', 'Contributes textmate snippets.'),
        type: 'array',
        default: [{ language: '', path: '' }],
        items: {
            type: 'object',
            default: { language: '{{id}}', path: './snippets/{{id}}.json.' },
            properties: {
                language: {
                    description: nls.localize('vscode.extension.contributes.snippets.language', 'Language id for which this snippet is contributed to.'),
                    type: 'string'
                },
                path: {
                    description: nls.localize('vscode.extension.contributes.snippets.path', 'Path of the snippets file. The path is relative to the extension folder and typically starts with \'./snippets/\'.'),
                    type: 'string'
                }
            }
        }
    });
    var MainProcessTextMateSnippet = (function () {
        function MainProcessTextMateSnippet(modelService) {
            var _this = this;
            this._modelService = modelService;
            snippetsExtensionPoint.setHandler(function (extensions) {
                for (var i = 0; i < extensions.length; i++) {
                    var tmSnippets = extensions[i].value;
                    for (var j = 0; j < tmSnippets.length; j++) {
                        _this._withTMSnippetContribution(extensions[i].description.extensionFolderPath, tmSnippets[j], extensions[i].collector);
                    }
                }
            });
        }
        MainProcessTextMateSnippet.prototype._withTMSnippetContribution = function (extensionFolderPath, snippet, collector) {
            var _this = this;
            if (!snippet.language || (typeof snippet.language !== 'string') || !languageExtensionPoint_1.LanguageExtensions.isRegisteredMode(snippet.language)) {
                collector.error(nls.localize('invalid.language', "Unknown language in `contributes.{0}.language`. Provided value: {1}", snippetsExtensionPoint.name, String(snippet.language)));
                return;
            }
            if (!snippet.path || (typeof snippet.path !== 'string')) {
                collector.error(nls.localize('invalid.path.0', "Expected string in `contributes.{0}.path`. Provided value: {1}", snippetsExtensionPoint.name, String(snippet.path)));
                return;
            }
            var normalizedAbsolutePath = paths.normalize(paths.join(extensionFolderPath, snippet.path));
            if (normalizedAbsolutePath.indexOf(extensionFolderPath) !== 0) {
                collector.warn(nls.localize('invalid.path.1', "Expected `contributes.{0}.path` ({1}) to be included inside extension's folder ({2}). This might make the extension non-portable.", snippetsExtensionPoint.name, normalizedAbsolutePath, extensionFolderPath));
            }
            var modeId = snippet.language;
            pluginsRegistry_1.PluginsRegistry.registerOneTimeActivationEventListener('onLanguage:' + modeId, function () {
                _this.registerDefinition(modeId, normalizedAbsolutePath);
            });
        };
        MainProcessTextMateSnippet.prototype.registerDefinition = function (modeId, filePath) {
            pfs.readFile(filePath).then(function (fileContents) {
                var errors = [];
                var snippets = json.parse(fileContents.toString(), errors);
                var adaptedSnippets = TMSnippetsAdaptor.adapt(snippets);
                modesExt.registerDefaultSnippets(modeId, adaptedSnippets);
            });
        };
        MainProcessTextMateSnippet = __decorate([
            __param(0, modelService_1.IModelService)
        ], MainProcessTextMateSnippet);
        return MainProcessTextMateSnippet;
    })();
    exports.MainProcessTextMateSnippet = MainProcessTextMateSnippet;
    var TMSnippetsAdaptor = (function () {
        function TMSnippetsAdaptor() {
        }
        TMSnippetsAdaptor.adapt = function (snippets) {
            var topLevelProperties = Object.keys(snippets), result = [];
            var processSnippet = function (snippet, description) {
                var prefix = snippet['prefix'];
                var bodyStringOrArray = snippet['body'];
                if (Array.isArray(bodyStringOrArray)) {
                    bodyStringOrArray = bodyStringOrArray.join('\n');
                }
                if (typeof prefix === 'string' && typeof bodyStringOrArray === 'string') {
                    var convertedSnippet = TMSnippetsAdaptor.convertSnippet(bodyStringOrArray);
                    if (convertedSnippet !== null) {
                        result.push({
                            type: 'snippet',
                            label: prefix,
                            documentationLabel: snippet['description'] || description,
                            codeSnippet: convertedSnippet
                        });
                    }
                }
            };
            topLevelProperties.forEach(function (topLevelProperty) {
                var scopeOrTemplate = snippets[topLevelProperty];
                if (scopeOrTemplate['body'] && scopeOrTemplate['prefix']) {
                    processSnippet(scopeOrTemplate, topLevelProperty);
                }
                else {
                    var snippetNames = Object.keys(scopeOrTemplate);
                    snippetNames.forEach(function (name) {
                        processSnippet(scopeOrTemplate[name], name);
                    });
                }
            });
            return result;
        };
        TMSnippetsAdaptor.convertSnippet = function (textMateSnippet) {
            return snippets.CodeSnippet.convertExternalSnippet(textMateSnippet, snippets.ExternalSnippetType.TextMateSnippet);
        };
        return TMSnippetsAdaptor;
    })();
});
//# sourceMappingURL=TMSnippets.js.map