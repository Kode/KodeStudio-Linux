"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const util = require("../common");
function ResolveFilePaths(pkg) {
    pkg.installTestPath = ResolvePackageTestPath(pkg);
    pkg.installPath = ResolveBaseInstallPath(pkg);
    pkg.binaries = ResolvePackageBinaries(pkg);
    pkg.links = ResolvePackageLinks(pkg);
}
exports.ResolveFilePaths = ResolveFilePaths;
function ResolvePackageTestPath(pkg) {
    if (pkg.installTestPath) {
        return path.resolve(util.getExtensionPath(), pkg.installTestPath);
    }
    return null;
}
exports.ResolvePackageTestPath = ResolvePackageTestPath;
function ResolvePackageBinaries(pkg) {
    if (pkg.binaries) {
        return pkg.binaries.map(value => path.resolve(ResolveBaseInstallPath(pkg), value));
    }
    return null;
}
function ResolvePackageLinks(pkg) {
    if (pkg.links) {
        return pkg.links.map(value => path.resolve(ResolveBaseInstallPath(pkg), value));
    }
    return null;
}
function ResolveBaseInstallPath(pkg) {
    let basePath = util.getExtensionPath();
    if (pkg.installPath) {
        basePath = path.resolve(basePath, pkg.installPath);
    }
    return basePath;
}

//# sourceMappingURL=PackageFilePathResolver.js.map
