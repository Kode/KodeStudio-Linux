/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/base/node/pfs', 'vs/base/common/winjs.base', 'vs/base/common/collections', 'vs/base/common/paths', 'vs/base/common/json', 'vs/platform/plugins/node/pluginVersionValidator', 'semver'], function (require, exports, pfs, winjs_base_1, collections_1, paths, json, pluginVersionValidator_1, semver) {
    var MANIFEST_FILE = 'package.json';
    var PluginScanner = (function () {
        function PluginScanner() {
        }
        /**
         * Scan the plugin defined in `absoluteFolderPath`
         */
        PluginScanner.scanPlugin = function (version, collector, absoluteFolderPath, isBuiltin) {
            absoluteFolderPath = paths.normalize(absoluteFolderPath);
            var builder = collector.scopeTo(absoluteFolderPath);
            var absoluteManifestPath = paths.join(absoluteFolderPath, MANIFEST_FILE);
            return pfs.readFile(absoluteManifestPath).then(function (manifestContents) {
                var errors = [];
                var pluginDescFromFile = json.parse(manifestContents.toString(), errors);
                if (errors.length > 0) {
                    errors.forEach(function (error) {
                        builder.error('Failed to parse ' + absoluteManifestPath + ': ' + error);
                    });
                    return null;
                }
                return pluginDescFromFile;
            }).then(function (pluginDescFromFile) {
                if (pluginDescFromFile === null) {
                    return null;
                }
                pluginDescFromFile.isBuiltin = isBuiltin;
                var notices = [];
                if (!pluginVersionValidator_1.isValidPluginDescription(version, absoluteFolderPath, pluginDescFromFile, notices)) {
                    notices.forEach(function (error) {
                        builder.error(error);
                    });
                    return null;
                }
                // in this case the notices are warnings
                notices.forEach(function (error) {
                    builder.warn(error);
                });
                // id := `publisher.name`
                pluginDescFromFile.id = pluginDescFromFile.publisher + "." + pluginDescFromFile.name;
                // main := absolutePath(`main`)
                if (pluginDescFromFile.main) {
                    pluginDescFromFile.main = paths.normalize(paths.join(absoluteFolderPath, pluginDescFromFile.main));
                }
                pluginDescFromFile.extensionFolderPath = absoluteFolderPath;
                return pluginDescFromFile;
            }, function (err) {
                builder.error('Cannot read file ' + absoluteManifestPath + ': ' + err.message);
                return null;
            });
        };
        /**
         * Scan a list of extensions defined in `absoluteFolderPath`
         */
        PluginScanner.scanPlugins = function (version, collector, absoluteFolderPath, isBuiltin) {
            var _this = this;
            return pfs.readDirsInDir(absoluteFolderPath)
                .then(function (folders) { return winjs_base_1.TPromise.join(folders.map(function (f) { return _this.scanPlugin(version, collector, paths.join(absoluteFolderPath, f), isBuiltin); })); })
                .then(function (plugins) { return plugins.filter(function (item) { return item !== null; }); })
                .then(function (plugins) {
                var pluginsById = collections_1.values(collections_1.groupBy(plugins, function (p) { return p.id; }));
                return pluginsById.map(function (p) { return p.sort(function (a, b) { return semver.rcompare(a.version, b.version); })[0]; });
            })
                .then(null, function (err) {
                collector.error(absoluteFolderPath, err);
                return [];
            });
        };
        /**
         * Combination of scanPlugin and scanPlugins: If a plugin manifest is found at root, we load just this plugin, otherwise we assume
         * the folder contains multiple extensions.
         */
        PluginScanner.scanOneOrMultiplePlugins = function (version, collector, absoluteFolderPath, isBuiltin) {
            var _this = this;
            return pfs.fileExists(paths.join(absoluteFolderPath, MANIFEST_FILE)).then(function (exists) {
                if (exists) {
                    return _this.scanPlugin(version, collector, absoluteFolderPath, isBuiltin).then(function (pluginDescription) {
                        if (pluginDescription === null) {
                            return [];
                        }
                        return [pluginDescription];
                    });
                }
                return _this.scanPlugins(version, collector, absoluteFolderPath, isBuiltin);
            }, function (err) {
                collector.error(absoluteFolderPath, err);
                return [];
            });
        };
        return PluginScanner;
    })();
    exports.PluginScanner = PluginScanner;
});
//# sourceMappingURL=extensionPoints.js.map