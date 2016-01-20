/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/nls', 'vs/base/common/winjs.base', 'vs/base/common/paths', 'vs/base/common/platform', 'vs/base/common/bits/encoding', 'vs/base/common/errors', 'vs/base/common/strings', 'vs/base/common/uri', 'vs/base/common/timer', 'vs/platform/files/common/files', 'vs/workbench/services/files/node/fileService', 'vs/platform/configuration/common/configuration', 'electron'], function (require, exports, nls, winjs_base_1, paths, platform, encoding, errors, strings, uri_1, timer, files, fileService_1, configuration_1, electron_1) {
    var FileService = (function () {
        function FileService(configurationService, eventService, contextService) {
            var _this = this;
            this.configurationService = configurationService;
            this.eventService = eventService;
            this.contextService = contextService;
            this.serviceId = files.IFileService;
            // Init raw implementation
            this.raw = this.configurationService.loadConfiguration().then(function (configuration) {
                // adjust encodings (TODO@Ben knowledge on settings location ('.vscode') is hardcoded)
                var encodingOverride = [];
                encodingOverride.push({ resource: uri_1.default.file(_this.contextService.getConfiguration().env.appSettingsHome), encoding: encoding.UTF8 });
                if (_this.contextService.getWorkspace()) {
                    encodingOverride.push({ resource: uri_1.default.file(paths.join(_this.contextService.getWorkspace().resource.fsPath, '.vscode')), encoding: encoding.UTF8 });
                }
                var doNotWatch = ['**/.git/objects/**']; // this folder does the heavy duty for git and we don't need to watch it
                if (platform.isLinux) {
                    doNotWatch.push('**/node_modules/**'); // Linux does not have a good watching implementation, so we exclude more
                }
                // build config
                var fileServiceConfig = {
                    errorLogger: function (msg) { return errors.onUnexpectedError(msg); },
                    encoding: configuration.files && configuration.files.encoding,
                    encodingOverride: encodingOverride,
                    watcherIgnoredPatterns: doNotWatch,
                    verboseLogging: _this.contextService.getConfiguration().env.verboseLogging
                };
                // create service
                var workspace = _this.contextService.getWorkspace();
                return new fileService_1.FileService(workspace ? workspace.resource.fsPath : void 0, _this.eventService, fileServiceConfig);
            });
            // Listeners
            this.raw.done(function (raw) {
                _this.registerListeners();
            }, errors.onUnexpectedError);
        }
        FileService.prototype.registerListeners = function () {
            var _this = this;
            // Config Changes
            this.configurationChangeListenerUnbind = this.configurationService.addListener(configuration_1.ConfigurationServiceEventTypes.UPDATED, function (e) { return _this.onConfigurationChange(e.config); });
        };
        FileService.prototype.onConfigurationChange = function (configuration) {
            this.updateOptions(configuration.files);
        };
        FileService.prototype.updateOptions = function (options) {
            this.raw.done(function (raw) {
                raw.updateOptions(options);
            }, errors.onUnexpectedError);
        };
        FileService.prototype.resolveFile = function (resource, options) {
            return this.raw.then(function (raw) {
                return raw.resolveFile(resource, options);
            });
        };
        FileService.prototype.resolveContent = function (resource, options) {
            var contentId = resource.toString();
            var timerEvent = timer.start(timer.Topic.WORKBENCH, strings.format('Load {0}', contentId));
            return this.raw.then(function (raw) {
                return raw.resolveContent(resource, options).then(function (result) {
                    timerEvent.stop();
                    return result;
                });
            });
        };
        FileService.prototype.resolveContents = function (resources) {
            return this.raw.then(function (raw) {
                return raw.resolveContents(resources);
            });
        };
        FileService.prototype.updateContent = function (resource, value, options) {
            var timerEvent = timer.start(timer.Topic.WORKBENCH, strings.format('Save {0}', resource.toString()));
            return this.raw.then(function (raw) {
                return raw.updateContent(resource, value, options).then(function (result) {
                    timerEvent.stop();
                    return result;
                }, function (error) {
                    timerEvent.stop();
                    return winjs_base_1.Promise.wrapError(error);
                });
            });
        };
        FileService.prototype.moveFile = function (source, target, overwrite) {
            return this.raw.then(function (raw) {
                return raw.moveFile(source, target, overwrite);
            });
        };
        FileService.prototype.copyFile = function (source, target, overwrite) {
            return this.raw.then(function (raw) {
                return raw.copyFile(source, target, overwrite);
            });
        };
        FileService.prototype.createFile = function (resource, content) {
            return this.raw.then(function (raw) {
                return raw.createFile(resource, content);
            });
        };
        FileService.prototype.createFolder = function (resource) {
            return this.raw.then(function (raw) {
                return raw.createFolder(resource);
            });
        };
        FileService.prototype.rename = function (resource, newName) {
            return this.raw.then(function (raw) {
                return raw.rename(resource, newName);
            });
        };
        FileService.prototype.del = function (resource, useTrash) {
            if (useTrash) {
                return this.doMoveItemToTrash(resource);
            }
            return this.raw.then(function (raw) {
                return raw.del(resource);
            });
        };
        FileService.prototype.doMoveItemToTrash = function (resource) {
            var workspace = this.contextService.getWorkspace();
            if (!workspace) {
                return winjs_base_1.Promise.wrapError('Need a workspace to use this');
            }
            var absolutePath = resource.fsPath;
            var result = electron_1.shell.moveItemToTrash(absolutePath);
            if (!result) {
                return winjs_base_1.TPromise.wrapError(new Error(nls.localize('trashFailed', "Failed to move '{0}' to the trash", paths.basename(absolutePath))));
            }
            return winjs_base_1.Promise.as(null);
        };
        FileService.prototype.importFile = function (source, targetFolder) {
            return this.raw.then(function (raw) {
                return raw.importFile(source, targetFolder).then(function (result) {
                    return {
                        isNew: result && result.isNew,
                        stat: result && result.stat
                    };
                });
            });
        };
        FileService.prototype.watchFileChanges = function (resource) {
            if (!resource) {
                return;
            }
            if (resource.scheme !== 'file') {
                return; // only support files
            }
            // return early if the resource is inside the workspace for which we have another watcher in place
            if (this.contextService.isInsideWorkspace(resource)) {
                return;
            }
            this.raw.then(function (raw) {
                raw.watchFileChanges(resource);
            });
        };
        FileService.prototype.unwatchFileChanges = function (arg1) {
            this.raw.then(function (raw) {
                raw.unwatchFileChanges(arg1);
            });
        };
        FileService.prototype.dispose = function () {
            // Listeners
            if (this.configurationChangeListenerUnbind) {
                this.configurationChangeListenerUnbind();
                this.configurationChangeListenerUnbind = null;
            }
            // Dispose service
            this.raw.done(function (raw) { return raw.dispose(); });
        };
        return FileService;
    })();
    exports.FileService = FileService;
});
//# sourceMappingURL=fileService.js.map