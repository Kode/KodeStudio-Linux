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
const PackageError_1 = require("./PackageError");
const NestedError_1 = require("../NestedError");
const FileDownloader_1 = require("./FileDownloader");
const ZipInstaller_1 = require("./ZipInstaller");
const PackageFilterer_1 = require("./PackageFilterer");
// Package manager needs a list of packages to be filtered based on platformInfo then download and install them
// Note that the packages that this component will install needs absolute paths for the installPath, intsallTestPath and the binaries
function DownloadAndInstallPackages(packages, provider, platformInfo) {
    return __awaiter(this, void 0, void 0, function* () {
        let filteredPackages = yield PackageFilterer_1.filterPackages(packages, platformInfo);
        if (filteredPackages) {
            for (let pkg of filteredPackages) {
                try {
                    let buffer = yield FileDownloader_1.DownloadFile(pkg.description, provider, pkg.url, pkg.fallbackUrl);
                    yield ZipInstaller_1.InstallZip(buffer, pkg.description, pkg.installPath, pkg.binaries, pkg.links);
                }
                catch (error) {
                    if (error instanceof NestedError_1.NestedError) {
                        throw new PackageError_1.PackageError(error.message, pkg, error.err);
                    }
                    else {
                        throw error;
                    }
                }
            }
        }
    });
}
exports.DownloadAndInstallPackages = DownloadAndInstallPackages;

//# sourceMappingURL=PackageManager.js.map
