/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(["require", "exports", 'vs/base/common/winjs.base', 'vs/workbench/parts/extensions/common/extensions', 'vs/platform/request/common/request', 'vs/workbench/services/workspace/common/contextService'], function (require, exports, winjs_base_1, extensions_1, request_1, contextService_1) {
    var GalleryService = (function () {
        function GalleryService(requestService, contextService) {
            this.requestService = requestService;
            this.serviceId = extensions_1.IGalleryService;
            var extensionsGalleryConfig = contextService.getConfiguration().env.extensionsGallery;
            this.extensionsGalleryUrl = extensionsGalleryConfig && extensionsGalleryConfig.serviceUrl;
        }
        GalleryService.prototype.api = function (path) {
            if (path === void 0) { path = ''; }
            return "" + this.extensionsGalleryUrl + path;
        };
        GalleryService.prototype.isEnabled = function () {
            return !!this.extensionsGalleryUrl;
        };
        GalleryService.prototype.query = function () {
            var _this = this;
            if (!this.extensionsGalleryUrl) {
                return winjs_base_1.TPromise.wrapError(new Error('No extension gallery service configured.'));
            }
            var data = JSON.stringify({
                filters: [{
                        criteria: [{
                                filterType: 1,
                                value: 'vscode'
                            }]
                    }],
                flags: 0x1 | 0x4 | 0x80
            });
            var request = {
                type: 'POST',
                url: this.api('/extensionquery'),
                data: data,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json;api-version=3.0-preview.1',
                    'Content-Length': data.length
                }
            };
            return this.requestService.makeRequest(request)
                .then(function (r) { return JSON.parse(r.responseText).results[0].extensions || []; })
                .then(function (extensions) {
                return extensions.map(function (extension) { return ({
                    name: extension.extensionName,
                    displayName: extension.displayName || extension.extensionName,
                    publisher: extension.publisher.publisherName,
                    version: extension.versions[0].version,
                    description: extension.shortDescription || '',
                    galleryInformation: {
                        galleryApiUrl: _this.extensionsGalleryUrl,
                        id: extension.extensionId,
                        downloadUrl: extension.versions[0].assetUri + "/Microsoft.VisualStudio.Services.VSIXPackage?install=true",
                        publisherId: extension.publisher.publisherId,
                        publisherDisplayName: extension.publisher.displayName,
                        date: extension.versions[0].lastUpdated
                    }
                }); });
            });
        };
        GalleryService = __decorate([
            __param(0, request_1.IRequestService),
            __param(1, contextService_1.IWorkspaceContextService)
        ], GalleryService);
        return GalleryService;
    })();
    exports.GalleryService = GalleryService;
});
//# sourceMappingURL=vsoGalleryService.js.map