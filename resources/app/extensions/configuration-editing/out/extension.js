/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var vscode = require('vscode');
var jsonc_parser_1 = require('jsonc-parser');
function activate(context) {
    var commands = vscode.commands.getCommands(true);
    //keybindings.json command-suggestions
    var disposable = vscode.languages.registerCompletionItemProvider({ pattern: '**/keybindings.json' }, {
        provideCompletionItems: function (document, position, token) {
            var location = jsonc_parser_1.getLocation(document.getText(), document.offsetAt(position));
            if (location.path[1] === 'command') {
                return commands.then(function (ids) { return ids.map(function (id) { return new vscode.CompletionItem(id, vscode.CompletionItemKind.Value); }); });
            }
        }
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map