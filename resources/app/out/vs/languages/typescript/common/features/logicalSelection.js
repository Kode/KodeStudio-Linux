/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/languages/typescript/common/lib/typescriptServices', 'vs/languages/typescript/common/features/converter'], function (require, exports, ts, converter) {
    function compute(languageService, resource, position) {
        var sourceFile = languageService.getSourceFile(resource.toString()), offset = converter.getOffset(sourceFile, position);
        var token = ts.getTokenAtPosition(sourceFile, offset), lastStart = -1, lastEnd = -1, result = [];
        while (token) {
            var start = token.getStart(), end = token.getEnd();
            if (start !== lastStart || end !== lastEnd) {
                result.unshift({
                    type: 'node',
                    range: converter.getRange(sourceFile, start, end)
                });
            }
            lastStart = start;
            lastEnd = end;
            token = token.parent;
        }
        return result;
    }
    exports.compute = compute;
});
//# sourceMappingURL=logicalSelection.js.map