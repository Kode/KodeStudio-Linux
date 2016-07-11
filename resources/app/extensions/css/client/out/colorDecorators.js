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
    var activeEditor = vscode_1.window.activeTextEditor;
    if (activeEditor) {
        triggerUpdateDecorations();
    }
    vscode_1.window.onDidChangeActiveTextEditor(function (editor) {
        activeEditor = editor;
        if (editor && supportedLanguages[activeEditor.document.languageId]) {
            triggerUpdateDecorations();
        }
    }, null, disposables);
    vscode_1.workspace.onDidChangeTextDocument(function (event) {
        if (activeEditor && event.document === activeEditor.document && supportedLanguages[activeEditor.document.languageId]) {
            triggerUpdateDecorations();
        }
    }, null, disposables);
    var timeout = null;
    function triggerUpdateDecorations() {
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(updateDecorations, 500);
    }
    function updateDecorations() {
        if (!activeEditor) {
            return;
        }
        var document = activeEditor.document;
        if (!supportedLanguages[document.languageId]) {
            return;
        }
        var uri = activeEditor.document.uri.toString();
        decoratorProvider(uri).then(function (ranges) {
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
            activeEditor.setDecorations(colorsDecorationType, decorations);
        });
    }
    return vscode_1.Disposable.from.apply(vscode_1.Disposable, disposables);
}
exports.activateColorDecorations = activateColorDecorations;
//# sourceMappingURL=colorDecorators.js.map