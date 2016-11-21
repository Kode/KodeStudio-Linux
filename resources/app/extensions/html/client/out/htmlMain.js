/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var path = require('path');
var vscode_1 = require('vscode');
var vscode_languageclient_1 = require('vscode-languageclient');
var htmlEmptyTagsShared_1 = require('./htmlEmptyTagsShared');
var embeddedContentDocuments_1 = require('./embeddedContentDocuments');
var nls = require('vscode-nls');
var localize = nls.loadMessageBundle(__filename);
var EmbeddedCompletionRequest;
(function (EmbeddedCompletionRequest) {
    EmbeddedCompletionRequest.type = { get method() { return 'embedded/completion'; } };
})(EmbeddedCompletionRequest || (EmbeddedCompletionRequest = {}));
var EmbeddedHoverRequest;
(function (EmbeddedHoverRequest) {
    EmbeddedHoverRequest.type = { get method() { return 'embedded/hover'; } };
})(EmbeddedHoverRequest || (EmbeddedHoverRequest = {}));
function activate(context) {
    // The server is implemented in node
    var serverModule = context.asAbsolutePath(path.join('server', 'out', 'htmlServerMain.js'));
    // The debug options for the server
    var debugOptions = { execArgv: ['--nolazy', '--debug=6004'] };
    // If the extension is launch in debug mode the debug server options are use
    // Otherwise the run options are used
    var serverOptions = {
        run: { module: serverModule, transport: vscode_languageclient_1.TransportKind.ipc },
        debug: { module: serverModule, transport: vscode_languageclient_1.TransportKind.ipc, options: debugOptions }
    };
    var documentSelector = ['html', 'handlebars', 'razor'];
    var embeddedLanguages = { 'css': true };
    // Options to control the language client
    var clientOptions = {
        documentSelector: documentSelector,
        synchronize: {
            configurationSection: ['html'],
        },
        initializationOptions: (_a = {
                embeddedLanguages: embeddedLanguages
            },
            _a['format.enable'] = vscode_1.workspace.getConfiguration('html').get('format.enable'),
            _a
        )
    };
    // Create the language client and start the client.
    var client = new vscode_languageclient_1.LanguageClient('html', localize(0, null), serverOptions, clientOptions);
    var embeddedDocuments = embeddedContentDocuments_1.initializeEmbeddedContentDocuments(documentSelector, embeddedLanguages, client);
    context.subscriptions.push(embeddedDocuments);
    client.onRequest(EmbeddedCompletionRequest.type, function (params) {
        var position = vscode_languageclient_1.Protocol2Code.asPosition(params.position);
        var virtualDocumentURI = embeddedDocuments.getEmbeddedContentUri(params.uri, params.embeddedLanguageId);
        return embeddedDocuments.openEmbeddedContentDocument(virtualDocumentURI, params.version).then(function (document) {
            if (document) {
                return vscode_1.commands.executeCommand('vscode.executeCompletionItemProvider', virtualDocumentURI, position).then(function (completionList) {
                    if (completionList) {
                        return {
                            isIncomplete: completionList.isIncomplete,
                            items: completionList.items.map(vscode_languageclient_1.Code2Protocol.asCompletionItem)
                        };
                    }
                    return { isIncomplete: true, items: [] };
                });
            }
            return { isIncomplete: true, items: [] };
        });
    });
    client.onRequest(EmbeddedHoverRequest.type, function (params) {
        var position = vscode_languageclient_1.Protocol2Code.asPosition(params.position);
        var virtualDocumentURI = embeddedDocuments.getEmbeddedContentUri(params.uri, params.embeddedLanguageId);
        return embeddedDocuments.openEmbeddedContentDocument(virtualDocumentURI, params.version).then(function (document) {
            if (document) {
                return vscode_1.commands.executeCommand('vscode.executeHoverProvider', virtualDocumentURI, position).then(function (hover) {
                    if (hover && hover.length > 0) {
                        return {
                            contents: hover[0].contents,
                            range: vscode_languageclient_1.Code2Protocol.asRange(hover[0].range)
                        };
                    }
                    return void 0;
                });
            }
            return void 0;
        });
    });
    var disposable = client.start();
    // Push the disposable to the context's subscriptions so that the
    // client can be deactivated on extension deactivation
    context.subscriptions.push(disposable);
    vscode_1.languages.setLanguageConfiguration('html', {
        wordPattern: /(-?\d*\.\d\w*)|([^\`\~\!\@\$\^\&\*\(\)\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\s]+)/g,
        onEnterRules: [
            {
                beforeText: new RegExp("<(?!(?:" + htmlEmptyTagsShared_1.EMPTY_ELEMENTS.join('|') + "))([_:\\w][_:\\w-.\\d]*)([^/>]*(?!/)>)[^<]*$", 'i'),
                afterText: /^<\/([_:\w][_:\w-.\d]*)\s*>$/i,
                action: { indentAction: vscode_1.IndentAction.IndentOutdent }
            },
            {
                beforeText: new RegExp("<(?!(?:" + htmlEmptyTagsShared_1.EMPTY_ELEMENTS.join('|') + "))(\\w[\\w\\d]*)([^/>]*(?!/)>)[^<]*$", 'i'),
                action: { indentAction: vscode_1.IndentAction.Indent }
            }
        ],
    });
    vscode_1.languages.setLanguageConfiguration('handlebars', {
        wordPattern: /(-?\d*\.\d\w*)|([^\`\~\!\@\$\^\&\*\(\)\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\s]+)/g,
        onEnterRules: [
            {
                beforeText: new RegExp("<(?!(?:" + htmlEmptyTagsShared_1.EMPTY_ELEMENTS.join('|') + "))([_:\\w][_:\\w-.\\d]*)([^/>]*(?!/)>)[^<]*$", 'i'),
                afterText: /^<\/([_:\w][_:\w-.\d]*)\s*>$/i,
                action: { indentAction: vscode_1.IndentAction.IndentOutdent }
            },
            {
                beforeText: new RegExp("<(?!(?:" + htmlEmptyTagsShared_1.EMPTY_ELEMENTS.join('|') + "))(\\w[\\w\\d]*)([^/>]*(?!/)>)[^<]*$", 'i'),
                action: { indentAction: vscode_1.IndentAction.Indent }
            }
        ],
    });
    vscode_1.languages.setLanguageConfiguration('razor', {
        wordPattern: /(-?\d*\.\d\w*)|([^\`\~\!\@\$\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\s]+)/g,
        onEnterRules: [
            {
                beforeText: new RegExp("<(?!(?:" + htmlEmptyTagsShared_1.EMPTY_ELEMENTS.join('|') + "))([_:\\w][_:\\w-.\\d]*)([^/>]*(?!/)>)[^<]*$", 'i'),
                afterText: /^<\/([_:\w][_:\w-.\d]*)\s*>$/i,
                action: { indentAction: vscode_1.IndentAction.IndentOutdent }
            },
            {
                beforeText: new RegExp("<(?!(?:" + htmlEmptyTagsShared_1.EMPTY_ELEMENTS.join('|') + "))(\\w[\\w\\d]*)([^/>]*(?!/)>)[^<]*$", 'i'),
                action: { indentAction: vscode_1.IndentAction.Indent }
            }
        ],
    });
    var _a;
}
exports.activate = activate;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/7a90c381174c91af50b0a65fc8c20d61bb4f1be5/extensions/html/client/out/htmlMain.js.map
