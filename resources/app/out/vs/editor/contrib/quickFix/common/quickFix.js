/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/base/common/uri', 'vs/editor/common/core/range', 'vs/base/common/winjs.base', 'vs/base/common/errors', 'vs/editor/common/services/modelService', 'vs/editor/common/editorCommonExtensions', 'vs/editor/common/modes/languageFeatureRegistry'], function (require, exports, uri_1, range_1, winjs_base_1, errors_1, modelService_1, editorCommonExtensions_1, languageFeatureRegistry_1) {
    exports.QuickFixRegistry = new languageFeatureRegistry_1.default('quickFixSupport');
    function getQuickFixes(model, range) {
        var quickFixes = [];
        var promises = exports.QuickFixRegistry.all(model).map(function (support) {
            return support.getQuickFixes(model.getAssociatedResource(), range).then(function (result) {
                if (!Array.isArray(result)) {
                    return;
                }
                var c = 0;
                for (var _i = 0; _i < result.length; _i++) {
                    var fix = result[_i];
                    quickFixes.push({
                        command: fix.command,
                        score: fix.score,
                        id: "quickfix_#" + c++,
                        support: support
                    });
                }
            }, function (err) {
                errors_1.onUnexpectedError(err);
            });
        });
        return winjs_base_1.TPromise.join(promises).then(function () { return quickFixes; });
    }
    exports.getQuickFixes = getQuickFixes;
    editorCommonExtensions_1.CommonEditorRegistry.registerLanguageCommand('_executeCodeActionProvider', function (accessor, args) {
        var resource = args.resource, range = args.range;
        if (!uri_1.default.isURI(resource) || !range_1.Range.isIRange(range)) {
            throw errors_1.illegalArgument();
        }
        var model = accessor.get(modelService_1.IModelService).getModel(resource);
        if (!model) {
            throw errors_1.illegalArgument();
        }
        return getQuickFixes(model, range);
    });
});
//# sourceMappingURL=quickFix.js.map