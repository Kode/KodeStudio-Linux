/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/base/common/strings'], function (require, exports, strings) {
    function getEmitOutput(languageService, resource, type) {
        var output = languageService.getEmitOutput(resource.toString()), files = output.outputFiles;
        if (!files) {
            return null;
        }
        for (var i = 0, len = files.length; i < len; i++) {
            if (strings.endsWith(files[i].name, type)) {
                return {
                    filename: files[i].name,
                    content: files[i].text
                };
            }
        }
        return null;
    }
    exports.getEmitOutput = getEmitOutput;
});
//# sourceMappingURL=emitting.js.map