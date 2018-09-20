/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const tasks_1 = require("./tasks");
const nls = require("vscode-nls");
const localize = nls.loadMessageBundle(__filename);
let cachedDocument = undefined;
let cachedScriptsMap = undefined;
function invalidateHoverScriptsCache(document) {
    if (!document) {
        cachedDocument = undefined;
        return;
    }
    if (document.uri === cachedDocument) {
        cachedDocument = undefined;
    }
}
exports.invalidateHoverScriptsCache = invalidateHoverScriptsCache;
class NpmScriptHoverProvider {
    constructor(context) {
        this.extensionContext = context;
        context.subscriptions.push(vscode_1.commands.registerCommand('npm.runScriptFromHover', this.runScriptFromHover, this));
        context.subscriptions.push(vscode_1.commands.registerCommand('npm.debugScriptFromHover', this.debugScriptFromHover, this));
    }
    provideHover(document, position, _token) {
        let hover = undefined;
        if (!cachedDocument || cachedDocument.fsPath !== document.uri.fsPath) {
            cachedScriptsMap = tasks_1.findAllScriptRanges(document.getText());
            cachedDocument = document.uri;
        }
        cachedScriptsMap.forEach((value, key) => {
            let start = document.positionAt(value[0]);
            let end = document.positionAt(value[0] + value[1]);
            let range = new vscode_1.Range(start, end);
            if (range.contains(position)) {
                let contents = new vscode_1.MarkdownString();
                contents.isTrusted = true;
                contents.appendMarkdown(this.createRunScriptMarkdown(key, document.uri));
                let debugArgs = tasks_1.extractDebugArgFromScript(value[2]);
                if (debugArgs) {
                    contents.appendMarkdown(this.createDebugScriptMarkdown(key, document.uri, debugArgs[0], debugArgs[1]));
                }
                hover = new vscode_1.Hover(contents);
            }
        });
        return hover;
    }
    createRunScriptMarkdown(script, documentUri) {
        let args = {
            documentUri: documentUri,
            script: script,
        };
        return this.createMarkdownLink(localize(0, null), 'npm.runScriptFromHover', args, localize(1, null));
    }
    createDebugScriptMarkdown(script, documentUri, protocol, port) {
        let args = {
            documentUri: documentUri,
            script: script,
            protocol: protocol,
            port: port
        };
        return this.createMarkdownLink(localize(2, null), 'npm.debugScriptFromHover', args, localize(3, null), '|');
    }
    createMarkdownLink(label, cmd, args, tooltip, separator) {
        let encodedArgs = encodeURIComponent(JSON.stringify(args));
        let prefix = '';
        if (separator) {
            prefix = ` ${separator} `;
        }
        return `${prefix}[${label}](command:${cmd}?${encodedArgs} "${tooltip}")`;
    }
    runScriptFromHover(args) {
        let script = args.script;
        let documentUri = args.documentUri;
        let folder = vscode_1.workspace.getWorkspaceFolder(documentUri);
        if (folder) {
            let task = tasks_1.createTask(script, `run ${script}`, folder, documentUri);
            vscode_1.tasks.executeTask(task);
        }
    }
    debugScriptFromHover(args) {
        let script = args.script;
        let documentUri = args.documentUri;
        let protocol = args.protocol;
        let port = args.port;
        let folder = vscode_1.workspace.getWorkspaceFolder(documentUri);
        if (folder) {
            tasks_1.startDebugging(script, protocol, port, folder);
        }
    }
}
exports.NpmScriptHoverProvider = NpmScriptHoverProvider;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/b4f62a65292c32b44a9c2ab7739390fd05d4df2a/extensions/npm/out/scriptHover.js.map
