/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/base/common/winjs.base', 'vs/workbench/electron-browser/shell', 'vs/base/common/errors', 'vs/base/common/platform', 'vs/base/common/paths', 'vs/base/common/timer', 'vs/base/common/objects', 'vs/base/common/uri', 'vs/base/common/strings', 'path', 'fs', 'graceful-fs'], function (require, exports, winjs, shell_1, errors, platform, paths, timer, objects_1, uri_1, strings, path, fs, gracefulFs) {
    gracefulFs.gracefulify(fs);
    function startup(environment, globalSettings) {
        // Inherit the user environment
        objects_1.assign(process.env, environment.userEnv);
        // Shell Configuration
        var shellConfiguration = {
            env: environment
        };
        // Shell Options
        var filesToOpen = environment.filesToOpen && environment.filesToOpen.length ? toInputs(environment.filesToOpen) : null;
        var filesToCreate = environment.filesToCreate && environment.filesToCreate.length ? toInputs(environment.filesToCreate) : null;
        var shellOptions = {
            singleFileMode: !environment.workspacePath,
            filesToOpen: filesToOpen,
            filesToCreate: filesToCreate,
            extensionsToInstall: environment.extensionsToInstall,
            globalSettings: globalSettings
        };
        if (environment.enablePerformance) {
            timer.ENABLE_TIMER = true;
        }
        // Open workbench
        return openWorkbench(getWorkspace(environment), shellConfiguration, shellOptions);
    }
    exports.startup = startup;
    function toInputs(paths) {
        return paths.map(function (p) {
            var input = {
                resource: uri_1.default.file(p.filePath)
            };
            if (p.lineNumber) {
                input.options = {
                    selection: {
                        startLineNumber: p.lineNumber,
                        startColumn: p.columnNumber
                    }
                };
            }
            return input;
        });
    }
    function getWorkspace(environment) {
        if (!environment.workspacePath) {
            return null;
        }
        var realWorkspacePath = path.normalize(fs.realpathSync(environment.workspacePath));
        if (paths.isUNC(realWorkspacePath) && strings.endsWith(realWorkspacePath, paths.nativeSep)) {
            // for some weird reason, node adds a trailing slash to UNC paths
            // we never ever want trailing slashes as our workspace path unless
            // someone opens root ("/").
            // See also https://github.com/nodejs/io.js/issues/1765
            realWorkspacePath = strings.rtrim(realWorkspacePath, paths.nativeSep);
        }
        var workspaceResource = uri_1.default.file(realWorkspacePath);
        var folderName = path.basename(realWorkspacePath) || realWorkspacePath;
        var folderStat = fs.statSync(realWorkspacePath);
        var workspace = {
            'resource': workspaceResource,
            'id': platform.isLinux ? realWorkspacePath : realWorkspacePath.toLowerCase(),
            'name': folderName,
            'uid': platform.isLinux ? folderStat.ino : folderStat.birthtime.getTime(),
            'mtime': folderStat.mtime.getTime()
        };
        return workspace;
    }
    function openWorkbench(workspace, configuration, options) {
        window.MonacoEnvironment.timers.beforeReady = new Date();
        return winjs.Utilities.ready(function () {
            window.MonacoEnvironment.timers.afterReady = new Date();
            // Monaco Workbench Shell
            var beforeOpen = new Date();
            var shell = new shell_1.WorkbenchShell(document.body, workspace, configuration, options);
            shell.open();
            shell.joinCreation().then(function () {
                timer.start(timer.Topic.STARTUP, 'Open Shell, Viewlet & Editor', beforeOpen, 'Workbench has opened after this event with viewlet and editor restored').stop();
            });
            // Inform user about loading issues from the loader
            self.require.config({
                onError: function (err) {
                    if (err.errorCode === 'load') {
                        shell.onUnexpectedError(errors.loaderError(err));
                    }
                }
            });
        }, true);
    }
});
//# sourceMappingURL=main.js.map