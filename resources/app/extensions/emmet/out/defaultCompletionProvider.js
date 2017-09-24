"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const vscode_emmet_helper_1 = require("vscode-emmet-helper");
const abbreviationActions_1 = require("./abbreviationActions");
const util_1 = require("./util");
class DefaultCompletionItemProvider {
    provideCompletionItems(document, position, token) {
        const mappedLanguages = util_1.getMappingForIncludedLanguages();
        const emmetConfig = vscode.workspace.getConfiguration('emmet');
        let isSyntaxMapped = mappedLanguages[document.languageId] ? true : false;
        let excludedLanguages = emmetConfig['excludeLanguages'] ? emmetConfig['excludeLanguages'] : [];
        let syntax = vscode_emmet_helper_1.getEmmetMode((isSyntaxMapped ? mappedLanguages[document.languageId] : document.languageId), excludedLanguages);
        if (document.languageId === 'html' || vscode_emmet_helper_1.isStyleSheet(document.languageId)) {
            // Document can be html/css parsed
            // Use syntaxHelper to parse file, validate location and update sytnax if needed
            syntax = this.syntaxHelper(syntax, document, position);
        }
        if (!syntax
            || ((isSyntaxMapped || syntax === 'jsx')
                && emmetConfig['showExpandedAbbreviation'] !== 'always')) {
            return;
        }
        let result = vscode_emmet_helper_1.doComplete(document, position, syntax, util_1.getEmmetConfiguration());
        let newItems = [];
        if (result.items) {
            result.items.forEach(item => {
                let newItem = new vscode.CompletionItem(item.label);
                newItem.documentation = item.documentation;
                newItem.detail = item.detail;
                newItem.insertText = new vscode.SnippetString(item.textEdit.newText);
                let oldrange = item.textEdit.range;
                newItem.range = new vscode.Range(oldrange.start.line, oldrange.start.character, oldrange.end.line, oldrange.end.character);
                newItem.filterText = item.filterText;
                newItem.sortText = item.sortText;
                newItems.push(newItem);
            });
        }
        return Promise.resolve(new vscode.CompletionList(newItems, true));
    }
    /**
     * Parses given document to check whether given position is valid for emmet abbreviation and returns appropriate syntax
     * @param syntax string language mode of current document
     * @param document vscode.Textdocument
     * @param position vscode.Position position of the abbreviation that needs to be expanded
     */
    syntaxHelper(syntax, document, position) {
        if (!syntax) {
            return syntax;
        }
        let rootNode = util_1.parseDocument(document, false);
        if (!rootNode) {
            return;
        }
        let currentNode = util_1.getNode(rootNode, position);
        if (!vscode_emmet_helper_1.isStyleSheet(syntax)) {
            const currentHtmlNode = currentNode;
            if (currentHtmlNode
                && currentHtmlNode.close
                && currentHtmlNode.name === 'style'
                && util_1.getInnerRange(currentHtmlNode).contains(position)) {
                return 'css';
            }
        }
        if (!abbreviationActions_1.isValidLocationForEmmetAbbreviation(currentNode, syntax, position)) {
            return;
        }
        return syntax;
    }
}
exports.DefaultCompletionItemProvider = DefaultCompletionItemProvider;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/0eb40ad2cd45f7b02b138b1a4090966905ed0fec/extensions/emmet/out/defaultCompletionProvider.js.map
