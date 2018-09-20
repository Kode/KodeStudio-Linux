/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var vscode = require("vscode");
var nls = require("vscode-nls");
var localize = nls.loadMessageBundle(__filename);
var ON_TEXT = localize(0, null);
var OFF_TEXT = localize(1, null);
var TOGGLE_COMMAND = 'extension.node-debug.toggleAutoAttach';
var DEBUG_SETTINGS = 'debug.node';
var AUTO_ATTACH_SETTING = 'autoAttach';
var currentState = 'disabled'; // on activation this feature is always disabled and
var statusItem; // there is no status bar item
var autoAttachStarted = false;
function activate(context) {
    context.subscriptions.push(vscode.commands.registerCommand(TOGGLE_COMMAND, toggleAutoAttachSetting));
    context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(function (e) {
        if (e.affectsConfiguration(DEBUG_SETTINGS + '.' + AUTO_ATTACH_SETTING)) {
            updateAutoAttach(context);
        }
    }));
    updateAutoAttach(context);
}
exports.activate = activate;
function deactivate() {
}
exports.deactivate = deactivate;
function toggleAutoAttachSetting(context) {
    var conf = vscode.workspace.getConfiguration(DEBUG_SETTINGS);
    if (conf) {
        var value = conf.get(AUTO_ATTACH_SETTING);
        if (value === 'on') {
            value = 'off';
        }
        else {
            value = 'on';
        }
        var info = conf.inspect(AUTO_ATTACH_SETTING);
        var target = vscode.ConfigurationTarget.Global;
        if (info) {
            if (info.workspaceFolderValue) {
                target = vscode.ConfigurationTarget.WorkspaceFolder;
            }
            else if (info.workspaceValue) {
                target = vscode.ConfigurationTarget.Workspace;
            }
            else if (info.globalValue) {
                target = vscode.ConfigurationTarget.Global;
            }
            else if (info.defaultValue) {
                // setting not yet used: store setting in workspace
                if (vscode.workspace.workspaceFolders) {
                    target = vscode.ConfigurationTarget.Workspace;
                }
            }
        }
        conf.update(AUTO_ATTACH_SETTING, value, target);
    }
}
/**
 * Updates the auto attach feature based on the user or workspace setting
 */
function updateAutoAttach(context) {
    var newState = vscode.workspace.getConfiguration(DEBUG_SETTINGS).get(AUTO_ATTACH_SETTING);
    if (newState !== currentState) {
        if (newState === 'disabled') {
            // turn everything off
            if (statusItem) {
                statusItem.hide();
                statusItem.text = OFF_TEXT;
            }
            if (autoAttachStarted) {
                vscode.commands.executeCommand('extension.node-debug.stopAutoAttach').then(function (_) {
                    currentState = newState;
                    autoAttachStarted = false;
                });
            }
        }
        else { // 'on' or 'off'
            // make sure status bar item exists and is visible
            if (!statusItem) {
                statusItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
                statusItem.command = TOGGLE_COMMAND;
                statusItem.tooltip = localize(2, null);
                statusItem.show();
                context.subscriptions.push(statusItem);
            }
            else {
                statusItem.show();
            }
            if (newState === 'off') {
                if (autoAttachStarted) {
                    vscode.commands.executeCommand('extension.node-debug.stopAutoAttach').then(function (_) {
                        currentState = newState;
                        if (statusItem) {
                            statusItem.text = OFF_TEXT;
                        }
                        autoAttachStarted = false;
                    });
                }
            }
            else if (newState === 'on') {
                var vscode_pid = process.env['VSCODE_PID'];
                var rootPid = vscode_pid ? parseInt(vscode_pid) : 0;
                vscode.commands.executeCommand('extension.node-debug.startAutoAttach', rootPid).then(function (_) {
                    if (statusItem) {
                        statusItem.text = ON_TEXT;
                    }
                    currentState = newState;
                    autoAttachStarted = true;
                });
            }
        }
    }
}
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/b4f62a65292c32b44a9c2ab7739390fd05d4df2a/extensions/debug-auto-launch/out/extension.js.map
