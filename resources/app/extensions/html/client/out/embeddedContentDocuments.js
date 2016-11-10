/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var vscode_1 = require('vscode');
var embeddedContentUri_1 = require('./embeddedContentUri');
var EmbeddedContentRequest;
(function (EmbeddedContentRequest) {
    EmbeddedContentRequest.type = { get method() { return 'embedded/content'; } };
})(EmbeddedContentRequest || (EmbeddedContentRequest = {}));
var EmbeddedContentChangedNotification;
(function (EmbeddedContentChangedNotification) {
    EmbeddedContentChangedNotification.type = { get method() { return 'embedded/contentchanged'; } };
})(EmbeddedContentChangedNotification || (EmbeddedContentChangedNotification = {}));
function initializeEmbeddedContentDocuments(parentDocumentSelector, embeddedLanguages, client) {
    var toDispose = [];
    var embeddedContentChanged = new vscode_1.EventEmitter();
    // remember all open virtual documents with the version of the content
    var openVirtualDocuments = {};
    // documents are closed after a time out or when collected.
    toDispose.push(vscode_1.workspace.onDidCloseTextDocument(function (d) {
        if (embeddedContentUri_1.isEmbeddedContentUri(d.uri)) {
            delete openVirtualDocuments[d.uri.toString()];
        }
    }));
    // virtual document provider
    toDispose.push(vscode_1.workspace.registerTextDocumentContentProvider(embeddedContentUri_1.EMBEDDED_CONTENT_SCHEME, {
        provideTextDocumentContent: function (uri) {
            if (embeddedContentUri_1.isEmbeddedContentUri(uri)) {
                var contentRequestParms = { uri: embeddedContentUri_1.getHostDocumentUri(uri), embeddedLanguageId: embeddedContentUri_1.getEmbeddedLanguageId(uri) };
                return client.sendRequest(EmbeddedContentRequest.type, contentRequestParms).then(function (content) {
                    if (content) {
                        openVirtualDocuments[uri.toString()] = content.version;
                        return content.content;
                    }
                    else {
                        delete openVirtualDocuments[uri.toString()];
                        return '';
                    }
                });
            }
            return '';
        },
        onDidChange: embeddedContentChanged.event
    }));
    // diagnostics for embedded contents
    client.onNotification(EmbeddedContentChangedNotification.type, function (p) {
        for (var languageId in embeddedLanguages) {
            if (p.embeddedLanguageIds.indexOf(languageId) !== -1) {
                // open the document so that validation is triggered in the embedded mode
                var virtualUri = embeddedContentUri_1.getEmbeddedContentUri(p.uri, languageId);
                openEmbeddedContentDocument(virtualUri, p.version);
            }
        }
    });
    function ensureContentUpdated(virtualURI, expectedVersion) {
        var virtualURIString = virtualURI.toString();
        var virtualDocVersion = openVirtualDocuments[virtualURIString];
        if (isDefined(virtualDocVersion) && virtualDocVersion !== expectedVersion) {
            return new Promise(function (resolve, reject) {
                var subscription = vscode_1.workspace.onDidChangeTextDocument(function (d) {
                    if (d.document.uri.toString() === virtualURIString) {
                        subscription.dispose();
                        resolve();
                    }
                });
                embeddedContentChanged.fire(virtualURI);
            });
        }
        return Promise.resolve();
    }
    ;
    function openEmbeddedContentDocument(virtualURI, expectedVersion) {
        return ensureContentUpdated(virtualURI, expectedVersion).then(function (_) {
            return vscode_1.workspace.openTextDocument(virtualURI).then(function (document) {
                if (expectedVersion === openVirtualDocuments[virtualURI.toString()]) {
                    return document;
                }
                return void 0;
            });
        });
    }
    ;
    return {
        getEmbeddedContentUri: embeddedContentUri_1.getEmbeddedContentUri,
        openEmbeddedContentDocument: openEmbeddedContentDocument,
        dispose: vscode_1.Disposable.from.apply(vscode_1.Disposable, toDispose).dispose
    };
}
exports.initializeEmbeddedContentDocuments = initializeEmbeddedContentDocuments;
function isDefined(o) {
    return typeof o !== 'undefined';
}
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/e0006c407164ee12f30cc86dcc2562a8638862d7/extensions/html/client/out/embeddedContentDocuments.js.map
