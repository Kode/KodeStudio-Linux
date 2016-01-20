/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/base/common/winjs.base', 'vs/base/common/errors', 'vs/editor/common/modes/languageFeatureRegistry', 'vs/editor/common/editorCommonExtensions'], function (require, exports, winjs_base_1, errors_1, languageFeatureRegistry_1, editorCommonExtensions_1) {
    exports.ParameterHintsRegistry = new languageFeatureRegistry_1.default('parameterHintsSupport');
    function getParameterHints(model, position, triggerCharacter) {
        var support = exports.ParameterHintsRegistry.ordered(model)[0];
        if (!support) {
            return winjs_base_1.TPromise.as(undefined);
        }
        return support.getParameterHints(model.getAssociatedResource(), position, triggerCharacter);
    }
    exports.getParameterHints = getParameterHints;
    editorCommonExtensions_1.CommonEditorRegistry.registerDefaultLanguageCommand('_executeSignatureHelpProvider', function (model, position, args) {
        var triggerCharacter = args.triggerCharacter;
        if (triggerCharacter && typeof triggerCharacter !== 'string') {
            throw errors_1.illegalArgument('triggerCharacter');
        }
        return getParameterHints(model, position, triggerCharacter);
    });
});
//# sourceMappingURL=parameterHints.js.map