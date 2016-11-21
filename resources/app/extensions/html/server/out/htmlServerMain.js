/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var vscode_languageserver_1 = require('vscode-languageserver');
var vscode_html_languageservice_1 = require('vscode-html-languageservice');
var languageModelCache_1 = require('./languageModelCache');
var embeddedSupport_1 = require('./embeddedSupport');
var url = require('url');
var path = require('path');
var vscode_uri_1 = require('vscode-uri');
var nls = require('vscode-nls');
nls.config(process.env['VSCODE_NLS_CONFIG']);
var EmbeddedCompletionRequest;
(function (EmbeddedCompletionRequest) {
    EmbeddedCompletionRequest.type = { get method() { return 'embedded/completion'; } };
})(EmbeddedCompletionRequest || (EmbeddedCompletionRequest = {}));
var EmbeddedHoverRequest;
(function (EmbeddedHoverRequest) {
    EmbeddedHoverRequest.type = { get method() { return 'embedded/hover'; } };
})(EmbeddedHoverRequest || (EmbeddedHoverRequest = {}));
var EmbeddedContentRequest;
(function (EmbeddedContentRequest) {
    EmbeddedContentRequest.type = { get method() { return 'embedded/content'; } };
})(EmbeddedContentRequest || (EmbeddedContentRequest = {}));
var EmbeddedContentChangedNotification;
(function (EmbeddedContentChangedNotification) {
    EmbeddedContentChangedNotification.type = { get method() { return 'embedded/contentchanged'; } };
})(EmbeddedContentChangedNotification || (EmbeddedContentChangedNotification = {}));
// Create a connection for the server
var connection = vscode_languageserver_1.createConnection();
console.log = connection.console.log.bind(connection.console);
console.error = connection.console.error.bind(connection.console);
// Create a simple text document manager. The text document manager
// supports full document sync only
var documents = new vscode_languageserver_1.TextDocuments();
// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);
var htmlDocuments = languageModelCache_1.getLanguageModelCache(10, 60, function (document) { return vscode_html_languageservice_1.getLanguageService().parseHTMLDocument(document); });
documents.onDidClose(function (e) {
    htmlDocuments.onDocumentRemoved(e.document);
});
connection.onShutdown(function () {
    htmlDocuments.dispose();
});
var workspacePath;
var embeddedLanguages;
// After the server has started the client sends an initilize request. The server receives
// in the passed params the rootPath of the workspace plus the client capabilites
connection.onInitialize(function (params) {
    workspacePath = params.rootPath;
    embeddedLanguages = params.initializationOptions.embeddedLanguages;
    return {
        capabilities: {
            // Tell the client that the server works in FULL text document sync mode
            textDocumentSync: documents.syncKind,
            completionProvider: { resolveProvider: false, triggerCharacters: ['.', ':', '<', '"', '=', '/'] },
            hoverProvider: true,
            documentHighlightProvider: true,
            documentRangeFormattingProvider: params.initializationOptions['format.enable'],
            documentLinkProvider: true
        }
    };
});
// create the JSON language service
var languageService = vscode_html_languageservice_1.getLanguageService();
var languageSettings;
// The settings have changed. Is send on server activation as well.
connection.onDidChangeConfiguration(function (change) {
    var settings = change.settings;
    languageSettings = settings.html;
});
var pendingValidationRequests = {};
var validationDelayMs = 200;
// The content of a text document has changed. This event is emitted
// when the text document first opened or when its content has changed.
documents.onDidChangeContent(function (change) {
    triggerValidation(change.document);
});
// a document has closed: clear all diagnostics
documents.onDidClose(function (event) {
    cleanPendingValidation(event.document);
    //connection.sendDiagnostics({ uri: event.document.uri, diagnostics: [] });
    if (embeddedLanguages) {
        connection.sendNotification(EmbeddedContentChangedNotification.type, { uri: event.document.uri, version: event.document.version, embeddedLanguageIds: [] });
    }
});
function cleanPendingValidation(textDocument) {
    var request = pendingValidationRequests[textDocument.uri];
    if (request) {
        clearTimeout(request);
        delete pendingValidationRequests[textDocument.uri];
    }
}
function triggerValidation(textDocument) {
    cleanPendingValidation(textDocument);
    pendingValidationRequests[textDocument.uri] = setTimeout(function () {
        delete pendingValidationRequests[textDocument.uri];
        validateTextDocument(textDocument);
    }, validationDelayMs);
}
function validateTextDocument(textDocument) {
    var htmlDocument = htmlDocuments.get(textDocument);
    //let diagnostics = languageService.doValidation(textDocument, htmlDocument);
    // Send the computed diagnostics to VSCode.
    //connection.sendDiagnostics({ uri: textDocument.uri, diagnostics });
    if (embeddedLanguages) {
        var embeddedLanguageIds = embeddedSupport_1.hasEmbeddedContent(languageService, textDocument, htmlDocument, embeddedLanguages);
        var p = { uri: textDocument.uri, version: textDocument.version, embeddedLanguageIds: embeddedLanguageIds };
        connection.sendNotification(EmbeddedContentChangedNotification.type, p);
    }
}
connection.onCompletion(function (textDocumentPosition) {
    var document = documents.get(textDocumentPosition.textDocument.uri);
    var htmlDocument = htmlDocuments.get(document);
    var options = languageSettings && languageSettings.suggest;
    var list = languageService.doComplete(document, textDocumentPosition.position, htmlDocument, options);
    if (list.items.length === 0 && embeddedLanguages) {
        var embeddedLanguageId = embeddedSupport_1.getEmbeddedLanguageAtPosition(languageService, document, htmlDocument, textDocumentPosition.position);
        if (embeddedLanguageId && embeddedLanguages[embeddedLanguageId]) {
            return connection.sendRequest(EmbeddedCompletionRequest.type, { uri: document.uri, version: document.version, embeddedLanguageId: embeddedLanguageId, position: textDocumentPosition.position });
        }
    }
    return list;
});
connection.onHover(function (textDocumentPosition) {
    var document = documents.get(textDocumentPosition.textDocument.uri);
    var htmlDocument = htmlDocuments.get(document);
    var hover = languageService.doHover(document, textDocumentPosition.position, htmlDocument);
    if (!hover && embeddedLanguages) {
        var embeddedLanguageId = embeddedSupport_1.getEmbeddedLanguageAtPosition(languageService, document, htmlDocument, textDocumentPosition.position);
        if (embeddedLanguageId && embeddedLanguages[embeddedLanguageId]) {
            return connection.sendRequest(EmbeddedHoverRequest.type, { uri: document.uri, version: document.version, embeddedLanguageId: embeddedLanguageId, position: textDocumentPosition.position });
        }
    }
    return hover;
});
connection.onRequest(EmbeddedContentRequest.type, function (parms) {
    var document = documents.get(parms.uri);
    if (document) {
        var htmlDocument = htmlDocuments.get(document);
        return { content: embeddedSupport_1.getEmbeddedContent(languageService, document, htmlDocument, parms.embeddedLanguageId), version: document.version };
    }
    return void 0;
});
connection.onDocumentHighlight(function (documentHighlightParams) {
    var document = documents.get(documentHighlightParams.textDocument.uri);
    var htmlDocument = htmlDocuments.get(document);
    return languageService.findDocumentHighlights(document, documentHighlightParams.position, htmlDocument);
});
function merge(src, dst) {
    for (var key in src) {
        if (src.hasOwnProperty(key)) {
            dst[key] = src[key];
        }
    }
    return dst;
}
function getFormattingOptions(formatParams) {
    var formatSettings = languageSettings && languageSettings.format;
    if (!formatSettings) {
        return formatParams;
    }
    return merge(formatParams, merge(formatSettings, {}));
}
connection.onDocumentRangeFormatting(function (formatParams) {
    var document = documents.get(formatParams.textDocument.uri);
    return languageService.format(document, formatParams.range, getFormattingOptions(formatParams.options));
});
connection.onDocumentLinks(function (documentLinkParam) {
    var document = documents.get(documentLinkParam.textDocument.uri);
    var documentContext = {
        resolveReference: function (ref) {
            if (ref[0] === '/') {
                return vscode_uri_1.default.file(path.join(workspacePath, ref)).toString();
            }
            return url.resolve(document.uri, ref);
        }
    };
    return languageService.findDocumentLinks(document, documentContext);
});
// Listen on the connection
connection.listen();
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/7a90c381174c91af50b0a65fc8c20d61bb4f1be5/extensions/html/server/out/htmlServerMain.js.map
