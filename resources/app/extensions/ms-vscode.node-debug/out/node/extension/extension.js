/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const configurationProvider_1 = require("./configurationProvider");
const loadedScripts_1 = require("./loadedScripts");
const processPicker_1 = require("./processPicker");
const cluster_1 = require("./cluster");
const autoAttach_1 = require("./autoAttach");
function activate(context) {
    // register a configuration provider
    context.subscriptions.push(vscode.debug.registerDebugConfigurationProvider('node', new configurationProvider_1.NodeConfigurationProvider(context)));
    // auto attach
    autoAttach_1.initializeAutoAttach(context);
    // toggle skipping file action
    context.subscriptions.push(vscode.commands.registerCommand('extension.node-debug.toggleSkippingFile', toggleSkippingFile));
    // process picker command
    context.subscriptions.push(vscode.commands.registerCommand('extension.pickNodeProcess', processPicker_1.pickProcess));
    // attach process command
    context.subscriptions.push(vscode.commands.registerCommand('extension.node-debug.attachNodeProcess', processPicker_1.attachProcess));
    // loaded scripts
    context.subscriptions.push(vscode.commands.registerCommand('extension.node-debug.pickLoadedScript', loadedScripts_1.pickLoadedScript));
    context.subscriptions.push(vscode.commands.registerCommand('extension.node-debug.openScript', (session, source) => loadedScripts_1.openScript(session, source)));
    // cluster
    context.subscriptions.push(vscode.debug.onDidStartDebugSession(session => cluster_1.Cluster.startSession(session)));
    context.subscriptions.push(vscode.debug.onDidTerminateDebugSession(session => cluster_1.Cluster.stopSession(session)));
}
exports.activate = activate;
function deactivate() {
}
exports.deactivate = deactivate;
//---- toggle skipped files
function toggleSkippingFile(res) {
    let resource = res;
    if (!resource) {
        const activeEditor = vscode.window.activeTextEditor;
        resource = activeEditor && activeEditor.document.fileName;
    }
    if (resource && vscode.debug.activeDebugSession) {
        const args = typeof resource === 'string' ? { resource } : { sourceReference: resource };
        vscode.debug.activeDebugSession.customRequest('toggleSkipFileStatus', args);
    }
}

//# sourceMappingURL=../../../out/node/extension/extension.js.map
