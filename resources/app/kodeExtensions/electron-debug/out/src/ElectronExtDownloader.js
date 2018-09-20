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
const util = require("./common");
const vscode = require("vscode");
const PackageManager_1 = require("./packageManager/PackageManager");
const PackageFilePathResolver_1 = require("./packageManager/PackageFilePathResolver");
/*
 * Class used to download the runtime dependencies of the C# Extension
 */
class ElectronExtDownloader {
    constructor(networkSettingsProvider, packageJSON, platformInfo) {
        this.networkSettingsProvider = networkSettingsProvider;
        this.packageJSON = packageJSON;
        this.platformInfo = platformInfo;
    }
    installRuntimeDependencies() {
        return __awaiter(this, void 0, void 0, function* () {
            let installationStage = 'touchBeginFile';
            try {
                vscode.window.showInformationMessage('Downloading Electron...');
                let message = vscode.window.setStatusBarMessage('Downloading Electron...');
                yield util.touchInstallFile(util.InstallFileType.Begin);
                // Display platform information and RID
                // this.eventStream.post(new LogPlatformInfo(this.platformInfo));
                let runTimeDependencies = GetRunTimeDependenciesPackages(this.packageJSON);
                runTimeDependencies.forEach(pkg => PackageFilePathResolver_1.ResolveFilePaths(pkg));
                installationStage = 'downloadAndInstallPackages';
                yield PackageManager_1.DownloadAndInstallPackages(runTimeDependencies, this.networkSettingsProvider, this.platformInfo);
                installationStage = 'touchLockFile';
                yield util.touchInstallFile(util.InstallFileType.Lock);
                message.dispose();
                return true;
            }
            catch (error) {
                return false;
            }
            finally {
                try {
                    util.deleteInstallFile(util.InstallFileType.Begin);
                }
                catch (error) { }
            }
        });
    }
}
exports.ElectronExtDownloader = ElectronExtDownloader;
function GetRunTimeDependenciesPackages(packageJSON) {
    if (packageJSON.runtimeDependencies) {
        return JSON.parse(JSON.stringify(packageJSON.runtimeDependencies));
    }
    throw new Error('No runtime dependencies found');
}
exports.GetRunTimeDependenciesPackages = GetRunTimeDependenciesPackages;

//# sourceMappingURL=ElectronExtDownloader.js.map
