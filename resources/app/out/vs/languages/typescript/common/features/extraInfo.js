/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/languages/typescript/common/features/converter', 'vs/languages/typescript/common/features/previewer'], function (require, exports, converter, previewer) {
    function compute(languageService, resource, position) {
        var filename = resource.toString(), sourceFile = languageService.getSourceFile(filename), offset = converter.getOffset(sourceFile, position), info = languageService.getQuickInfoAtPosition(filename, offset), result;
        if (info) {
            var htmlContent = [
                previewer.html(info.displayParts),
                previewer.html(info.documentation, 'documentation')
            ];
            result = {
                value: '',
                htmlContent: htmlContent,
                className: 'typeInfo ts',
                range: converter.getRange(sourceFile, info.textSpan)
            };
        }
        return result;
    }
    exports.compute = compute;
});
//# sourceMappingURL=extraInfo.js.map