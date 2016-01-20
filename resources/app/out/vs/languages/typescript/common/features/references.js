/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/base/common/uri', 'vs/languages/typescript/common/lib/typescriptServices'], function (require, exports, uri_1, ts) {
    function find(project, resource, position, includeDecl, insideFileOnly) {
        if (insideFileOnly === void 0) { insideFileOnly = false; }
        var filename = resource.toString(), offset = project.host.getScriptLineMap(filename).getOffset(position), entries;
        entries = insideFileOnly
            ? project.languageService.getOccurrencesAtPosition(filename, offset)
            : project.languageService.getReferencesAtPosition(filename, offset);
        if (!entries) {
            return [];
        }
        return entries.filter(function (info) {
            var targetFile = project.languageService.getSourceFile(info.fileName);
            return (includeDecl || !isDeclaration(targetFile, info.textSpan.start));
        }).map(function (info) {
            var r = {
                resource: uri_1.default.parse(info.fileName),
                range: project.host.getScriptLineMap(info.fileName).getRangeFromSpan(info.textSpan)
            };
            return r;
        });
    }
    exports.find = find;
    function isDeclaration(sourceFile, offset) {
        var parent = ts.getTokenAtPosition(sourceFile, offset).parent; // offset,len points to name
        return parent && ts.isDeclaration(parent);
    }
});
//# sourceMappingURL=references.js.map