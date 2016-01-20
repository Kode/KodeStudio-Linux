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
define(["require", "exports", 'vs/nls', 'vs/base/common/strings', 'vs/base/common/winjs.base', 'vs/base/common/paths', 'vs/platform/files/common/files', 'vs/platform/request/common/request', 'vs/platform/workspace/common/workspace'], function (require, exports, nls, strings, winjs, paths, files_1, request_1, workspace_1) {
    var QuickFixMainActions = (function () {
        function QuickFixMainActions(requestService, fileService, contextService) {
            this._requestService = requestService;
            this._fileService = fileService;
            this._contextService = contextService;
        }
        QuickFixMainActions.prototype.evaluate = function (resource, range, quickFix) {
            var command = quickFix.command.arguments[0];
            switch (command.type) {
                case 'typedefinitions': {
                    return this.evaluateAddTypeDefinitionProposal(command.name, resource);
                }
            }
            return winjs.Promise.as(null);
        };
        QuickFixMainActions.prototype.evaluateAddTypeDefinitionProposal = function (typingsReference, resource) {
            var _this = this;
            var dtsFile = 'typings/' + typingsReference;
            var dtsFileResource = this._contextService.toResource(dtsFile);
            var jsConfigResource = this._contextService.toResource('jsconfig.json');
            if (!dtsFileResource || !jsConfigResource) {
                return winjs.Promise.as(null);
            }
            var resourcePath = this._contextService.toWorkspaceRelativePath(resource);
            if (!resourcePath) {
                resourcePath = resource.fsPath;
            }
            var currentFolderPath = strings.rtrim(paths.dirname(resourcePath), '/');
            var relativeDtsPath = paths.relative(currentFolderPath, dtsFile);
            var action = {
                edits: []
            };
            return this._fileService.resolveFile(dtsFileResource).then(function (file) {
                // file exists already
                return {
                    message: nls.localize('typingsReference.already.exists', '{0} already exists. Make sure the file is included in the project\'s jsconfig.json', dtsFile)
                };
            }, function (error) {
                var url = 'https://raw.githubusercontent.com/borisyankov/DefinitelyTyped/master/' + typingsReference;
                return _this._requestService.makeRequest({ url: url, followRedirects: 5 }).then(function (response) {
                    return _this._fileService.createFile(dtsFileResource, response.responseText).then(function (file) {
                        return _this._fileService.resolveFile(jsConfigResource).then(function (stat) {
                            return {
                                message: nls.localize('typingsReference.success.withjsconfig', '{0} successfully downloaded. Make sure the d.ts file is included your project\'s \'jsconfig.json\'.', dtsFile)
                            };
                        }, function (error) {
                            return {
                                message: nls.localize('typingsReference.success.nojsconfig', '{0} successfully downloaded', dtsFile)
                            };
                        });
                    }, function (error) {
                        return {
                            message: nls.localize('typingsReference.error.write', 'Problem creating {0}: {1}', dtsFile, error.toString())
                        };
                    });
                }, function (error) {
                    return {
                        message: nls.localize('typingsReference.error.download', 'Unable to fetch d.ts file at {0}: {1}', url, error.responseText)
                    };
                });
            });
        };
        QuickFixMainActions = __decorate([
            __param(0, request_1.IRequestService),
            __param(1, files_1.IFileService),
            __param(2, workspace_1.IWorkspaceContextService)
        ], QuickFixMainActions);
        return QuickFixMainActions;
    })();
    exports.QuickFixMainActions = QuickFixMainActions;
});
//# sourceMappingURL=quickFixMainActions.js.map