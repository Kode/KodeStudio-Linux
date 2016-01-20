/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/base/common/winjs.base', 'vs/base/common/errors', 'vs/editor/common/modes/languageFeatureRegistry', 'vs/editor/common/editorCommonExtensions'], function (require, exports, winjs_base_1, errors_1, languageFeatureRegistry_1, editorCommonExtensions_1) {
    exports.ReferenceRegistry = new languageFeatureRegistry_1.default('referenceSupport');
    function findReferences(model, position) {
        // collect references from all providers
        var promises = exports.ReferenceRegistry.ordered(model).map(function (provider) {
            return provider.findReferences(model.getAssociatedResource(), position, true).then(function (result) {
                if (Array.isArray(result)) {
                    return result;
                }
            }, function (err) {
                errors_1.onUnexpectedError(err);
            });
        });
        return winjs_base_1.TPromise.join(promises).then(function (references) {
            var result = [];
            for (var _i = 0; _i < references.length; _i++) {
                var ref = references[_i];
                if (ref) {
                    result.push.apply(result, ref);
                }
            }
            return result;
        });
    }
    exports.findReferences = findReferences;
    editorCommonExtensions_1.CommonEditorRegistry.registerDefaultLanguageCommand('_executeReferenceProvider', findReferences);
});
//# sourceMappingURL=referenceSearch.js.map