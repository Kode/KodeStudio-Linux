/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const httpRequest = require("request-light");
const vscode = require("vscode");
const jsonContributions_1 = require("./features/jsonContributions");
const npmView_1 = require("./npmView");
const tasks_1 = require("./tasks");
const scriptHover_1 = require("./scriptHover");
const commands_1 = require("./commands");
function activate(context) {
    return __awaiter(this, void 0, void 0, function* () {
        const taskProvider = registerTaskProvider(context);
        const treeDataProvider = registerExplorer(context);
        const hoverProvider = registerHoverProvider(context);
        configureHttpRequest();
        let d = vscode.workspace.onDidChangeConfiguration((e) => {
            configureHttpRequest();
            if (e.affectsConfiguration('npm.exclude')) {
                tasks_1.invalidateTasksCache();
                if (treeDataProvider) {
                    treeDataProvider.refresh();
                }
            }
            if (e.affectsConfiguration('npm.scriptExplorerAction')) {
                if (treeDataProvider) {
                    treeDataProvider.refresh();
                }
            }
        });
        context.subscriptions.push(d);
        d = vscode.workspace.onDidChangeTextDocument((e) => {
            scriptHover_1.invalidateHoverScriptsCache(e.document);
        });
        context.subscriptions.push(d);
        context.subscriptions.push(vscode.commands.registerCommand('npm.runSelectedScript', commands_1.runSelectedScript));
        context.subscriptions.push(jsonContributions_1.addJSONProviders(httpRequest.xhr));
    });
}
exports.activate = activate;
function registerTaskProvider(context) {
    function invalidateScriptCaches() {
        scriptHover_1.invalidateHoverScriptsCache();
        tasks_1.invalidateTasksCache();
    }
    if (vscode.workspace.workspaceFolders) {
        let watcher = vscode.workspace.createFileSystemWatcher('**/package.json');
        watcher.onDidChange((_e) => invalidateScriptCaches());
        watcher.onDidDelete((_e) => invalidateScriptCaches());
        watcher.onDidCreate((_e) => invalidateScriptCaches());
        context.subscriptions.push(watcher);
        let provider = new tasks_1.NpmTaskProvider(context);
        let disposable = vscode.workspace.registerTaskProvider('npm', provider);
        context.subscriptions.push(disposable);
        return disposable;
    }
    return undefined;
}
function registerExplorer(context) {
    if (vscode.workspace.workspaceFolders) {
        let treeDataProvider = new npmView_1.NpmScriptsTreeDataProvider(context);
        let disposable = vscode.window.registerTreeDataProvider('npm', treeDataProvider);
        context.subscriptions.push(disposable);
        return treeDataProvider;
    }
    return undefined;
}
function registerHoverProvider(context) {
    if (vscode.workspace.workspaceFolders) {
        let npmSelector = {
            language: 'json',
            scheme: 'file',
            pattern: '**/package.json'
        };
        let provider = new scriptHover_1.NpmScriptHoverProvider(context);
        context.subscriptions.push(vscode.languages.registerHoverProvider(npmSelector, provider));
        return provider;
    }
    return undefined;
}
function configureHttpRequest() {
    const httpSettings = vscode.workspace.getConfiguration('http');
    httpRequest.configure(httpSettings.get('proxy', ''), httpSettings.get('proxyStrictSSL', true));
}
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/b4f62a65292c32b44a9c2ab7739390fd05d4df2a/extensions/npm/out/main.js.map
