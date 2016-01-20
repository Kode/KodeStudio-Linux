/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/base/common/strings', 'vs/languages/typescript/common/features/converter', 'vs/languages/typescript/common/features/previewer'], function (require, exports, strings, converter, previewer) {
    function compute(languageService, resource, position) {
        var filename = resource.toString(), sourceFile = languageService.getSourceFile(filename), offset = converter.getOffset(sourceFile, position), info = languageService.getSignatureHelpItems(filename, offset);
        if (!info) {
            return null;
        }
        var ret = {
            currentSignature: info.selectedItemIndex,
            currentParameter: info.argumentIndex,
            signatures: []
        };
        info.items.forEach(function (item) {
            var signature = {
                label: strings.empty,
                documentation: null,
                parameters: []
            };
            signature.label += previewer.plain(item.prefixDisplayParts);
            item.parameters.forEach(function (p, i, a) {
                var label = previewer.plain(p.displayParts);
                var parameter = {
                    label: label,
                    documentation: previewer.plain(p.documentation),
                    signatureLabelOffset: signature.label.length,
                    signatureLabelEnd: signature.label.length + label.length
                };
                signature.label += label;
                signature.parameters.push(parameter);
                if (i < a.length - 1) {
                    signature.label += previewer.plain(item.separatorDisplayParts);
                }
            });
            signature.label += previewer.plain(item.suffixDisplayParts);
            ret.signatures.push(signature);
        });
        return ret;
    }
    exports.compute = compute;
});
//# sourceMappingURL=parameterHints.js.map