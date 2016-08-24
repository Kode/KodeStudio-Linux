/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var vscode_1 = require('vscode');
var decorationType = {
    before: {
        contentText: ' ',
        border: 'solid 0.1em #000',
        margin: '0.1em 0.2em 0 0.2em',
        width: '0.8em',
        height: '0.8em'
    },
    dark: {
        before: {
            border: 'solid 0.1em #eee'
        }
    }
};
function activateColorDecorations(decoratorProvider, supportedLanguages) {
    var disposables = [];
    var colorsDecorationType = vscode_1.window.createTextEditorDecorationType(decorationType);
    disposables.push(colorsDecorationType);
    var pendingUpdateRequests = {};
    // we care about all visible editors
    vscode_1.window.visibleTextEditors.forEach(function (editor) {
        if (editor.document) {
            triggerUpdateDecorations(editor.document);
        }
    });
    // to get visible one has to become active
    vscode_1.window.onDidChangeActiveTextEditor(function (editor) {
        if (editor) {
            triggerUpdateDecorations(editor.document);
        }
    }, null, disposables);
    vscode_1.workspace.onDidChangeTextDocument(function (event) { return triggerUpdateDecorations(event.document); }, null, disposables);
    vscode_1.workspace.onDidOpenTextDocument(triggerUpdateDecorations, null, disposables);
    vscode_1.workspace.onDidCloseTextDocument(triggerUpdateDecorations, null, disposables);
    function triggerUpdateDecorations(document) {
        var triggerUpdate = supportedLanguages[document.languageId];
        var uri = document.uri.toString();
        var timeout = pendingUpdateRequests[uri];
        if (typeof timeout !== 'undefined') {
            clearTimeout(timeout);
            triggerUpdate = true; // force update, even if languageId is not supported (anymore)
        }
        if (triggerUpdate) {
            pendingUpdateRequests[uri] = setTimeout(function () {
                updateDecorations(uri);
                delete pendingUpdateRequests[uri];
            }, 500);
        }
    }
    function updateDecorations(uri) {
        vscode_1.window.visibleTextEditors.forEach(function (editor) {
            var document = editor.document;
            if (document && document.uri.toString() === uri) {
                updateDecorationForEditor(editor);
            }
        });
    }
    function updateDecorationForEditor(editor) {
        var document = editor.document;
        if (supportedLanguages[document.languageId]) {
            decoratorProvider(document.uri.toString()).then(function (ranges) {
                var decorations = ranges.map(function (range) {
                    var color = document.getText(range);
                    return {
                        range: range,
                        renderOptions: {
                            before: {
                                backgroundColor: color
                            }
                        }
                    };
                });
                editor.setDecorations(colorsDecorationType, decorations);
            });
        }
        else {
            editor.setDecorations(colorsDecorationType, []);
        }
    }
    return vscode_1.Disposable.from.apply(vscode_1.Disposable, disposables);
}
exports.activateColorDecorations = activateColorDecorations;
//# sourceMappingURL=colorDecorators.js.map