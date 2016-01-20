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
define(["require", "exports", 'vs/nls', 'vs/base/common/winjs.base', 'vs/base/common/paths', 'vs/base/common/actions', 'vs/platform/actions/common/actions', 'vs/platform/platform', 'vs/workbench/common/actionRegistry', 'vs/workbench/common/contributions', './snippetsTracker', 'vs/editor/common/modes/modesRegistry', 'vs/base/common/errors', 'vs/workbench/services/quickopen/common/quickOpenService', 'vs/platform/workspace/common/workspace', 'vs/platform/jsonschemas/common/jsonContributionRegistry', 'electron', 'fs'], function (require, exports, nls, winjs, paths, actions, actions_1, platform, workbenchActionRegistry, workbenchContributions, snippetsTracker, modesExtensions, errors, quickOpenService_1, workspace_1, JSONContributionRegistry, electron_1, fs) {
    var OpenSnippetsAction = (function (_super) {
        __extends(OpenSnippetsAction, _super);
        function OpenSnippetsAction(id, label, contextService, quickOpenService) {
            _super.call(this, id, label);
            this.contextService = contextService;
            this.quickOpenService = quickOpenService;
        }
        OpenSnippetsAction.prototype.openFile = function (filePath) {
            electron_1.ipcRenderer.send('vscode:windowOpen', [filePath], false /* force new window */); // handled from browser process
        };
        OpenSnippetsAction.prototype.run = function () {
            var _this = this;
            var modesRegistry = platform.Registry.as(modesExtensions.Extensions.EditorModes);
            var modeIds = modesRegistry.getRegisteredModes();
            var picks = [];
            modeIds.forEach(function (modeId) {
                var name = modesRegistry.getLanguageName(modeId);
                if (name) {
                    picks.push({ label: name, id: modeId });
                }
            });
            picks = picks.sort(function (e1, e2) {
                return e1.label.localeCompare(e2.label);
            });
            return this.quickOpenService.pick(picks, { placeHolder: nls.localize('openSnippet.pickLanguage', "Select Language for Snippet") }).then(function (language) {
                if (language) {
                    var snippetPath = paths.join(_this.contextService.getConfiguration().env.appSettingsHome, 'snippets', language.id + '.json');
                    return fileExists(snippetPath).then(function (success) {
                        if (success) {
                            _this.openFile(snippetPath);
                            return winjs.Promise.as(null);
                        }
                        var defaultContent = [
                            '{',
                            '/*',
                            '\t // Place your snippets for ' + language.label + ' here. Each snippet is defined under a snippet name and has a prefix, body and ',
                            '\t // description. The prefix is what is used to trigger the snippet and the body will be expanded and inserted. Possible variables are:',
                            '\t // $1, $2 for tab stops, ${id} and ${id:label} and ${1:label} for variables. Variables with the same id are connected.',
                            '\t // Example:',
                            '\t "Print to console": {',
                            '\t\t"prefix": "log",',
                            '\t\t"body": [',
                            '\t\t\t"console.log(\'$1\');",',
                            '\t\t\t"$2"',
                            '\t\t],',
                            '\t\t"description": "Log output to console"',
                            '\t}',
                            '*/',
                            '}'
                        ].join('\n');
                        return createFile(snippetPath, defaultContent).then(function () {
                            _this.openFile(snippetPath);
                        }, function (err) {
                            errors.onUnexpectedError(nls.localize('openSnippet.errorOnCreate', 'Unable to create {0}', snippetPath));
                        });
                    });
                }
                return winjs.Promise.as(null);
            });
        };
        OpenSnippetsAction.ID = 'workbench.action.openSnippets';
        OpenSnippetsAction.LABEL = nls.localize('openSnippet.label', 'Snippets');
        OpenSnippetsAction = __decorate([
            __param(2, workspace_1.IWorkspaceContextService),
            __param(3, quickOpenService_1.IQuickOpenService)
        ], OpenSnippetsAction);
        return OpenSnippetsAction;
    })(actions.Action);
    function fileExists(path) {
        return new winjs.TPromise(function (c, e, p) {
            fs.stat(path, function (err, stats) {
                if (err) {
                    return c(false);
                }
                if (stats.isFile()) {
                    return c(true);
                }
                c(false);
            });
        });
    }
    function createFile(path, content) {
        return new winjs.Promise(function (c, e, p) {
            fs.writeFile(path, content, function (err) {
                if (err) {
                    e(err);
                }
                c(true);
            });
        });
    }
    var preferencesCategory = nls.localize('preferences', "Preferences");
    var workbenchActionsRegistry = platform.Registry.as(workbenchActionRegistry.Extensions.WorkbenchActions);
    workbenchActionsRegistry.registerWorkbenchAction(new actions_1.SyncActionDescriptor(OpenSnippetsAction, OpenSnippetsAction.ID, OpenSnippetsAction.LABEL), preferencesCategory);
    platform.Registry.as(workbenchContributions.Extensions.Workbench).registerWorkbenchContribution(snippetsTracker.SnippetsTracker);
    var schemaId = 'local://schemas/snippets';
    var schema = {
        'id': schemaId,
        'default': { '{{snippetName}}': { 'prefix': '{{prefix}}', 'body': '{{snippet}}', 'description': '{{description}}' } },
        'type': 'object',
        'description': nls.localize('snippetSchema.json', 'User snippet configuration'),
        'additionalProperties': {
            'type': 'object',
            'required': ['prefix', 'body'],
            'properties': {
                'prefix': {
                    'description': nls.localize('snippetSchema.json.prefix', 'The prefix to used when selecting the snippet in intellisense'),
                    'type': 'string'
                },
                'body': {
                    'description': nls.localize('snippetSchema.json.body', 'The snippet content. Use \'${id}\', \'${id:label}\', \'${1:label}\' for variables and \'$0\', \'$1\' for the cursor positions'),
                    'type': ['string', 'array'],
                    'items': {
                        'type': 'string'
                    }
                },
                'description': {
                    'description': nls.localize('snippetSchema.json.description', 'The snippet description.'),
                    'type': 'string'
                }
            },
            'additionalProperties': false
        }
    };
    var schemaRegistry = platform.Registry.as(JSONContributionRegistry.Extensions.JSONContribution);
    schemaRegistry.registerSchema(schemaId, schema);
    schemaRegistry.addSchemaFileAssociation('%APP_SETTINGS_HOME%/snippets/*.json', schemaId);
});
//# sourceMappingURL=snippets.contribution.js.map