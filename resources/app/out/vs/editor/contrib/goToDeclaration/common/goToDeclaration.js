/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/base/common/winjs.base', 'vs/base/common/errors', 'vs/editor/common/modes/languageFeatureRegistry', 'vs/editor/common/editorCommonExtensions'], function (require, exports, winjs_base_1, errors_1, languageFeatureRegistry_1, editorCommonExtensions_1) {
    exports.DeclarationRegistry = new languageFeatureRegistry_1.default('declarationSupport');
    function getDeclarationsAtPosition(model, position) {
        var resource = model.getAssociatedResource();
        var provider = exports.DeclarationRegistry.ordered(model);
        // get results
        var promises = provider.map(function (provider, idx) {
            return provider.findDeclaration(resource, position).then(function (result) {
                return result;
            }, function (err) {
                errors_1.onUnexpectedError(err);
            });
        });
        return winjs_base_1.TPromise.join(promises).then(function (allReferences) {
            var result = [];
            for (var _i = 0; _i < allReferences.length; _i++) {
                var references = allReferences[_i];
                if (Array.isArray(references)) {
                    result.push.apply(result, references);
                }
                else if (references) {
                    result.push(references);
                }
            }
            return result;
        });
    }
    exports.getDeclarationsAtPosition = getDeclarationsAtPosition;
    editorCommonExtensions_1.CommonEditorRegistry.registerDefaultLanguageCommand('_executeDefinitionProvider', getDeclarationsAtPosition);
});
//# sourceMappingURL=goToDeclaration.js.map