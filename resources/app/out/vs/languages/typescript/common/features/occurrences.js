/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/languages/typescript/common/features/converter'], function (require, exports, converter) {
    function compute(languageService, resource, position, strict) {
        var filename = resource.toString(), sourceFile = languageService.getSourceFile(filename), offset = converter.getOffset(sourceFile, position), entries = languageService.getOccurrencesAtPosition(filename, offset);
        if (!entries) {
            return [];
        }
        return entries.map(function (entry) {
            return {
                kind: entry.isWriteAccess ? 'write' : null,
                range: converter.getRange(sourceFile, entry.textSpan)
            };
        });
    }
    exports.compute = compute;
});
//# sourceMappingURL=occurrences.js.map