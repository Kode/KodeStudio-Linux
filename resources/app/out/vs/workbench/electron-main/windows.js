/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'events', 'path', 'fs', 'electron', 'vs/base/common/platform', 'vs/workbench/electron-main/env', 'vs/workbench/electron-main/window', 'vs/workbench/electron-main/lifecycle', 'vs/nls', 'vs/base/common/paths', 'vs/base/common/json', 'vs/base/common/arrays', 'vs/base/common/objects', 'vs/workbench/electron-main/storage', 'vs/workbench/electron-main/settings', 'vs/workbench/electron-main/update-manager'], function (require, exports, events, path, fs, electron_1, platform, env, window, lifecycle, nls, paths, json, arrays, objects, storage, settings, update_manager_1) {
    var eventEmitter = new events.EventEmitter();
    var EventTypes = {
        OPEN: 'open',
        CLOSE: 'close',
        READY: 'ready'
    };
    function onOpen(clb) {
        eventEmitter.addListener(EventTypes.OPEN, clb);
        return function () { return eventEmitter.removeListener(EventTypes.OPEN, clb); };
    }
    exports.onOpen = onOpen;
    function onReady(clb) {
        eventEmitter.addListener(EventTypes.READY, clb);
        return function () { return eventEmitter.removeListener(EventTypes.READY, clb); };
    }
    exports.onReady = onReady;
    function onClose(clb) {
        eventEmitter.addListener(EventTypes.CLOSE, clb);
        return function () { return eventEmitter.removeListener(EventTypes.CLOSE, clb); };
    }
    exports.onClose = onClose;
    var WindowError;
    (function (WindowError) {
        WindowError[WindowError["UNRESPONSIVE"] = 0] = "UNRESPONSIVE";
        WindowError[WindowError["CRASHED"] = 1] = "CRASHED";
    })(WindowError || (WindowError = {}));
    var WindowsManager = (function () {
        function WindowsManager() {
        }
        WindowsManager.prototype.ready = function (initialUserEnv) {
            this.registerListeners();
            this.initialUserEnv = initialUserEnv;
            this.windowsState = storage.getItem(WindowsManager.windowsStateStorageKey) || { openedFolders: [] };
        };
        WindowsManager.prototype.registerListeners = function () {
            var _this = this;
            electron_1.app.on('activate', function (event, hasVisibleWindows) {
                env.log('App#activate');
                // Mac only event: reopen last window when we get activated
                if (!hasVisibleWindows) {
                    // We want to open the previously opened folder, so we dont pass on the path argument
                    var cliArgWithoutPath = objects.clone(env.cliArgs);
                    cliArgWithoutPath.pathArguments = [];
                    _this.windowsState.openedFolders = []; // make sure we do not restore too much
                    _this.open({ cli: cliArgWithoutPath });
                }
            });
            var macOpenFiles = [];
            var runningTimeout = null;
            electron_1.app.on('open-file', function (event, path) {
                env.log('App#open-file: ', path);
                event.preventDefault();
                // Keep in array because more might come!
                macOpenFiles.push(path);
                // Clear previous handler if any
                if (runningTimeout !== null) {
                    clearTimeout(runningTimeout);
                    runningTimeout = null;
                }
                // Handle paths delayed in case more are coming!
                runningTimeout = setTimeout(function () {
                    _this.open({ cli: env.cliArgs, pathsToOpen: macOpenFiles, forceNewWindow: true /* dropping on the dock should force open in a new window */ });
                    macOpenFiles = [];
                    runningTimeout = null;
                }, 100);
            });
            settings.manager.onChange(function (newSettings) {
                _this.sendToAll('vscode:optionsChange', JSON.stringify({ globalSettings: newSettings }));
            }, this);
            electron_1.ipcMain.on('vscode:startCrashReporter', function (event, config) {
                electron_1.crashReporter.start(config);
            });
            electron_1.ipcMain.on('vscode:windowOpen', function (event, paths, forceNewWindow) {
                env.log('IPC#vscode-windowOpen: ', paths);
                if (paths && paths.length) {
                    _this.open({ cli: env.cliArgs, pathsToOpen: paths, forceNewWindow: forceNewWindow });
                }
            });
            electron_1.ipcMain.on('vscode:workbenchLoaded', function (event, windowId) {
                env.log('IPC#vscode-workbenchLoaded');
                var win = _this.getWindowById(windowId);
                if (win) {
                    win.setReady();
                    // Event
                    eventEmitter.emit(EventTypes.READY, win);
                    // TODO@Ben remove me in a couple of versions
                    _this.migrateAutoSave(win);
                }
            });
            electron_1.ipcMain.on('vscode:openFilePicker', function () {
                env.log('IPC#vscode-openFilePicker');
                _this.openFilePicker();
            });
            electron_1.ipcMain.on('vscode:openFolderPicker', function () {
                env.log('IPC#vscode-openFolderPicker');
                _this.openFolderPicker();
            });
            electron_1.ipcMain.on('vscode:closeFolder', function (event, windowId) {
                env.log('IPC#vscode-closeFolder');
                var win = _this.getWindowById(windowId);
                if (win) {
                    _this.open({ cli: env.cliArgs, forceEmpty: true, windowToUse: win });
                }
            });
            electron_1.ipcMain.on('vscode:openNewWindow', function () {
                env.log('IPC#vscode-openNewWindow');
                _this.openNewWindow();
            });
            electron_1.ipcMain.on('vscode:openFileFolderPicker', function () {
                env.log('IPC#vscode-openFileFolderPicker');
                _this.openFolderPicker();
            });
            electron_1.ipcMain.on('vscode:reloadWindow', function (event, windowId) {
                env.log('IPC#vscode:reloadWindow');
                var vscodeWindow = _this.getWindowById(windowId);
                if (vscodeWindow) {
                    _this.reload(vscodeWindow);
                }
            });
            electron_1.ipcMain.on('vscode:toggleFullScreen', function (event, windowId) {
                env.log('IPC#vscode:toggleFullScreen');
                var vscodeWindow = _this.getWindowById(windowId);
                if (vscodeWindow) {
                    vscodeWindow.toggleFullScreen();
                }
            });
            electron_1.ipcMain.on('vscode:toggleMenuBar', function (event, windowId) {
                env.log('IPC#vscode:toggleMenuBar');
                // Update in settings
                var menuBarHidden = storage.getItem(window.VSCodeWindow.menuBarHiddenKey, false);
                var newMenuBarHidden = !menuBarHidden;
                storage.setItem(window.VSCodeWindow.menuBarHiddenKey, newMenuBarHidden);
                // Update across windows
                WindowsManager.WINDOWS.forEach(function (w) { return w.setMenuBarVisibility(!newMenuBarHidden); });
            });
            electron_1.ipcMain.on('vscode:changeTheme', function (event, theme) {
                _this.sendToAll('vscode:changeTheme', theme);
                storage.setItem(window.VSCodeWindow.themeStorageKey, theme);
            });
            electron_1.ipcMain.on('vscode:broadcast', function (event, windowId, target, broadcast) {
                if (broadcast.channel && broadcast.payload) {
                    if (target) {
                        var otherWindowsWithTarget = WindowsManager.WINDOWS.filter(function (w) { return w.id !== windowId && typeof w.openedWorkspacePath === 'string'; });
                        var directTargetMatch = otherWindowsWithTarget.filter(function (w) { return _this.isPathEqual(target, w.openedWorkspacePath); });
                        var parentTargetMatch = otherWindowsWithTarget.filter(function (w) { return paths.isEqualOrParent(target, w.openedWorkspacePath); });
                        var targetWindow = directTargetMatch.length ? directTargetMatch[0] : parentTargetMatch[0]; // prefer direct match over parent match
                        if (targetWindow) {
                            targetWindow.send('vscode:broadcast', broadcast);
                        }
                    }
                    else {
                        _this.sendToAll('vscode:broadcast', broadcast, [windowId]);
                    }
                }
            });
            electron_1.ipcMain.on('vscode:log', function (event, logEntry) {
                var args = [];
                try {
                    var parsed = JSON.parse(logEntry.arguments);
                    args.push.apply(args, Object.getOwnPropertyNames(parsed).map(function (o) { return parsed[o]; }));
                }
                catch (error) {
                    args.push(logEntry.arguments);
                }
                console[logEntry.severity].apply(console, args);
            });
            electron_1.ipcMain.on('vscode:exit', function (event, code) {
                process.exit(code);
            });
            update_manager_1.Instance.on('update-downloaded', function (update) {
                _this.sendToFocused('vscode:telemetry', { eventName: 'update:downloaded', data: { version: update.version } });
                _this.sendToAll('vscode:update-downloaded', JSON.stringify({
                    releaseNotes: update.releaseNotes,
                    version: update.version,
                    date: update.date
                }));
            });
            electron_1.ipcMain.on('vscode:update-apply', function () {
                env.log('IPC#vscode:update-apply');
                if (update_manager_1.Instance.availableUpdate) {
                    update_manager_1.Instance.availableUpdate.quitAndUpdate();
                }
            });
            update_manager_1.Instance.on('update-not-available', function (explicit) {
                _this.sendToFocused('vscode:telemetry', { eventName: 'update:notAvailable', data: { explicit: explicit } });
                if (explicit) {
                    _this.sendToFocused('vscode:update-not-available', '');
                }
            });
            lifecycle.onBeforeQuit(function () {
                // 0-1 window open: Do not keep the list but just rely on the active window to be stored
                if (WindowsManager.WINDOWS.length < 2) {
                    _this.windowsState.openedFolders = [];
                    return;
                }
                // 2-N windows open: Keep a list of windows that are opened on a specific folder to restore it in the next session as needed
                _this.windowsState.openedFolders = WindowsManager.WINDOWS.filter(function (w) { return w.readyState === window.ReadyState.READY && !!w.openedWorkspacePath && !w.isPluginDevelopmentHost; }).map(function (w) {
                    return {
                        workspacePath: w.openedWorkspacePath,
                        uiState: w.serializeWindowState()
                    };
                });
            });
            electron_1.app.on('will-quit', function () {
                storage.setItem(WindowsManager.windowsStateStorageKey, _this.windowsState);
            });
            var loggedStartupTimes = false;
            onReady(function (window) {
                if (loggedStartupTimes) {
                    return; // only for the first window
                }
                loggedStartupTimes = true;
                window.send('vscode:telemetry', { eventName: 'startupTime', data: { ellapsed: Date.now() - global.vscodeStart } });
            });
        };
        WindowsManager.prototype.migrateAutoSave = function (win) {
            if (storage.getItem('autoSaveDelay') === 1000) {
                storage.removeItem('autoSaveDelay');
                win.send('vscode:showAutoSaveInfo');
                try {
                    // Initial settings file
                    if (!fs.existsSync(env.appSettingsPath)) {
                        fs.writeFileSync(env.appSettingsPath, JSON.stringify({ 'files.autoSaveDelay': 1 }, null, '    '));
                    }
                    else {
                        var settingsRaw = fs.readFileSync(env.appSettingsPath).toString();
                        var lastClosing = settingsRaw.lastIndexOf('}');
                        var errors = [];
                        var res = json.parse(settingsRaw, errors);
                        // We found a closing '}' and the JSON does not contain errors
                        if (lastClosing > 0 && !errors.length) {
                            var migratedSettings = settingsRaw.substring(0, lastClosing) + '\n    , // Migrated from previous File | Auto Save setting:\n    "files.autoSaveDelay": 1\n}';
                            fs.writeFileSync(env.appSettingsPath, migratedSettings);
                        }
                        else {
                            win.send('vscode:showAutoSaveError');
                        }
                    }
                }
                catch (error) {
                    env.log(error);
                    win.send('vscode:showAutoSaveError');
                }
            }
        };
        WindowsManager.prototype.reload = function (win, cli) {
            // Only reload when the window has not vetoed this
            lifecycle.manager.unload(win).done(function (veto) {
                if (!veto) {
                    win.reload(cli);
                }
            });
        };
        WindowsManager.prototype.open = function (openConfig) {
            var _this = this;
            var iPathsToOpen;
            // Find paths from provided paths if any
            if (openConfig.pathsToOpen && openConfig.pathsToOpen.length > 0) {
                iPathsToOpen = openConfig.pathsToOpen.map(function (pathToOpen) {
                    var iPath = _this.toIPath(pathToOpen, false, openConfig.cli && openConfig.cli.gotoLineMode);
                    // Warn if the requested path to open does not exist
                    if (!iPath) {
                        var options = {
                            title: env.product.nameLong,
                            type: 'info',
                            buttons: [nls.localize('ok', "OK")],
                            message: nls.localize('pathNotExistTitle', "Path does not exist"),
                            detail: nls.localize('pathNotExistDetail', "The path '{0}' does not seem to exist anymore on disk.", pathToOpen),
                            noLink: true
                        };
                        var activeWindow = electron_1.BrowserWindow.getFocusedWindow();
                        if (activeWindow) {
                            electron_1.dialog.showMessageBox(activeWindow, options);
                        }
                        else {
                            electron_1.dialog.showMessageBox(options);
                        }
                    }
                    return iPath;
                });
                // get rid of nulls
                iPathsToOpen = arrays.coalesce(iPathsToOpen);
                if (iPathsToOpen.length === 0) {
                    return false; // indicate to outside that open failed
                }
            }
            else if (openConfig.forceEmpty) {
                iPathsToOpen = [Object.create(null)];
            }
            else {
                var ignoreFileNotFound = openConfig.cli.pathArguments.length > 0; // we assume the user wants to create this file from command line
                iPathsToOpen = this.cliToPaths(openConfig.cli, ignoreFileNotFound);
            }
            var filesToOpen = iPathsToOpen.filter(function (iPath) { return !!iPath.filePath && !iPath.createFilePath && !iPath.installExtensionPath; });
            var filesToCreate = iPathsToOpen.filter(function (iPath) { return !!iPath.filePath && iPath.createFilePath && !iPath.installExtensionPath; });
            var foldersToOpen = iPathsToOpen.filter(function (iPath) { return iPath.workspacePath && !iPath.filePath && !iPath.installExtensionPath; });
            var emptyToOpen = iPathsToOpen.filter(function (iPath) { return !iPath.workspacePath && !iPath.filePath && !iPath.installExtensionPath; });
            var extensionsToInstall = iPathsToOpen.filter(function (iPath) { return iPath.installExtensionPath; }).map(function (ipath) { return ipath.filePath; });
            var configuration;
            // Handle files to open or to create when we dont open a folder
            if (!foldersToOpen.length && (filesToOpen.length > 0 || filesToCreate.length > 0 || extensionsToInstall.length > 0)) {
                // Let the user settings override how files are open in a new window or same window
                var openFilesInNewWindow = openConfig.forceNewWindow;
                if (openFilesInNewWindow && !openConfig.cli.pluginDevelopmentPath) {
                    if (settings.manager.getValue('window.openInNewWindow', null) !== null) {
                        openFilesInNewWindow = settings.manager.getValue('window.openInNewWindow', openFilesInNewWindow); // TODO@Ben remove legacy setting in a couple of versions
                    }
                    else {
                        openFilesInNewWindow = settings.manager.getValue('window.openFilesInNewWindow', openFilesInNewWindow);
                    }
                }
                // Open Files in last instance if any and flag tells us so
                var lastActiveWindow = this.getLastActiveWindow();
                if (!openFilesInNewWindow && lastActiveWindow) {
                    lastActiveWindow.focus();
                    lastActiveWindow.ready().then(function (readyWindow) {
                        readyWindow.send('vscode:openFiles', {
                            filesToOpen: filesToOpen,
                            filesToCreate: filesToCreate
                        });
                        if (extensionsToInstall.length) {
                            readyWindow.send('vscode:installExtensions', { extensionsToInstall: extensionsToInstall });
                        }
                    });
                }
                else {
                    configuration = this.toConfiguration(openConfig.userEnv || this.initialUserEnv, openConfig.cli, null, filesToOpen, filesToCreate, extensionsToInstall);
                    this.openInBrowserWindow(configuration, true /* new window */);
                    openConfig.forceNewWindow = true; // any other folders to open must open in new window then
                }
            }
            // Handle folders to open
            if (foldersToOpen.length > 0) {
                // Check for existing instances
                var windowsOnWorkspacePath = arrays.coalesce(foldersToOpen.map(function (iPath) { return _this.findWindow(iPath.workspacePath); }));
                if (windowsOnWorkspacePath.length > 0) {
                    windowsOnWorkspacePath[0].focus(); // just focus one of them
                    windowsOnWorkspacePath[0].ready().then(function (readyWindow) {
                        readyWindow.send('vscode:openFiles', {
                            filesToOpen: filesToOpen,
                            filesToCreate: filesToCreate
                        });
                        if (extensionsToInstall.length) {
                            readyWindow.send('vscode:installExtensions', { extensionsToInstall: extensionsToInstall });
                        }
                    });
                    // Reset these because we handled them
                    filesToOpen = [];
                    filesToCreate = [];
                    extensionsToInstall = [];
                    openConfig.forceNewWindow = true; // any other folders to open must open in new window then
                }
                // Open remaining ones
                foldersToOpen.forEach(function (folderToOpen) {
                    if (windowsOnWorkspacePath.some(function (win) { return _this.isPathEqual(win.openedWorkspacePath, folderToOpen.workspacePath); })) {
                        return; // ignore folders that are already open
                    }
                    configuration = _this.toConfiguration(openConfig.userEnv || _this.initialUserEnv, openConfig.cli, folderToOpen.workspacePath, filesToOpen, filesToCreate, extensionsToInstall);
                    _this.openInBrowserWindow(configuration, openConfig.forceNewWindow, openConfig.forceNewWindow ? void 0 : openConfig.windowToUse);
                    // Reset these because we handled them
                    filesToOpen = [];
                    filesToCreate = [];
                    extensionsToInstall = [];
                    openConfig.forceNewWindow = true; // any other folders to open must open in new window then
                });
            }
            // Handle empty
            if (emptyToOpen.length > 0) {
                emptyToOpen.forEach(function () {
                    var configuration = _this.toConfiguration(openConfig.userEnv || _this.initialUserEnv, openConfig.cli);
                    _this.openInBrowserWindow(configuration, openConfig.forceNewWindow, openConfig.forceNewWindow ? void 0 : openConfig.windowToUse);
                    openConfig.forceNewWindow = true; // any other folders to open must open in new window then
                });
            }
            // Remember in recent document list
            iPathsToOpen.forEach(function (iPath) {
                if (iPath.filePath || iPath.workspacePath) {
                    electron_1.app.addRecentDocument(iPath.filePath || iPath.workspacePath);
                }
            });
            // Emit events
            iPathsToOpen.forEach(function (iPath) { return eventEmitter.emit(EventTypes.OPEN, iPath); });
            return true;
        };
        WindowsManager.prototype.openPluginDevelopmentHostWindow = function (openConfig) {
            var _this = this;
            // Reload an existing plugin development host window on the same path
            // We currently do not allow more than one extension development window
            // on the same plugin path.
            var res = WindowsManager.WINDOWS.filter(function (w) { return w.config && _this.isPathEqual(w.config.pluginDevelopmentPath, openConfig.cli.pluginDevelopmentPath); });
            if (res && res.length === 1) {
                this.reload(res[0], openConfig.cli);
                res[0].focus(); // make sure it gets focus and is restored
                return;
            }
            // Fill in previously opened workspace unless an explicit path is provided
            if (openConfig.cli.pathArguments.length === 0) {
                var workspaceToOpen = this.windowsState.lastPluginDevelopmentHostWindow && this.windowsState.lastPluginDevelopmentHostWindow.workspacePath;
                if (workspaceToOpen) {
                    openConfig.cli.pathArguments = [workspaceToOpen];
                }
            }
            // Make sure we are not asked to open a path that is already opened
            if (openConfig.cli.pathArguments.length > 0) {
                res = WindowsManager.WINDOWS.filter(function (w) { return w.openedWorkspacePath && openConfig.cli.pathArguments.indexOf(w.openedWorkspacePath) >= 0; });
                if (res.length) {
                    openConfig.cli.pathArguments = [];
                }
            }
            // Open it
            this.open({ cli: openConfig.cli, forceNewWindow: true, forceEmpty: openConfig.cli.pathArguments.length === 0 });
        };
        WindowsManager.prototype.toConfiguration = function (userEnv, cli, workspacePath, filesToOpen, filesToCreate, extensionsToInstall) {
            var configuration = objects.mixin({}, cli); // inherit all properties from CLI
            configuration.execPath = process.execPath;
            configuration.workspacePath = workspacePath;
            configuration.filesToOpen = filesToOpen;
            configuration.filesToCreate = filesToCreate;
            configuration.extensionsToInstall = extensionsToInstall;
            configuration.appName = env.product.nameLong;
            configuration.appRoot = env.appRoot;
            configuration.version = env.version;
            configuration.commitHash = env.product.commit;
            configuration.appSettingsHome = env.appSettingsHome;
            configuration.appSettingsPath = env.appSettingsPath;
            configuration.appKeybindingsPath = env.appKeybindingsPath;
            configuration.userPluginsHome = env.userPluginsHome;
            configuration.sharedIPCHandle = env.sharedIPCHandle;
            configuration.isBuilt = env.isBuilt;
            configuration.crashReporter = env.product.crashReporter;
            configuration.extensionsGallery = env.product.extensionsGallery;
            configuration.welcomePage = env.product.welcomePage;
            configuration.productDownloadUrl = env.product.downloadUrl;
            configuration.releaseNotesUrl = env.product.releaseNotesUrl;
            configuration.updateFeedUrl = update_manager_1.Instance.feedUrl;
            configuration.updateChannel = update_manager_1.Instance.channel;
            configuration.recentPaths = this.getRecentlyOpenedPaths(workspacePath, filesToOpen);
            configuration.aiConfig = env.product.aiConfig;
            configuration.sendASmile = env.product.sendASmile;
            configuration.enableTelemetry = env.product.enableTelemetry;
            configuration.userEnv = userEnv;
            return configuration;
        };
        WindowsManager.prototype.getRecentlyOpenedPaths = function (workspacePath, filesToOpen) {
            // Get from storage
            var openedPathsList = storage.getItem(WindowsManager.openedPathsListStorageKey);
            if (!openedPathsList) {
                openedPathsList = { folders: [], files: [] };
            }
            var recentPaths = openedPathsList.folders.concat(openedPathsList.files);
            // Add currently files to open to the beginning if any
            if (filesToOpen) {
                recentPaths.unshift.apply(recentPaths, filesToOpen.map(function (f) { return f.filePath; }));
            }
            // Add current workspace path to beginning if set
            if (workspacePath) {
                recentPaths.unshift(workspacePath);
            }
            // Clear those dupes
            recentPaths = arrays.distinct(recentPaths);
            // Make sure it is bounded
            return recentPaths.slice(0, 10); // TODO@Ben remove in a couple of versions, it should  be ok then because we limited storage
        };
        WindowsManager.prototype.toIPath = function (anyPath, ignoreFileNotFound, gotoLineMode) {
            if (!anyPath) {
                return null;
            }
            var parsedPath;
            if (gotoLineMode) {
                parsedPath = env.parseLineAndColumnAware(anyPath);
                anyPath = parsedPath.path;
            }
            var candidate = path.normalize(anyPath);
            try {
                var candidateStat = fs.statSync(candidate);
                if (candidateStat) {
                    return candidateStat.isFile() ?
                        {
                            filePath: candidate,
                            lineNumber: gotoLineMode ? parsedPath.line : void 0,
                            columnNumber: gotoLineMode ? parsedPath.column : void 0,
                            installExtensionPath: /\.vsix$/i.test(candidate)
                        } :
                        { workspacePath: candidate };
                }
            }
            catch (error) {
                if (ignoreFileNotFound) {
                    return { filePath: candidate, createFilePath: true }; // assume this is a file that does not yet exist
                }
            }
            return null;
        };
        WindowsManager.prototype.cliToPaths = function (cli, ignoreFileNotFound) {
            var _this = this;
            // Check for pass in candidate or last opened path
            var candidates = [];
            if (cli.pathArguments.length > 0) {
                candidates = cli.pathArguments;
            }
            else {
                var reopenFolders = settings.manager.getValue('window.reopenFolders', 'one');
                var lastActiveFolder = this.windowsState.lastActiveWindow && this.windowsState.lastActiveWindow.workspacePath;
                // Restore all
                if (reopenFolders === 'all') {
                    var lastOpenedFolders = this.windowsState.openedFolders.map(function (o) { return o.workspacePath; });
                    // If we have a last active folder, move it to the end
                    if (lastActiveFolder) {
                        lastOpenedFolders.splice(lastOpenedFolders.indexOf(lastActiveFolder), 1);
                        lastOpenedFolders.push(lastActiveFolder);
                    }
                    candidates.push.apply(candidates, lastOpenedFolders);
                }
                else if (lastActiveFolder && (reopenFolders === 'one' || reopenFolders !== 'none')) {
                    candidates.push(lastActiveFolder);
                }
            }
            var iPaths = candidates.map(function (candidate) { return _this.toIPath(candidate, ignoreFileNotFound, cli.gotoLineMode); }).filter(function (path) { return !!path; });
            if (iPaths.length > 0) {
                return iPaths;
            }
            // No path provided, return empty to open empty
            return [Object.create(null)];
        };
        WindowsManager.prototype.openInBrowserWindow = function (configuration, forceNewWindow, windowToUse) {
            var _this = this;
            var vscodeWindow;
            if (!forceNewWindow) {
                vscodeWindow = windowToUse || this.getLastActiveWindow();
                if (vscodeWindow) {
                    vscodeWindow.focus();
                }
            }
            // New window
            if (!vscodeWindow) {
                vscodeWindow = new window.VSCodeWindow({
                    state: this.getNewWindowState(configuration),
                    isPluginDevelopmentHost: !!configuration.pluginDevelopmentPath
                });
                WindowsManager.WINDOWS.push(vscodeWindow);
                // Window Events
                vscodeWindow.win.webContents.on('crashed', function () { return _this.onWindowError(vscodeWindow.win, WindowError.CRASHED); });
                vscodeWindow.win.on('unresponsive', function () { return _this.onWindowError(vscodeWindow.win, WindowError.UNRESPONSIVE); });
                vscodeWindow.win.on('close', function () { return _this.onBeforeWindowClose(vscodeWindow); });
                vscodeWindow.win.on('closed', function () { return _this.onWindowClosed(vscodeWindow); });
                // Lifecycle
                lifecycle.manager.registerWindow(vscodeWindow);
            }
            else {
                // Some configuration things get inherited if the window is being reused and we are
                // in plugin development host mode. These options are all development related.
                var currentWindowConfig = vscodeWindow.config;
                if (!configuration.pluginDevelopmentPath && currentWindowConfig && !!currentWindowConfig.pluginDevelopmentPath) {
                    configuration.pluginDevelopmentPath = currentWindowConfig.pluginDevelopmentPath;
                    configuration.verboseLogging = currentWindowConfig.verboseLogging;
                    configuration.logPluginHostCommunication = currentWindowConfig.logPluginHostCommunication;
                    configuration.debugBrkPluginHost = currentWindowConfig.debugBrkPluginHost;
                    configuration.debugPluginHostPort = currentWindowConfig.debugPluginHostPort;
                    configuration.pluginHomePath = currentWindowConfig.pluginHomePath;
                }
            }
            // Only load when the window has not vetoed this
            lifecycle.manager.unload(vscodeWindow).done(function (veto) {
                if (!veto) {
                    // Load it
                    vscodeWindow.load(configuration);
                }
            });
        };
        WindowsManager.prototype.getNewWindowState = function (configuration) {
            var _this = this;
            // plugin development host Window - load from stored settings if any
            if (!!configuration.pluginDevelopmentPath && this.windowsState.lastPluginDevelopmentHostWindow) {
                return this.windowsState.lastPluginDevelopmentHostWindow.uiState;
            }
            // Known Folder - load from stored settings if any
            if (configuration.workspacePath) {
                var stateForWorkspace = this.windowsState.openedFolders.filter(function (o) { return _this.isPathEqual(o.workspacePath, configuration.workspacePath); }).map(function (o) { return o.uiState; });
                if (stateForWorkspace.length) {
                    return stateForWorkspace[0];
                }
            }
            // First Window
            var lastActive = this.getLastActiveWindow();
            if (!lastActive && this.windowsState.lastActiveWindow) {
                return this.windowsState.lastActiveWindow.uiState;
            }
            //
            // In any other case, we do not have any stored settings for the window state, so we come up with something smart
            //
            // We want the new window to open on the same display that the last active one is in
            var displayToUse;
            var displays = electron_1.screen.getAllDisplays();
            // Single Display
            if (displays.length === 1) {
                displayToUse = displays[0];
            }
            else {
                // on mac there is 1 menu per window so we need to use the monitor where the cursor currently is
                if (platform.isMacintosh) {
                    var cursorPoint = electron_1.screen.getCursorScreenPoint();
                    displayToUse = electron_1.screen.getDisplayNearestPoint(cursorPoint);
                }
                // if we have a last active window, use that display for the new window
                if (!displayToUse && lastActive) {
                    displayToUse = electron_1.screen.getDisplayMatching(lastActive.getBounds());
                }
                // fallback to first display
                if (!displayToUse) {
                    displayToUse = displays[0];
                }
            }
            var defaultState = window.defaultWindowState();
            defaultState.x = displayToUse.bounds.x + (displayToUse.bounds.width / 2) - (defaultState.width / 2);
            defaultState.y = displayToUse.bounds.y + (displayToUse.bounds.height / 2) - (defaultState.height / 2);
            return this.ensureNoOverlap(defaultState);
        };
        WindowsManager.prototype.ensureNoOverlap = function (state) {
            if (WindowsManager.WINDOWS.length === 0) {
                return state;
            }
            var existingWindowBounds = WindowsManager.WINDOWS.map(function (win) { return win.getBounds(); });
            while (existingWindowBounds.some(function (b) { return b.x === state.x || b.y === state.y; })) {
                state.x += 30;
                state.y += 30;
            }
            return state;
        };
        WindowsManager.prototype.openFilePicker = function () {
            var _this = this;
            this.getFileOrFolderPaths(false, function (paths) {
                if (paths && paths.length) {
                    _this.open({ cli: env.cliArgs, pathsToOpen: paths });
                }
            });
        };
        WindowsManager.prototype.openFolderPicker = function () {
            var _this = this;
            this.getFileOrFolderPaths(true, function (paths) {
                if (paths && paths.length) {
                    _this.open({ cli: env.cliArgs, pathsToOpen: paths });
                }
            });
        };
        WindowsManager.prototype.getFileOrFolderPaths = function (isFolder, clb) {
            var workingDir = storage.getItem(WindowsManager.workingDirPickerStorageKey);
            var focussedWindow = this.getFocusedWindow();
            var pickerProperties;
            if (platform.isMacintosh) {
                pickerProperties = ['multiSelections', 'openDirectory', 'openFile', 'createDirectory'];
            }
            else {
                pickerProperties = ['multiSelections', isFolder ? 'openDirectory' : 'openFile', 'createDirectory'];
            }
            electron_1.dialog.showOpenDialog(focussedWindow && focussedWindow.win, {
                defaultPath: workingDir,
                properties: pickerProperties
            }, function (paths) {
                if (paths && paths.length > 0) {
                    // Remember path in storage for next time
                    storage.setItem(WindowsManager.workingDirPickerStorageKey, path.dirname(paths[0]));
                    // Return
                    clb(paths);
                }
                else {
                    clb(void (0));
                }
            });
        };
        WindowsManager.prototype.focusLastActive = function (cli) {
            var lastActive = this.getLastActiveWindow();
            if (lastActive) {
                lastActive.focus();
            }
            else {
                this.windowsState.openedFolders = []; // make sure we do not open too much
                this.open({ cli: cli });
            }
        };
        WindowsManager.prototype.getLastActiveWindow = function () {
            if (WindowsManager.WINDOWS.length) {
                var lastFocussedDate = Math.max.apply(Math, WindowsManager.WINDOWS.map(function (w) { return w.lastFocusTime; }));
                var res = WindowsManager.WINDOWS.filter(function (w) { return w.lastFocusTime === lastFocussedDate; });
                if (res && res.length) {
                    return res[0];
                }
            }
            return null;
        };
        WindowsManager.prototype.findWindow = function (workspacePath, filePath) {
            var _this = this;
            if (WindowsManager.WINDOWS.length) {
                // Sort the last active window to the front of the array of windows to test
                var windowsToTest = WindowsManager.WINDOWS.slice(0);
                var lastActiveWindow = this.getLastActiveWindow();
                if (lastActiveWindow) {
                    windowsToTest.splice(windowsToTest.indexOf(lastActiveWindow), 1);
                    windowsToTest.unshift(lastActiveWindow);
                }
                // Find it
                var res = windowsToTest.filter(function (w) {
                    // match on workspace
                    if (typeof w.openedWorkspacePath === 'string' && (_this.isPathEqual(w.openedWorkspacePath, workspacePath))) {
                        return true;
                    }
                    // match on file
                    if (typeof w.openedFilePath === 'string' && _this.isPathEqual(w.openedFilePath, filePath)) {
                        return true;
                    }
                    // match on file path
                    if (typeof w.openedWorkspacePath === 'string' && filePath && paths.isEqualOrParent(filePath, w.openedWorkspacePath)) {
                        return true;
                    }
                    return false;
                });
                if (res && res.length) {
                    return res[0];
                }
            }
            return null;
        };
        WindowsManager.prototype.openNewWindow = function () {
            this.open({ cli: env.cliArgs, forceNewWindow: true, forceEmpty: true });
        };
        WindowsManager.prototype.sendToFocused = function (channel) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var focusedWindow = this.getFocusedWindow() || this.getLastActiveWindow();
            if (focusedWindow) {
                focusedWindow.sendWhenReady.apply(focusedWindow, [channel].concat(args));
            }
        };
        WindowsManager.prototype.sendToAll = function (channel, payload, windowIdsToIgnore) {
            WindowsManager.WINDOWS.forEach(function (w) {
                if (windowIdsToIgnore && windowIdsToIgnore.indexOf(w.id) >= 0) {
                    return; // do not send if we are instructed to ignore it
                }
                w.sendWhenReady(channel, payload);
            });
        };
        WindowsManager.prototype.getFocusedWindow = function () {
            var win = electron_1.BrowserWindow.getFocusedWindow();
            if (win) {
                return this.getWindowById(win.id);
            }
            return null;
        };
        WindowsManager.prototype.getWindowById = function (windowId) {
            var res = WindowsManager.WINDOWS.filter(function (w) { return w.id === windowId; });
            if (res && res.length === 1) {
                return res[0];
            }
            return null;
        };
        WindowsManager.prototype.getWindows = function () {
            return WindowsManager.WINDOWS;
        };
        WindowsManager.prototype.getWindowCount = function () {
            return WindowsManager.WINDOWS.length;
        };
        WindowsManager.prototype.onWindowError = function (win, error) {
            console.error(error === WindowError.CRASHED ? '[VS Code]: render process crashed!' : '[VS Code]: detected unresponsive');
            // Unresponsive
            if (error === WindowError.UNRESPONSIVE) {
                electron_1.dialog.showMessageBox(win, {
                    title: env.product.nameLong,
                    type: 'warning',
                    buttons: [nls.localize('exit', "Exit"), nls.localize('wait', "Keep Waiting")],
                    message: nls.localize('appStalled', "{0} is no longer responding", env.product.nameLong),
                    detail: nls.localize('appStalledDetail', "Would you like to exit {0} or just keep waiting?", env.product.nameLong),
                    noLink: true
                }, function (result) {
                    if (result === 0) {
                        win.destroy(); // make sure to destroy the window as otherwise quit will just not do anything
                        electron_1.app.quit();
                    }
                });
            }
            else {
                electron_1.dialog.showMessageBox(win, {
                    title: env.product.nameLong,
                    type: 'warning',
                    buttons: [nls.localize('exit', "Exit")],
                    message: nls.localize('appCrashed', "{0} has crashed", env.product.nameLong),
                    detail: nls.localize('appCrashedDetail', "We are sorry for the inconvenience! Please restart {0}.", env.product.nameLong),
                    noLink: true
                }, function (result) {
                    win.destroy(); // make sure to destroy the window as otherwise quit will just not do anything
                    electron_1.app.quit();
                });
            }
        };
        WindowsManager.prototype.onBeforeWindowClose = function (win) {
            var _this = this;
            if (win.readyState !== window.ReadyState.READY) {
                return; // only persist windows that are fully loaded
            }
            // On Window close, update our stored state of this window
            var state = { workspacePath: win.openedWorkspacePath, uiState: win.serializeWindowState() };
            if (win.isPluginDevelopmentHost) {
                this.windowsState.lastPluginDevelopmentHostWindow = state;
            }
            else {
                this.windowsState.lastActiveWindow = state;
                this.windowsState.openedFolders.forEach(function (o) {
                    if (_this.isPathEqual(o.workspacePath, win.openedWorkspacePath)) {
                        o.uiState = state.uiState;
                    }
                });
            }
        };
        WindowsManager.prototype.onWindowClosed = function (win) {
            // Tell window
            win.dispose();
            // Remove from our list so that Electron can clean it up
            var index = WindowsManager.WINDOWS.indexOf(win);
            WindowsManager.WINDOWS.splice(index, 1);
            // Emit
            eventEmitter.emit(EventTypes.CLOSE, WindowsManager.WINDOWS.length);
        };
        WindowsManager.prototype.isPathEqual = function (pathA, pathB) {
            if (pathA === pathB) {
                return true;
            }
            if (!pathA || !pathB) {
                return false;
            }
            pathA = path.normalize(pathA);
            pathB = path.normalize(pathB);
            if (pathA === pathB) {
                return true;
            }
            if (!platform.isLinux) {
                pathA = pathA.toLowerCase();
                pathB = pathB.toLowerCase();
            }
            return pathA === pathB;
        };
        WindowsManager.openedPathsListStorageKey = 'openedPathsList';
        WindowsManager.workingDirPickerStorageKey = 'pickerWorkingDir';
        WindowsManager.windowsStateStorageKey = 'windowsState';
        WindowsManager.WINDOWS = [];
        return WindowsManager;
    })();
    exports.WindowsManager = WindowsManager;
    exports.manager = new WindowsManager();
});
//# sourceMappingURL=windows.js.map