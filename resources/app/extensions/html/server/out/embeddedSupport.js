/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var vscode_html_languageservice_1 = require('vscode-html-languageservice');
function getEmbeddedLanguageAtPosition(languageService, document, htmlDocument, position) {
    var offset = document.offsetAt(position);
    var node = htmlDocument.findNodeAt(offset);
    if (node && node.children.length === 0) {
        var embeddedContent = getEmbeddedContentForNode(languageService, document, node);
        if (embeddedContent && embeddedContent.start <= offset && offset <= embeddedContent.end) {
            return embeddedContent.languageId;
        }
    }
    return null;
}
exports.getEmbeddedLanguageAtPosition = getEmbeddedLanguageAtPosition;
function hasEmbeddedContent(languageService, document, htmlDocument, embeddedLanguages) {
    var embeddedLanguageIds = {};
    function collectEmbeddedLanguages(node) {
        var c = getEmbeddedContentForNode(languageService, document, node);
        if (c && embeddedLanguages[c.languageId] && !isWhitespace(document.getText().substring(c.start, c.end))) {
            embeddedLanguageIds[c.languageId] = true;
        }
        node.children.forEach(collectEmbeddedLanguages);
    }
    htmlDocument.roots.forEach(collectEmbeddedLanguages);
    return Object.keys(embeddedLanguageIds);
}
exports.hasEmbeddedContent = hasEmbeddedContent;
function getEmbeddedContent(languageService, document, htmlDocument, languageId) {
    var contents = [];
    function collectEmbeddedNodes(node) {
        var c = getEmbeddedContentForNode(languageService, document, node);
        if (c && c.languageId === languageId) {
            contents.push(c);
        }
        node.children.forEach(collectEmbeddedNodes);
    }
    htmlDocument.roots.forEach(collectEmbeddedNodes);
    var currentPos = 0;
    var oldContent = document.getText();
    var result = '';
    for (var _i = 0, contents_1 = contents; _i < contents_1.length; _i++) {
        var c = contents_1[_i];
        result = substituteWithWhitespace(result, currentPos, c.start, oldContent);
        result += oldContent.substring(c.start, c.end);
        currentPos = c.end;
    }
    result = substituteWithWhitespace(result, currentPos, oldContent.length, oldContent);
    return result;
}
exports.getEmbeddedContent = getEmbeddedContent;
function substituteWithWhitespace(result, start, end, oldContent) {
    var accumulatedWS = 0;
    for (var i = start; i < end; i++) {
        var ch = oldContent[i];
        if (ch === '\n' || ch === '\r') {
            // only write new lines, skip the whitespace
            accumulatedWS = 0;
            result += ch;
        }
        else {
            accumulatedWS++;
        }
    }
    result = append(result, ' ', accumulatedWS);
    return result;
}
function append(result, str, n) {
    while (n) {
        if (n & 1) {
            result += str;
        }
        n >>= 1;
        str += str;
    }
    return result;
}
function getEmbeddedContentForNode(languageService, document, node) {
    if (node.tag === 'style') {
        var scanner = languageService.createScanner(document.getText().substring(node.start, node.end));
        var token = scanner.scan();
        while (token !== vscode_html_languageservice_1.TokenType.EOS) {
            if (token === vscode_html_languageservice_1.TokenType.Styles) {
                return { languageId: 'css', start: node.start + scanner.getTokenOffset(), end: node.start + scanner.getTokenEnd() };
            }
            token = scanner.scan();
        }
    }
    else if (node.tag === 'script') {
        var scanner = languageService.createScanner(document.getText().substring(node.start, node.end));
        var token = scanner.scan();
        var isTypeAttribute = false;
        var languageId = 'javascript';
        while (token !== vscode_html_languageservice_1.TokenType.EOS) {
            if (token === vscode_html_languageservice_1.TokenType.AttributeName) {
                isTypeAttribute = scanner.getTokenText() === 'type';
            }
            else if (token === vscode_html_languageservice_1.TokenType.AttributeValue) {
                if (isTypeAttribute) {
                    if (/["'](text|application)\/(java|ecma)script["']/.test(scanner.getTokenText())) {
                        languageId = 'javascript';
                    }
                    else {
                        languageId = void 0;
                    }
                }
                isTypeAttribute = false;
            }
            else if (token === vscode_html_languageservice_1.TokenType.Script) {
                return { languageId: languageId, start: node.start + scanner.getTokenOffset(), end: node.start + scanner.getTokenEnd() };
            }
            token = scanner.scan();
        }
    }
    return void 0;
}
function isWhitespace(str) {
    return str.match(/^\s*$/);
}
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/e0006c407164ee12f30cc86dcc2562a8638862d7/extensions/html/server/out/embeddedSupport.js.map
