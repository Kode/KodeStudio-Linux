/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/base/common/paths', 'vs/base/common/strings'], function (require, exports, paths, strings) {
    var dtsExt = '.d.ts';
    function internal(path, relativeTo) {
        return { value: paths.join(paths.dirname(relativeTo), path) };
    }
    exports.internal = internal;
    function external(path, relativeTo, moduleRoot) {
        if (moduleRoot === void 0) { moduleRoot = strings.empty; }
        var extname = paths.extname(path);
        switch (extname) {
            case '.js':
            case '.ts':
                // reference was far.js or far.ts which we 
                // remove from path and store in extname
                path = path.substring(0, path.length - extname.length);
                break;
            default:
                // keep the file extension
                extname = paths.extname(relativeTo);
                break;
        }
        var basepath = paths.isRelative(path) ?
            paths.join(paths.dirname(relativeTo), path) :
            paths.join(moduleRoot, path);
        return {
            value: basepath + extname,
            alternateValue: basepath + dtsExt
        };
    }
    exports.external = external;
});
//# sourceMappingURL=modulePaths.js.map