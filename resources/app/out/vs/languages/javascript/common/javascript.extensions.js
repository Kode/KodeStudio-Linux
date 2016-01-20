/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/platform/platform', 'vs/languages/typescript/common/typescript'], function (require, exports, platform, typescript) {
    var Defaults;
    (function (Defaults) {
        Defaults.ProjectResolver = new typescript.DefaultProjectResolver();
        function addExtraLib(content, filePath) {
            Defaults.ProjectResolver.addExtraLib(content, filePath);
        }
        Defaults.addExtraLib = addExtraLib;
        function setCompilerOptions(options) {
            Defaults.ProjectResolver.setCompilerOptions(options);
        }
        Defaults.setCompilerOptions = setCompilerOptions;
    })(Defaults = exports.Defaults || (exports.Defaults = {}));
    // ----- JavaScript extension ---------------------------------------------------------------
    var Extensions;
    (function (Extensions) {
        Extensions.Identifier = 'javascript';
        platform.Registry.add(Extensions.Identifier, Extensions);
        var projectResolver;
        function setProjectResolver(desc) {
            projectResolver = desc;
        }
        Extensions.setProjectResolver = setProjectResolver;
        function getProjectResolver() {
            return projectResolver;
        }
        Extensions.getProjectResolver = getProjectResolver;
    })(Extensions = exports.Extensions || (exports.Extensions = {}));
});
//# sourceMappingURL=javascript.extensions.js.map