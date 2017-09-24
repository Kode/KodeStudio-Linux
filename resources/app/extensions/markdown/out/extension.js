/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var nls = require("vscode-nls");
var localize = nls.config(process.env.VSCODE_NLS_CONFIG)(__filename);
var vscode = require("vscode");
var path = require("path");
var vscode_extension_telemetry_1 = require("vscode-extension-telemetry");
var markdownEngine_1 = require("./markdownEngine");
var documentLinkProvider_1 = require("./documentLinkProvider");
var documentSymbolProvider_1 = require("./documentSymbolProvider");
var security_1 = require("./security");
var previewContentProvider_1 = require("./previewContentProvider");
var tableOfContentsProvider_1 = require("./tableOfContentsProvider");
var logger_1 = require("./logger");
var resolveExtensionResources = function (extension, stylePath) {
    var resource = vscode.Uri.parse(stylePath);
    if (resource.scheme) {
        return resource;
    }
    return vscode.Uri.file(path.join(extension.extensionPath, stylePath));
};
var telemetryReporter;
function activate(context) {
    var _this = this;
    var packageInfo = getPackageInfo();
    telemetryReporter = packageInfo && new vscode_extension_telemetry_1.default(packageInfo.name, packageInfo.version, packageInfo.aiKey);
    if (telemetryReporter) {
        context.subscriptions.push(telemetryReporter);
    }
    var cspArbiter = new security_1.ExtensionContentSecurityPolicyArbiter(context.globalState);
    var engine = new markdownEngine_1.MarkdownEngine();
    var logger = new logger_1.Logger();
    var contentProvider = new previewContentProvider_1.MDDocumentContentProvider(engine, context, cspArbiter, logger);
    var contentProviderRegistration = vscode.workspace.registerTextDocumentContentProvider('markdown', contentProvider);
    var previewSecuritySelector = new security_1.PreviewSecuritySelector(cspArbiter, contentProvider);
    var _loop_1 = function (extension) {
        var contributes = extension.packageJSON && extension.packageJSON.contributes;
        if (!contributes) {
            return "continue";
        }
        var styles = contributes['markdown.previewStyles'];
        if (styles && Array.isArray(styles)) {
            for (var _i = 0, styles_1 = styles; _i < styles_1.length; _i++) {
                var style = styles_1[_i];
                try {
                    contentProvider.addStyle(resolveExtensionResources(extension, style));
                }
                catch (e) {
                    // noop
                }
            }
        }
        var scripts = contributes['markdown.previewScripts'];
        if (scripts && Array.isArray(scripts)) {
            for (var _a = 0, scripts_1 = scripts; _a < scripts_1.length; _a++) {
                var script = scripts_1[_a];
                try {
                    contentProvider.addScript(resolveExtensionResources(extension, script));
                }
                catch (e) {
                    // noop
                }
            }
        }
        if (contributes['markdown.markdownItPlugins']) {
            extension.activate().then(function () {
                if (extension.exports && extension.exports.extendMarkdownIt) {
                    engine.addPlugin(function (md) { return extension.exports.extendMarkdownIt(md); });
                }
            });
        }
    };
    for (var _i = 0, _a = vscode.extensions.all; _i < _a.length; _i++) {
        var extension = _a[_i];
        _loop_1(extension);
    }
    var symbolsProvider = new documentSymbolProvider_1.default(engine);
    var symbolsProviderRegistration = vscode.languages.registerDocumentSymbolProvider({ language: 'markdown' }, symbolsProvider);
    context.subscriptions.push(contentProviderRegistration, symbolsProviderRegistration);
    context.subscriptions.push(vscode.languages.registerDocumentLinkProvider('markdown', new documentLinkProvider_1.default()));
    context.subscriptions.push(vscode.commands.registerCommand('markdown.showPreview', function (uri) { return showPreview(cspArbiter, uri, false); }));
    context.subscriptions.push(vscode.commands.registerCommand('markdown.showPreviewToSide', function (uri) { return showPreview(cspArbiter, uri, true); }));
    context.subscriptions.push(vscode.commands.registerCommand('markdown.showSource', showSource));
    context.subscriptions.push(vscode.commands.registerCommand('_markdown.revealLine', function (uri, line) {
        var sourceUri = vscode.Uri.parse(decodeURIComponent(uri));
        logger.log('revealLine', { uri: uri, sourceUri: sourceUri.toString(), line: line });
        vscode.window.visibleTextEditors
            .filter(function (editor) { return previewContentProvider_1.isMarkdownFile(editor.document) && editor.document.uri.fsPath === sourceUri.fsPath; })
            .forEach(function (editor) {
            var sourceLine = Math.floor(line);
            var fraction = line - sourceLine;
            var text = editor.document.lineAt(sourceLine).text;
            var start = Math.floor(fraction * text.length);
            editor.revealRange(new vscode.Range(sourceLine, start, sourceLine + 1, 0), vscode.TextEditorRevealType.AtTop);
        });
    }));
    context.subscriptions.push(vscode.commands.registerCommand('_markdown.didClick', function (uri, line) {
        var sourceUri = vscode.Uri.parse(decodeURIComponent(uri));
        return vscode.workspace.openTextDocument(sourceUri)
            .then(function (document) { return vscode.window.showTextDocument(document); })
            .then(function (editor) {
            return vscode.commands.executeCommand('revealLine', { lineNumber: Math.floor(line), at: 'center' })
                .then(function () { return editor; });
        })
            .then(function (editor) {
            if (editor) {
                editor.selection = new vscode.Selection(new vscode.Position(Math.floor(line), 0), new vscode.Position(Math.floor(line), 0));
            }
        });
    }));
    context.subscriptions.push(vscode.commands.registerCommand('_markdown.openDocumentLink', function (args) {
        var tryRevealLine = function (editor) { return __awaiter(_this, void 0, void 0, function () {
            var toc, line;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(editor && args.fragment)) return [3 /*break*/, 2];
                        toc = new tableOfContentsProvider_1.TableOfContentsProvider(engine, editor.document);
                        return [4 /*yield*/, toc.lookup(args.fragment)];
                    case 1:
                        line = _a.sent();
                        if (!isNaN(line)) {
                            return [2 /*return*/, editor.revealRange(new vscode.Range(line, 0, line, 0), vscode.TextEditorRevealType.AtTop)];
                        }
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        }); };
        if (vscode.window.activeTextEditor && previewContentProvider_1.isMarkdownFile(vscode.window.activeTextEditor.document) && vscode.window.activeTextEditor.document.uri.fsPath === args.path) {
            return tryRevealLine(vscode.window.activeTextEditor);
        }
        else {
            var resource_1 = vscode.Uri.file(args.path);
            return vscode.workspace.openTextDocument(resource_1)
                .then(vscode.window.showTextDocument)
                .then(tryRevealLine, function (_) { return vscode.commands.executeCommand('vscode.open', resource_1); });
        }
    }));
    context.subscriptions.push(vscode.commands.registerCommand('markdown.showPreviewSecuritySelector', function (resource) {
        if (resource) {
            var source = vscode.Uri.parse(resource).query;
            previewSecuritySelector.showSecutitySelectorForResource(vscode.Uri.parse(source));
        }
        else {
            if (vscode.window.activeTextEditor && vscode.window.activeTextEditor.document.languageId === 'markdown') {
                previewSecuritySelector.showSecutitySelectorForResource(vscode.window.activeTextEditor.document.uri);
            }
        }
    }));
    context.subscriptions.push(vscode.commands.registerCommand('markdown.refreshPreview', function (resource) {
        if (resource) {
            var source = vscode.Uri.parse(resource);
            contentProvider.update(source);
        }
        else if (vscode.window.activeTextEditor && previewContentProvider_1.isMarkdownFile(vscode.window.activeTextEditor.document)) {
            contentProvider.update(previewContentProvider_1.getMarkdownUri(vscode.window.activeTextEditor.document.uri));
        }
        else if (!vscode.window.activeTextEditor) {
            // update all generated md documents
            for (var _i = 0, _a = vscode.workspace.textDocuments; _i < _a.length; _i++) {
                var document_1 = _a[_i];
                if (document_1.uri.scheme === 'markdown') {
                    contentProvider.update(document_1.uri);
                }
            }
        }
    }));
    context.subscriptions.push(vscode.commands.registerCommand('_markdown.onPreviewStyleLoadError', function (resources) {
        vscode.window.showWarningMessage(localize(0, null, resources.join(', ')));
    }));
    context.subscriptions.push(vscode.workspace.onDidSaveTextDocument(function (document) {
        if (previewContentProvider_1.isMarkdownFile(document)) {
            var uri = previewContentProvider_1.getMarkdownUri(document.uri);
            contentProvider.update(uri);
        }
    }));
    context.subscriptions.push(vscode.workspace.onDidChangeTextDocument(function (event) {
        if (previewContentProvider_1.isMarkdownFile(event.document)) {
            var uri = previewContentProvider_1.getMarkdownUri(event.document.uri);
            contentProvider.update(uri);
        }
    }));
    context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(function () {
        logger.updateConfiguration();
        contentProvider.updateConfiguration();
    }));
    context.subscriptions.push(vscode.window.onDidChangeTextEditorSelection(function (event) {
        if (previewContentProvider_1.isMarkdownFile(event.textEditor.document)) {
            var markdownFile = previewContentProvider_1.getMarkdownUri(event.textEditor.document.uri);
            logger.log('updatePreviewForSelection', { markdownFile: markdownFile.toString() });
            vscode.commands.executeCommand('_workbench.htmlPreview.postMessage', markdownFile, {
                line: event.selections[0].active.line
            });
        }
    }));
}
exports.activate = activate;
function showPreview(cspArbiter, uri, sideBySide) {
    if (sideBySide === void 0) { sideBySide = false; }
    var resource = uri;
    if (!(resource instanceof vscode.Uri)) {
        if (vscode.window.activeTextEditor) {
            // we are relaxed and don't check for markdown files
            resource = vscode.window.activeTextEditor.document.uri;
        }
    }
    if (!(resource instanceof vscode.Uri)) {
        if (!vscode.window.activeTextEditor) {
            // this is most likely toggling the preview
            return vscode.commands.executeCommand('markdown.showSource');
        }
        // nothing found that could be shown or toggled
        return;
    }
    var thenable = vscode.commands.executeCommand('vscode.previewHtml', previewContentProvider_1.getMarkdownUri(resource), getViewColumn(sideBySide), "Preview '" + path.basename(resource.fsPath) + "'", {
        allowScripts: true,
        allowSvgs: cspArbiter.shouldAllowSvgsForResource(resource)
    });
    if (telemetryReporter) {
        telemetryReporter.sendTelemetryEvent('openPreview', {
            where: sideBySide ? 'sideBySide' : 'inPlace',
            how: (uri instanceof vscode.Uri) ? 'action' : 'pallete'
        });
    }
    return thenable;
}
function getViewColumn(sideBySide) {
    var active = vscode.window.activeTextEditor;
    if (!active) {
        return vscode.ViewColumn.One;
    }
    if (!sideBySide) {
        return active.viewColumn;
    }
    switch (active.viewColumn) {
        case vscode.ViewColumn.One:
            return vscode.ViewColumn.Two;
        case vscode.ViewColumn.Two:
            return vscode.ViewColumn.Three;
    }
    return active.viewColumn;
}
function showSource(mdUri) {
    if (!mdUri) {
        return vscode.commands.executeCommand('workbench.action.navigateBack');
    }
    var docUri = vscode.Uri.parse(mdUri.query);
    for (var _i = 0, _a = vscode.window.visibleTextEditors; _i < _a.length; _i++) {
        var editor = _a[_i];
        if (editor.document.uri.scheme === docUri.scheme && editor.document.uri.fsPath === docUri.fsPath) {
            return vscode.window.showTextDocument(editor.document, editor.viewColumn);
        }
    }
    return vscode.workspace.openTextDocument(docUri)
        .then(vscode.window.showTextDocument);
}
function getPackageInfo() {
    var extention = vscode.extensions.getExtension('Microsoft.vscode-markdown');
    if (extention && extention.packageJSON) {
        return {
            name: extention.packageJSON.name,
            version: extention.packageJSON.version,
            aiKey: extention.packageJSON.aiKey
        };
    }
    return null;
}
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/0eb40ad2cd45f7b02b138b1a4090966905ed0fec/extensions/markdown/out/extension.js.map
