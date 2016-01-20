/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", 'child_process', 'vs/base/common/uri', 'vs/base/common/objects', 'vs/workbench/electron-main/env', 'vs/workbench/electron-main/settings', 'vs/workbench/electron-main/update-manager'], function (require, exports, cp, uri_1, objects_1, env, settings_1, update_manager_1) {
    var boostrapPath = uri_1.default.parse(require.toUrl('bootstrap')).fsPath;
    function getEnvironment() {
        var configuration = objects_1.assign({}, env.cliArgs);
        configuration.execPath = process.execPath;
        configuration.appName = env.product.nameLong;
        configuration.appRoot = env.appRoot;
        configuration.version = env.version;
        configuration.commitHash = env.product.commit;
        configuration.appSettingsHome = env.appSettingsHome;
        configuration.appSettingsPath = env.appSettingsPath;
        configuration.appKeybindingsPath = env.appKeybindingsPath;
        configuration.userPluginsHome = env.userPluginsHome;
        configuration.isBuilt = env.isBuilt;
        configuration.updateFeedUrl = update_manager_1.Instance.feedUrl;
        configuration.updateChannel = update_manager_1.Instance.channel;
        configuration.extensionsGallery = env.product.extensionsGallery;
        return configuration;
    }
    function spawnSharedProcess() {
        var result = cp.fork(boostrapPath, ['--type=SharedProcess'], {
            env: objects_1.assign(objects_1.assign({}, process.env), {
                AMD_ENTRYPOINT: 'vs/workbench/electron-main/sharedProcessMain'
            })
        });
        // handshake
        result.once('message', function () {
            result.send({
                configuration: {
                    env: getEnvironment()
                },
                contextServiceOptions: {
                    globalSettings: settings_1.manager.globalSettings
                }
            });
        });
        return result;
    }
    exports.spawnSharedProcess = spawnSharedProcess;
});
//# sourceMappingURL=sharedProcess.js.map