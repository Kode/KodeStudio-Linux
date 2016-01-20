/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/base/common/uri', 'vs/languages/typescript/common/typescript'], function (require, exports, uri_1, typescript) {
    function rename(project, resource, position, newName) {
        var filename = resource.toString(), offset = project.host.getScriptLineMap(filename).getOffset(position), renameInfo, result;
        renameInfo = project.languageService.getRenameInfo(filename, offset);
        result = {
            currentName: renameInfo.displayName,
            edits: []
        };
        if (!renameInfo.canRename) {
            result.rejectReason = renameInfo.localizedErrorMessage;
            return result;
        }
        result.edits = project.languageService.findRenameLocations(filename, offset, false, false)
            .filter(function (location) {
            return !typescript.isDefaultLib(location.fileName);
        })
            .map(function (location) {
            return {
                resource: uri_1.default.parse(location.fileName),
                newText: newName,
                range: project.host.getScriptLineMap(location.fileName).getRangeFromSpan(location.textSpan)
            };
        });
        return result;
    }
    return rename;
});
//# sourceMappingURL=rename.js.map