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
const fs = require("fs");
const mkdirp = require("mkdirp");
const path = require("path");
const yauzl = require("yauzl");
const NestedError_1 = require("../NestedError");
function InstallZipSymLinks(buffer, destinationInstallPath, links) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            yauzl.fromBuffer(buffer, { lazyEntries: true }, (err, zipFile) => {
                if (err) {
                    let message = 'Electron Extension was unable to download its dependencies. Please check your internet connection. If you use a proxy server, please visit https://aka.ms/VsCodeCsharpNetworking';
                    return reject(new NestedError_1.NestedError(message));
                }
                zipFile.readEntry();
                zipFile.on('entry', (entry) => {
                    let absoluteEntryPath = path.resolve(destinationInstallPath, entry.fileName);
                    if (entry.fileName.endsWith('/')) {
                        // Directory - already created
                        zipFile.readEntry();
                    }
                    else {
                        // File - symlink it
                        zipFile.openReadStream(entry, (readerr, readStream) => {
                            if (readerr) {
                                return reject(new NestedError_1.NestedError('Error reading zip stream', readerr));
                            }
                            // Prevent Electron from kicking in special behavior when opening a write-stream to a .asar file
                            let originalAbsoluteEntryPath = absoluteEntryPath;
                            if (absoluteEntryPath.endsWith('.asar')) {
                                absoluteEntryPath += '_';
                            }
                            if (links && links.indexOf(absoluteEntryPath) !== -1) {
                                readStream.setEncoding('utf8');
                                let body = '';
                                readStream.on('data', (chunk) => {
                                    body += chunk;
                                });
                                readStream.on('end', () => {
                                    // vscode.window.showInformationMessage('Linking ' + absoluteEntryPath + ' and ' + path.join(absoluteEntryPath, body));
                                    fs.symlink(body, absoluteEntryPath, undefined, () => {
                                        zipFile.readEntry();
                                    });
                                });
                            }
                            else {
                                zipFile.readEntry();
                            }
                        });
                    }
                });
                zipFile.on('end', () => {
                    resolve();
                });
                zipFile.on('error', ziperr => {
                    reject(new NestedError_1.NestedError('Zip File Error:' + ziperr.code || '', ziperr));
                });
            });
        });
    });
}
function InstallZip(buffer, description, destinationInstallPath, binaries, links) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            yauzl.fromBuffer(buffer, { lazyEntries: true }, (err, zipFile) => {
                if (err) {
                    let message = 'Electron Extension was unable to download its dependencies. Please check your internet connection. If you use a proxy server, please visit https://aka.ms/VsCodeCsharpNetworking';
                    return reject(new NestedError_1.NestedError(message));
                }
                zipFile.readEntry();
                zipFile.on('entry', (entry) => {
                    let absoluteEntryPath = path.resolve(destinationInstallPath, entry.fileName);
                    if (entry.fileName.endsWith('/')) {
                        // Directory - create it
                        mkdirp(absoluteEntryPath, { mode: 0o775 }, direrr => {
                            if (direrr) {
                                return reject(new NestedError_1.NestedError('Error creating directory for zip directory entry:' + direrr.code || '', direrr));
                            }
                            zipFile.readEntry();
                        });
                    }
                    else {
                        // File - extract it
                        zipFile.openReadStream(entry, (readerr, readStream) => {
                            if (readerr) {
                                return reject(new NestedError_1.NestedError('Error reading zip stream', readerr));
                            }
                            mkdirp(path.dirname(absoluteEntryPath), { mode: 0o775 }, direrr => {
                                if (direrr) {
                                    return reject(new NestedError_1.NestedError('Error creating directory for zip file entry', direrr));
                                }
                                // Make sure executable files have correct permissions when extracted
                                let fileMode = binaries && binaries.indexOf(absoluteEntryPath) !== -1
                                    ? 0o755
                                    : 0o664;
                                // Prevent Electron from kicking in special behavior when opening a write-stream to a .asar file
                                let originalAbsoluteEntryPath = absoluteEntryPath;
                                if (absoluteEntryPath.endsWith('.asar')) {
                                    absoluteEntryPath += '_';
                                }
                                if (links && links.indexOf(absoluteEntryPath) !== -1) {
                                    zipFile.readEntry();
                                }
                                else {
                                    readStream.pipe(fs.createWriteStream(absoluteEntryPath, { mode: fileMode }));
                                    readStream.on('end', () => {
                                        if (absoluteEntryPath !== originalAbsoluteEntryPath) {
                                            fs.renameSync(absoluteEntryPath, originalAbsoluteEntryPath);
                                        }
                                        zipFile.readEntry();
                                    });
                                }
                            });
                        });
                    }
                });
                zipFile.on('end', () => {
                    InstallZipSymLinks(buffer, destinationInstallPath, links).then(() => {
                        resolve();
                    }, (errr) => {
                        reject(new NestedError_1.NestedError('Error symlinking', errr));
                    });
                });
                zipFile.on('error', ziperr => {
                    reject(new NestedError_1.NestedError('Zip File Error:' + ziperr.code || '', ziperr));
                });
            });
        });
    });
}
exports.InstallZip = InstallZip;

//# sourceMappingURL=ZipInstaller.js.map
