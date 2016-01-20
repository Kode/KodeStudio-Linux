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
define(["require", "exports", 'vs/nls', 'os', 'path', 'vs/base/common/types', 'vs/base/common/service', 'vs/base/node/pfs', 'vs/base/common/objects', 'vs/base/common/arrays', 'vs/base/node/zip', 'vs/base/common/winjs.base', 'vs/workbench/parts/extensions/common/extensions', 'vs/base/node/request', 'vs/base/node/proxy', 'vs/workbench/services/workspace/common/contextService', 'vs/base/common/async', 'vs/base/common/event', 'vs/workbench/node/userSettings', 'semver', 'vs/base/common/collections'], function (require, exports, nls, os_1, path, types, service_1, pfs, objects_1, arrays_1, zip_1, winjs_base_1, extensions_1, request_1, proxy_1, contextService_1, async_1, event_1, userSettings_1, semver, collections_1) {
    function parseManifest(raw) {
        return new winjs_base_1.Promise(function (c, e) {
            try {
                c(JSON.parse(raw));
            }
            catch (err) {
                e(new Error(nls.localize('invalidManifest', "Extension invalid: package.json is not a JSON file.")));
            }
        });
    }
    function validate(zipPath, extension) {
        return zip_1.buffer(zipPath, 'extension/package.json')
            .then(function (buffer) { return parseManifest(buffer.toString('utf8')); })
            .then(function (manifest) {
            if (extension) {
                if (extension.name !== manifest.name) {
                    return winjs_base_1.Promise.wrapError(Error(nls.localize('invalidName', "Extension invalid: manifest name mismatch.")));
                }
                if (extension.publisher !== manifest.publisher) {
                    return winjs_base_1.Promise.wrapError(Error(nls.localize('invalidPublisher', "Extension invalid: manifest publisher mismatch.")));
                }
                if (extension.version !== manifest.version) {
                    return winjs_base_1.Promise.wrapError(Error(nls.localize('invalidVersion', "Extension invalid: manifest version mismatch.")));
                }
            }
            return winjs_base_1.Promise.as(manifest);
        });
    }
    function createExtension(manifest, galleryInformation, path) {
        var extension = {
            name: manifest.name,
            displayName: manifest.displayName || manifest.name,
            publisher: manifest.publisher,
            version: manifest.version,
            description: manifest.description || ''
        };
        if (galleryInformation) {
            extension.galleryInformation = galleryInformation;
        }
        if (path) {
            extension.path = path;
        }
        return extension;
    }
    var ExtensionsService = (function () {
        function ExtensionsService(contextService) {
            this.contextService = contextService;
            this.serviceId = extensions_1.IExtensionsService;
            this._onInstallExtension = new event_1.Emitter();
            this.onInstallExtension = this._onInstallExtension.event;
            this._onDidInstallExtension = new event_1.Emitter();
            this.onDidInstallExtension = this._onDidInstallExtension.event;
            this._onUninstallExtension = new event_1.Emitter();
            this.onUninstallExtension = this._onUninstallExtension.event;
            this._onDidUninstallExtension = new event_1.Emitter();
            this.onDidUninstallExtension = this._onDidUninstallExtension.event;
            var env = contextService.getConfiguration().env;
            this.extensionsPath = env.userPluginsHome;
        }
        ExtensionsService.prototype.install = function (arg) {
            if (types.isString(arg)) {
                return this.installFromZip(arg);
            }
            return this.installFromGallery(arg);
        };
        ExtensionsService.prototype.installFromGallery = function (extension) {
            var _this = this;
            var galleryInformation = extension.galleryInformation;
            if (!galleryInformation) {
                return winjs_base_1.TPromise.wrapError(new Error(nls.localize('missingGalleryInformation', "Gallery information is missing")));
            }
            var url = galleryInformation.downloadUrl;
            var zipPath = path.join(os_1.tmpdir(), galleryInformation.id);
            var extensionPath = path.join(this.extensionsPath, extension.publisher + "." + extension.name + "-" + extension.version);
            var manifestPath = path.join(extensionPath, 'package.json');
            var settings = winjs_base_1.TPromise.join([
                userSettings_1.UserSettings.getValue(this.contextService, 'http.proxy'),
                userSettings_1.UserSettings.getValue(this.contextService, 'http.proxyStrictSSL')
            ]);
            return settings.then(function (settings) {
                var proxyUrl = settings[0];
                var strictSSL = settings[1];
                var agent = proxy_1.getProxyAgent(url, { proxyUrl: proxyUrl, strictSSL: strictSSL });
                return request_1.download(zipPath, { url: url, agent: agent, strictSSL: strictSSL })
                    .then(function () { return validate(zipPath, extension); })
                    .then(function (manifest) { _this._onInstallExtension.fire(manifest); return manifest; })
                    .then(function (manifest) { return zip_1.extract(zipPath, extensionPath, { sourcePath: 'extension', overwrite: true }).then(function () { return manifest; }); })
                    .then(function (manifest) {
                    manifest = objects_1.assign({ __metadata: galleryInformation }, manifest);
                    return pfs.writeFile(manifestPath, JSON.stringify(manifest, null, '\t'));
                })
                    .then(function () { _this._onDidInstallExtension.fire(extension); return extension; });
            });
        };
        ExtensionsService.prototype.installFromZip = function (zipPath) {
            var _this = this;
            return validate(zipPath).then(function (manifest) {
                var extensionPath = path.join(_this.extensionsPath, manifest.publisher + "." + manifest.name + "-" + manifest.version);
                _this._onInstallExtension.fire(manifest);
                return zip_1.extract(zipPath, extensionPath, { sourcePath: 'extension', overwrite: true })
                    .then(function () { return createExtension(manifest, manifest.__metadata, extensionPath); })
                    .then(function (extension) { _this._onDidInstallExtension.fire(extension); return extension; });
            });
        };
        ExtensionsService.prototype.uninstall = function (extension) {
            var _this = this;
            var extensionPath = this.getInstallationPath(extension);
            return pfs.exists(extensionPath)
                .then(function (exists) { return exists ? null : winjs_base_1.Promise.wrapError(new Error(nls.localize('notExists', "Could not find extension"))); })
                .then(function () { return _this._onUninstallExtension.fire(extension); })
                .then(function () { return pfs.rimraf(extensionPath); })
                .then(function () { return _this._onDidUninstallExtension.fire(extension); });
        };
        ExtensionsService.prototype.getInstalled = function (includeDuplicateVersions) {
            if (includeDuplicateVersions === void 0) { includeDuplicateVersions = false; }
            var all = this.getAllInstalled();
            if (includeDuplicateVersions) {
                return all;
            }
            return all.then(function (plugins) {
                var byId = collections_1.values(collections_1.groupBy(plugins, function (p) { return (p.publisher + "." + p.name); }));
                return byId.map(function (p) { return p.sort(function (a, b) { return semver.rcompare(a.version, b.version); })[0]; });
            });
        };
        ExtensionsService.prototype.getDeprecated = function () {
            return this.getAllInstalled().then(function (plugins) {
                var byId = collections_1.values(collections_1.groupBy(plugins, function (p) { return (p.publisher + "." + p.name); }));
                return arrays_1.flatten(byId.map(function (p) { return p.sort(function (a, b) { return semver.rcompare(a.version, b.version); }).slice(1); }));
            });
        };
        ExtensionsService.prototype.getAllInstalled = function () {
            var _this = this;
            var limiter = new async_1.Limiter(10);
            return pfs.readdir(this.extensionsPath)
                .then(function (extensions) { return winjs_base_1.Promise.join(extensions.map(function (e) {
                var extensionPath = path.join(_this.extensionsPath, e);
                return limiter.queue(function () { return pfs.readFile(path.join(extensionPath, 'package.json'), 'utf8')
                    .then(function (raw) { return parseManifest(raw); })
                    .then(function (manifest) { return createExtension(manifest, manifest.__metadata, extensionPath); })
                    .then(null, function () { return null; }); });
            })); })
                .then(function (result) { return result.filter(function (a) { return !!a; }); });
        };
        ExtensionsService.prototype.getInstallationPath = function (extension) {
            return extension.path || path.join(this.extensionsPath, extension.publisher + "." + extension.name + "-" + extension.version);
        };
        ExtensionsService.prototype.removeDeprecatedExtensions = function () {
            return this.getDeprecated()
                .then(function (extensions) { return winjs_base_1.TPromise.join(extensions.filter(function (e) { return !!e.path; }).map(function (e) { return pfs.rimraf(e.path); })); });
        };
        __decorate([
            service_1.ServiceEvent
        ], ExtensionsService.prototype, "onInstallExtension");
        __decorate([
            service_1.ServiceEvent
        ], ExtensionsService.prototype, "onDidInstallExtension");
        __decorate([
            service_1.ServiceEvent
        ], ExtensionsService.prototype, "onUninstallExtension");
        __decorate([
            service_1.ServiceEvent
        ], ExtensionsService.prototype, "onDidUninstallExtension");
        ExtensionsService = __decorate([
            __param(0, contextService_1.IWorkspaceContextService)
        ], ExtensionsService);
        return ExtensionsService;
    })();
    exports.ExtensionsService = ExtensionsService;
});
//# sourceMappingURL=extensionsService.js.map