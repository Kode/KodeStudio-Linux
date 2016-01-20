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
define(["require", "exports", 'vs/base/common/platform', 'vs/base/common/paths', 'vs/base/common/uri', 'vs/workbench/common/constants', 'vs/workbench/common/events', 'vs/workbench/common/editor', 'vs/workbench/services/viewlet/common/viewletService', 'vs/workbench/services/editor/common/editorService', 'vs/base/browser/dom', 'vs/platform/storage/common/storage', 'vs/platform/event/common/event', 'vs/platform/workspace/common/workspace', 'electron'], function (require, exports, platform, paths, uri_1, constants_1, events_1, workbenchEditorCommon, viewletService_1, editorService_1, dom, storage_1, event_1, workspace_1, electron_1) {
    var ElectronWindow = (function () {
        function ElectronWindow(win, shellContainer, contextService, eventService, storageService, editorService, viewletService) {
            this.contextService = contextService;
            this.eventService = eventService;
            this.storageService = storageService;
            this.editorService = editorService;
            this.viewletService = viewletService;
            this.win = win;
            this.registerListeners();
        }
        ElectronWindow.prototype.registerListeners = function () {
            var _this = this;
            // React to editor input changes (Mac only)
            if (platform.platform === platform.Platform.Mac) {
                this.eventService.addListener(events_1.EventType.EDITOR_INPUT_CHANGED, function (e) {
                    // if we dont use setTimeout() here for some reason there is an issue when switching between 2 files side by side
                    // with the mac trackpad where the editor would think the user wants to select. to reproduce, have 2 files, click
                    // into the non-focussed one and move the mouse down and see the editor starts to select lines.
                    setTimeout(function () {
                        var fileInput = workbenchEditorCommon.asFileEditorInput(e.editorInput, true);
                        if (fileInput) {
                            _this.win.setRepresentedFilename(fileInput.getResource().fsPath);
                        }
                        else {
                            _this.win.setRepresentedFilename('');
                        }
                    }, 0);
                });
            }
            // Prevent a dropped file from opening as nw application
            window.document.body.addEventListener('dragover', function (e) {
                e.preventDefault();
            });
            // Let a dropped file open inside Monaco (only if dropped over editor area)
            window.document.body.addEventListener('drop', function (e) {
                e.preventDefault();
                var editorArea = window.document.getElementById(constants_1.Identifiers.EDITOR_PART);
                if (dom.isAncestor(e.toElement, editorArea)) {
                    var pathsOpened = false;
                    // Check for native file transfer
                    if (e.dataTransfer && e.dataTransfer.files) {
                        var thepaths = [];
                        for (var i = 0; i < e.dataTransfer.files.length; i++) {
                            if (e.dataTransfer.files[i] && e.dataTransfer.files[i].path) {
                                thepaths.push(e.dataTransfer.files[i].path);
                            }
                        }
                        if (thepaths.length) {
                            pathsOpened = true;
                            _this.focus(); // make sure this window has focus so that the open call reaches the right window!
                            _this.open(thepaths);
                        }
                    }
                    // Otherwise check for special webkit transfer
                    if (!pathsOpened && e.dataTransfer && e.dataTransfer.items) {
                        var items = e.dataTransfer.items;
                        if (items.length && typeof items[0].getAsString === 'function') {
                            items[0].getAsString(function (str) {
                                try {
                                    var resource = uri_1.default.parse(str);
                                    if (resource.scheme === 'file') {
                                        // Do not allow to drop a child of the currently active workspace. This prevents an issue
                                        // where one would drop a folder from the explorer by accident into the editor area and
                                        // loose all the context.
                                        var workspace = _this.contextService.getWorkspace();
                                        if (workspace && paths.isEqualOrParent(resource.fsPath, workspace.resource.fsPath)) {
                                            return;
                                        }
                                        _this.focus(); // make sure this window has focus so that the open call reaches the right window!
                                        _this.open([decodeURIComponent(resource.fsPath)]);
                                    }
                                }
                                catch (error) {
                                }
                            });
                        }
                    }
                }
            });
            // Handle window.open() calls
            window.open = function (url, target, features, replace) {
                electron_1.shell.openExternal(url);
                return null;
            };
        };
        ElectronWindow.prototype.open = function (arg1) {
            var pathsToOpen;
            if (Array.isArray(arg1)) {
                pathsToOpen = arg1;
            }
            else if (typeof arg1 === 'string') {
                pathsToOpen = [arg1];
            }
            else {
                pathsToOpen = [arg1.fsPath];
            }
            electron_1.ipcRenderer.send('vscode:windowOpen', pathsToOpen); // handled from browser process
        };
        ElectronWindow.prototype.openNew = function () {
            electron_1.ipcRenderer.send('vscode:openNewWindow'); // handled from browser process
        };
        ElectronWindow.prototype.close = function () {
            this.win.close();
        };
        ElectronWindow.prototype.showMessageBox = function (options) {
            return electron_1.remote.dialog.showMessageBox(this.win, options);
        };
        ElectronWindow.prototype.setFullScreen = function (fullscreen) {
            this.win.setFullScreen(fullscreen);
        };
        ElectronWindow.prototype.openDevTools = function () {
            this.win.webContents.openDevTools();
        };
        ElectronWindow.prototype.isFullScreen = function () {
            return this.win.isFullScreen();
        };
        ElectronWindow.prototype.setMenuBarVisibility = function (visible) {
            this.win.setMenuBarVisibility(visible);
        };
        ElectronWindow.prototype.focus = function () {
            if (!this.win.isFocused()) {
                if (platform.isWindows || platform.isLinux) {
                    this.win.show(); // Windows & Linux sometimes cannot bring the window to the front when it is in the background
                }
                else {
                    this.win.focus();
                }
            }
        };
        ElectronWindow.prototype.flashFrame = function () {
            this.win.flashFrame(!this.win.isFocused());
        };
        ElectronWindow = __decorate([
            __param(2, workspace_1.IWorkspaceContextService),
            __param(3, event_1.IEventService),
            __param(4, storage_1.IStorageService),
            __param(5, editorService_1.IWorkbenchEditorService),
            __param(6, viewletService_1.IViewletService)
        ], ElectronWindow);
        return ElectronWindow;
    })();
    exports.ElectronWindow = ElectronWindow;
});
//# sourceMappingURL=window.js.map