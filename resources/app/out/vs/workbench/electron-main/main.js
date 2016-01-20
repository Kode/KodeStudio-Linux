/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'electron', 'fs', 'vs/nls', 'vs/base/common/objects', 'vs/base/common/platform', 'vs/workbench/electron-main/env', 'vs/workbench/electron-main/windows', 'vs/workbench/electron-main/lifecycle', 'vs/workbench/electron-main/menus', 'vs/workbench/electron-main/settings', 'vs/workbench/electron-main/update-manager', 'vs/base/node/service.net', 'vs/base/node/env', 'vs/base/common/winjs.base', 'vs/workbench/parts/git/electron-main/askpassService', 'vs/workbench/electron-main/sharedProcess'], function (require, exports, electron_1, fs, nls, objects_1, platform, env, windows, lifecycle, menu, settings, update_manager_1, service_net_1, env_1, winjs_base_1, askpassService_1, sharedProcess_1) {
    var LaunchService = (function () {
        function LaunchService() {
        }
        LaunchService.prototype.start = function (args, userEnv) {
            env.log('Received data from other instance', args);
            // Otherwise handle in windows manager
            if (!!args.pluginDevelopmentPath) {
                windows.manager.openPluginDevelopmentHostWindow({ cli: args, userEnv: userEnv });
            }
            else if (args.pathArguments.length === 0 && args.openNewWindow) {
                windows.manager.open({ cli: args, userEnv: userEnv, forceNewWindow: true, forceEmpty: true });
            }
            else if (args.pathArguments.length === 0) {
                windows.manager.focusLastActive(args);
            }
            else {
                windows.manager.open({ cli: args, userEnv: userEnv, forceNewWindow: !args.openInSameWindow });
            }
            return winjs_base_1.Promise.as(null);
        };
        return LaunchService;
    })();
    exports.LaunchService = LaunchService;
    // We handle uncaught exceptions here to prevent electron from opening a dialog to the user
    process.on('uncaughtException', function (err) {
        if (err) {
            // take only the message and stack property
            var friendlyError = {
                message: err.message,
                stack: err.stack
            };
            // handle on client side
            windows.manager.sendToFocused('vscode:reportError', JSON.stringify(friendlyError));
        }
        console.error('[uncaught exception in main]: ' + err);
        if (err.stack) {
            console.error(err.stack);
        }
    });
    function quit(arg) {
        var exitCode = 0;
        if (typeof arg === 'string') {
            env.log(arg);
        }
        else {
            exitCode = 1; // signal error to the outside
            if (arg.stack) {
                console.error(arg.stack);
            }
            else {
                console.error('Startup error: ' + arg.toString());
            }
        }
        process.exit(exitCode);
    }
    function main(ipcServer, userEnv) {
        env.log('### VSCode main.js ###');
        env.log(env.appRoot, env.cliArgs);
        // Setup Windows mutex
        var windowsMutex = null;
        try {
            var Mutex_1 = require.__$__nodeRequire('windows-mutex').Mutex;
            windowsMutex = new Mutex_1(env.product.win32MutexName);
        }
        catch (e) {
        }
        // Register IPC services
        ipcServer.registerService('LaunchService', new LaunchService());
        ipcServer.registerService('GitAskpassService', new askpassService_1.GitAskpassService());
        // Used by sub processes to communicate back to the main instance
        process.env['VSCODE_PID'] = '' + process.pid;
        process.env['VSCODE_IPC_HOOK'] = env.mainIPCHandle;
        process.env['VSCODE_SHARED_IPC_HOOK'] = env.sharedIPCHandle;
        // Spawn shared process
        var sharedProcess = sharedProcess_1.spawnSharedProcess();
        // Make sure we associate the program with the app user model id
        // This will help Windows to associate the running program with
        // any shortcut that is pinned to the taskbar and prevent showing
        // two icons in the taskbar for the same app.
        if (platform.isWindows && env.product.win32AppUserModelId) {
            electron_1.app.setAppUserModelId(env.product.win32AppUserModelId);
        }
        // Set programStart in the global scope
        global.programStart = env.cliArgs.programStart;
        // Dispose on app quit
        electron_1.app.on('will-quit', function () {
            env.log('App#dispose: deleting running instance handle');
            if (ipcServer) {
                ipcServer.dispose();
                ipcServer = null;
            }
            sharedProcess.kill();
            if (windowsMutex) {
                windowsMutex.release();
            }
        });
        // Lifecycle
        lifecycle.manager.ready();
        // Load settings
        settings.manager.loadSync();
        // Propagate to clients
        windows.manager.ready(userEnv);
        // Install Menu
        menu.manager.ready();
        // Install Tasks
        if (platform.isWindows && env.isBuilt) {
            electron_1.app.setUserTasks([
                {
                    title: nls.localize('newWindow', "New Window"),
                    program: process.execPath,
                    arguments: '-n',
                    iconPath: process.execPath,
                    iconIndex: 0
                }
            ]);
        }
        // Setup auto update
        update_manager_1.Instance.initialize();
        // Open our first window
        if (env.cliArgs.openNewWindow) {
            windows.manager.open({ cli: env.cliArgs, forceNewWindow: true, forceEmpty: true }); // empty window if "-n" was used
        }
        else if (global.macOpenFiles && global.macOpenFiles.length && (!env.cliArgs.pathArguments || !env.cliArgs.pathArguments.length)) {
            windows.manager.open({ cli: env.cliArgs, pathsToOpen: global.macOpenFiles }); // mac: open-file event received on startup
        }
        else {
            windows.manager.open({ cli: env.cliArgs }); // default: read paths from cli
        }
    }
    function setupIPC() {
        function setup(retry) {
            return service_net_1.serve(env.mainIPCHandle).then(null, function (err) {
                if (err.code !== 'EADDRINUSE') {
                    return winjs_base_1.Promise.wrapError(err);
                }
                // there's a running instance, let's connect to it
                return service_net_1.connect(env.mainIPCHandle).then(function (client) {
                    // Tests from CLI require to be the only instance currently (TODO@Ben support multiple instances and output)
                    if (env.isTestingFromCli) {
                        var errorMsg = 'Running extension tests from the command line is currently only supported if no other instance of Code is running.';
                        console.error(errorMsg);
                        return winjs_base_1.Promise.wrapError(errorMsg);
                    }
                    env.log('Sending env to running instance...');
                    var service = client.getService('LaunchService', LaunchService);
                    return service.start(env.cliArgs, process.env)
                        .then(function () { return client.dispose(); })
                        .then(function () { return winjs_base_1.Promise.wrapError('Sent env to running instance. Terminating...'); });
                }, function (err) {
                    if (!retry || platform.isWindows || err.code !== 'ECONNREFUSED') {
                        return winjs_base_1.Promise.wrapError(err);
                    }
                    // it happens on Linux and OS X that the pipe is left behind
                    // let's delete it, since we can't connect to it
                    // and the retry the whole thing
                    try {
                        fs.unlinkSync(env.mainIPCHandle);
                    }
                    catch (e) {
                        env.log('Fatal error deleting obsolete instance handle', e);
                        return winjs_base_1.Promise.wrapError(e);
                    }
                    return setup(false);
                });
            });
        }
        return setup(true);
    }
    // On some platforms we need to manually read from the global environment variables
    // and assign them to the process environment (e.g. when doubleclick app on Mac)
    env_1.getUserEnvironment()
        .then(function (userEnv) {
        objects_1.assign(process.env, userEnv);
        return setupIPC()
            .then(function (ipcServer) { return main(ipcServer, userEnv); });
    })
        .done(null, quit);
});
//# sourceMappingURL=main.js.map