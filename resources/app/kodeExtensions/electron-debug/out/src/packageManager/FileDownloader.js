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
const https = require("https");
const util = require("../common");
const NestedError_1 = require("../NestedError");
const url_1 = require("url");
const proxy_1 = require("./proxy");
function DownloadFile(description, networkSettingsProvider, url, fallbackUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let buffer = yield downloadFile(description, url, networkSettingsProvider);
            return buffer;
        }
        catch (primaryUrlError) {
            // If the package has a fallback Url, and downloading from the primary Url failed, try again from
            // the fallback. This is used for debugger packages as some users have had issues downloading from
            // the CDN link
            if (fallbackUrl) {
                try {
                    let buffer = yield downloadFile(description, fallbackUrl, networkSettingsProvider);
                    return buffer;
                }
                catch (fallbackUrlError) {
                    throw primaryUrlError;
                }
            }
            else {
                throw primaryUrlError;
            }
        }
    });
}
exports.DownloadFile = DownloadFile;
function downloadFile(description, urlString, networkSettingsProvider) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = url_1.parse(urlString);
        const networkSettings = networkSettingsProvider();
        const proxy = networkSettings.proxy;
        const strictSSL = networkSettings.strictSSL;
        const options = {
            host: url.hostname,
            path: url.path,
            agent: proxy_1.getProxyAgent(url, proxy, strictSSL),
            port: url.port,
            rejectUnauthorized: util.isBoolean(strictSSL) ? strictSSL : true
        };
        let buffers = [];
        return new Promise((resolve, reject) => {
            let request = https.request(options, response => {
                if (response.statusCode === 301 || response.statusCode === 302) {
                    // Redirect - download from new location
                    return resolve(downloadFile(description, response.headers.location, networkSettingsProvider));
                }
                else if (response.statusCode !== 200) {
                    // Download failed - print error message
                    return reject(new NestedError_1.NestedError(response.statusCode.toString()));
                }
                // Downloading - hook up events
                let packageSize = parseInt(response.headers['content-length'], 10);
                let downloadedBytes = 0;
                let downloadPercentage = 0;
                response.on('data', data => {
                    downloadedBytes += data.length;
                    buffers.push(data);
                    // Update status bar item with percentage
                    let newPercentage = Math.ceil(100 * (downloadedBytes / packageSize));
                    if (newPercentage !== downloadPercentage) {
                        downloadPercentage = newPercentage;
                    }
                });
                response.on('end', () => {
                    resolve(Buffer.concat(buffers));
                });
                response.on('error', err => {
                    reject(new NestedError_1.NestedError(`Failed to download from ${urlString}. Error Message: ${err.message} || 'NONE'}`, err));
                });
            });
            request.on('error', err => {
                reject(new NestedError_1.NestedError(`Request error: ${err.message || 'NONE'}`, err));
            });
            // Execute the request
            request.end();
        });
    });
}

//# sourceMappingURL=FileDownloader.js.map
