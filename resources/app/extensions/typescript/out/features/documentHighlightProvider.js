/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var vscode_1 = require('vscode');
var TypeScriptDocumentHighlightProvider = (function () {
    function TypeScriptDocumentHighlightProvider(client) {
        this.client = client;
    }
    TypeScriptDocumentHighlightProvider.prototype.provideDocumentHighlights = function (resource, position, token) {
        var _this = this;
        var args = {
            file: this.client.asAbsolutePath(resource.uri),
            line: position.line + 1,
            offset: position.character + 1
        };
        if (!args.file) {
            return Promise.resolve([]);
        }
        return this.client.execute('occurrences', args, token).then(function (response) {
            var data = response.body;
            if (data) {
                return data.map(function (item) {
                    return new vscode_1.DocumentHighlight(new vscode_1.Range(item.start.line - 1, item.start.offset - 1, item.end.line - 1, item.end.offset - 1), item.isWriteAccess ? vscode_1.DocumentHighlightKind.Write : vscode_1.DocumentHighlightKind.Read);
                });
            }
        }, function (err) {
            _this.client.error("'occurrences' request failed with error.", err);
            return [];
        });
    };
    return TypeScriptDocumentHighlightProvider;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TypeScriptDocumentHighlightProvider;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/e0006c407164ee12f30cc86dcc2562a8638862d7/extensions/typescript/out/features/documentHighlightProvider.js.map
