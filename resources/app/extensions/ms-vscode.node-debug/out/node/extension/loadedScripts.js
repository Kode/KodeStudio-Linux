/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const nls = require("vscode-nls");
const vscode = require("vscode");
const path_1 = require("path");
const localize = nls.loadMessageBundle(__filename);
//---- loaded script explorer
class Source {
    constructor(path) {
        this.name = path_1.basename(path);
        this.path = path;
    }
}
class LoadedScriptItem {
    constructor(source) {
        this.label = path_1.basename(source.path);
        this.description = source.path;
        this.source = source;
    }
}
//---- loaded script picker
function pickLoadedScript() {
    const session = vscode.debug.activeDebugSession;
    return listLoadedScripts(session).then(sources => {
        let options = {
            placeHolder: localize(0, null),
            matchOnDescription: true,
            matchOnDetail: true,
            ignoreFocusOut: true
        };
        let items;
        if (sources === undefined) {
            items = [{ label: localize(1, null), description: '' }];
        }
        else {
            items = sources.map(source => new LoadedScriptItem(source)).sort((a, b) => a.label.localeCompare(b.label));
        }
        vscode.window.showQuickPick(items, options).then(item => {
            if (item && item.source) {
                openScript(session, item.source);
            }
        });
    });
}
exports.pickLoadedScript = pickLoadedScript;
function listLoadedScripts(session) {
    if (session) {
        return session.customRequest('loadedSources').then(reply => {
            return reply.sources;
        }, err => {
            return undefined;
        });
    }
    else {
        return Promise.resolve(undefined);
    }
}
function openScript(session, source) {
    let debug = `debug:${encodeURIComponent(source.path)}`;
    let sep = '?';
    if (session) {
        debug += `${sep}session=${encodeURIComponent(session.id)}`;
        sep = '&';
    }
    if (source.sourceReference) {
        debug += `${sep}ref=${source.sourceReference}`;
    }
    let uri = vscode.Uri.parse(debug);
    vscode.workspace.openTextDocument(uri).then(doc => vscode.window.showTextDocument(doc));
}
exports.openScript = openScript;

//# sourceMappingURL=../../../out/node/extension/loadedScripts.js.map
