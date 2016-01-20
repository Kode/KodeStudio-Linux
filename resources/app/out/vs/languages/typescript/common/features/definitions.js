/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/base/common/uri'], function (require, exports, uri_1) {
    function findDeclaration(project, resource, position) {
        var filename = resource.toString(), offset = project.host.getScriptLineMap(filename).getOffset(position);
        var infos = project.languageService.getDefinitionAtPosition(filename, offset);
        if (!infos || infos.length === 0) {
            return null;
        }
        // TODO@joh - how to handle multiple definitions
        var info = infos[0];
        if (!info.fileName) {
            // likely to be a primitive type
            return null;
        }
        return {
            resource: uri_1.default.parse(info.fileName),
            range: project.host.getScriptLineMap(info.fileName).getRangeFromSpan(info.textSpan)
        };
    }
    exports.findDeclaration = findDeclaration;
});
//# sourceMappingURL=definitions.js.map