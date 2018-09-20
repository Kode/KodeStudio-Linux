"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const util = require("../common");
const PackageFilePathResolver_1 = require("./PackageFilePathResolver");
const PackageError_1 = require("./PackageError");
const node_filter_async_1 = require("node-filter-async");
function filterPackages(packages, platformInfo) {
    return __awaiter(this, void 0, void 0, function* () {
        let platformPackages = filterPlatformPackages(packages, platformInfo);
        return filterAlreadyInstalledPackages(platformPackages);
    });
}
exports.filterPackages = filterPackages;
function filterPlatformPackages(packages, platformInfo) {
    if (packages) {
        return packages.filter(pkg => {
            if (pkg.architectures && pkg.architectures.indexOf(platformInfo.architecture) === -1) {
                return false;
            }
            if (pkg.platforms && pkg.platforms.indexOf(platformInfo.platform) === -1) {
                return false;
            }
            return true;
        });
    }
    else {
        throw new PackageError_1.PackageError('Package manifest does not exist.');
    }
}
function filterAlreadyInstalledPackages(packages) {
    return __awaiter(this, void 0, void 0, function* () {
        return node_filter_async_1.filterAsync(packages, (pkg) => __awaiter(this, void 0, void 0, function* () {
            // If the file is present at the install test path then filter it
            let testPath = PackageFilePathResolver_1.ResolvePackageTestPath(pkg);
            if (!testPath) {
                // if there is no testPath specified then we will not filter it
                return true;
            }
            return !(yield util.fileExists(testPath));
        }));
    });
}

//# sourceMappingURL=PackageFilterer.js.map
