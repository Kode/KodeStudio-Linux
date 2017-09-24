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
var vscode = require("vscode");
var path = require("path");
var nls = require("vscode-nls");
var security_1 = require("./security");
var localize = nls.loadMessageBundle(__filename);
var previewStrings = {
    cspAlertMessageText: localize(0, null),
    cspAlertMessageTitle: localize(1, null),
    cspAlertMessageLabel: localize(2, null)
};
function isMarkdownFile(document) {
    return document.languageId === 'markdown'
        && document.uri.scheme !== 'markdown'; // prevent processing of own documents
}
exports.isMarkdownFile = isMarkdownFile;
function getMarkdownUri(uri) {
    if (uri.scheme === 'markdown') {
        return uri;
    }
    return uri.with({
        scheme: 'markdown',
        path: uri.path + '.rendered',
        query: uri.toString()
    });
}
exports.getMarkdownUri = getMarkdownUri;
var MarkdownPreviewConfig = (function () {
    function MarkdownPreviewConfig() {
        var editorConfig = vscode.workspace.getConfiguration('editor');
        var markdownConfig = vscode.workspace.getConfiguration('markdown');
        var markdownEditorConfig = vscode.workspace.getConfiguration('[markdown]');
        this.scrollBeyondLastLine = editorConfig.get('scrollBeyondLastLine', false);
        this.wordWrap = editorConfig.get('wordWrap', 'off') !== 'off';
        if (markdownEditorConfig && markdownEditorConfig['editor.wordWrap']) {
            this.wordWrap = markdownEditorConfig['editor.wordWrap'] !== 'off';
        }
        this.previewFrontMatter = markdownConfig.get('previewFrontMatter', 'hide');
        this.scrollPreviewWithEditorSelection = !!markdownConfig.get('preview.scrollPreviewWithEditorSelection', true);
        this.scrollEditorWithPreview = !!markdownConfig.get('preview.scrollEditorWithPreview', true);
        this.lineBreaks = !!markdownConfig.get('preview.breaks', false);
        this.doubleClickToSwitchToEditor = !!markdownConfig.get('preview.doubleClickToSwitchToEditor', true);
        this.markEditorSelection = !!markdownConfig.get('preview.markEditorSelection', true);
        this.fontFamily = markdownConfig.get('preview.fontFamily', undefined);
        this.fontSize = Math.max(8, +markdownConfig.get('preview.fontSize', NaN));
        this.lineHeight = Math.max(0.6, +markdownConfig.get('preview.lineHeight', NaN));
        this.styles = markdownConfig.get('styles', []);
    }
    MarkdownPreviewConfig.getCurrentConfig = function () {
        return new MarkdownPreviewConfig();
    };
    MarkdownPreviewConfig.prototype.isEqualTo = function (otherConfig) {
        for (var key in this) {
            if (this.hasOwnProperty(key) && key !== 'styles') {
                if (this[key] !== otherConfig[key]) {
                    return false;
                }
            }
        }
        // Check styles
        if (this.styles.length !== otherConfig.styles.length) {
            return false;
        }
        for (var i = 0; i < this.styles.length; ++i) {
            if (this.styles[i] !== otherConfig.styles[i]) {
                return false;
            }
        }
        return true;
    };
    return MarkdownPreviewConfig;
}());
var MDDocumentContentProvider = (function () {
    function MDDocumentContentProvider(engine, context, cspArbiter, logger) {
        this.engine = engine;
        this.context = context;
        this.cspArbiter = cspArbiter;
        this.logger = logger;
        this._onDidChange = new vscode.EventEmitter();
        this._waiting = false;
        this.extraStyles = [];
        this.extraScripts = [];
        this.config = MarkdownPreviewConfig.getCurrentConfig();
    }
    MDDocumentContentProvider.prototype.addScript = function (resource) {
        this.extraScripts.push(resource);
    };
    MDDocumentContentProvider.prototype.addStyle = function (resource) {
        this.extraStyles.push(resource);
    };
    MDDocumentContentProvider.prototype.getMediaPath = function (mediaFile) {
        return vscode.Uri.file(this.context.asAbsolutePath(path.join('media', mediaFile))).toString();
    };
    MDDocumentContentProvider.prototype.fixHref = function (resource, href) {
        if (!href) {
            return href;
        }
        // Use href if it is already an URL
        var hrefUri = vscode.Uri.parse(href);
        if (['file', 'http', 'https'].indexOf(hrefUri.scheme) >= 0) {
            return hrefUri.toString();
        }
        // Use href as file URI if it is absolute
        if (path.isAbsolute(href)) {
            return vscode.Uri.file(href).toString();
        }
        // use a workspace relative path if there is a workspace
        var root = vscode.workspace.getWorkspaceFolder(resource);
        if (root) {
            return vscode.Uri.file(path.join(root.uri.fsPath, href)).toString();
        }
        // otherwise look relative to the markdown file
        return vscode.Uri.file(path.join(path.dirname(resource.fsPath), href)).toString();
    };
    MDDocumentContentProvider.prototype.computeCustomStyleSheetIncludes = function (uri) {
        var _this = this;
        if (this.config.styles && Array.isArray(this.config.styles)) {
            return this.config.styles.map(function (style) {
                return "<link rel=\"stylesheet\" class=\"code-user-style\" data-source=\"" + style.replace(/"/g, '&quot;') + "\" href=\"" + _this.fixHref(uri, style) + "\" type=\"text/css\" media=\"screen\">";
            }).join('\n');
        }
        return '';
    };
    MDDocumentContentProvider.prototype.getSettingsOverrideStyles = function (nonce) {
        return "<style nonce=\"" + nonce + "\">\n\t\t\tbody {\n\t\t\t\t" + (this.config.fontFamily ? "font-family: " + this.config.fontFamily + ";" : '') + "\n\t\t\t\t" + (isNaN(this.config.fontSize) ? '' : "font-size: " + this.config.fontSize + "px;") + "\n\t\t\t\t" + (isNaN(this.config.lineHeight) ? '' : "line-height: " + this.config.lineHeight + ";") + "\n\t\t\t}\n\t\t</style>";
    };
    MDDocumentContentProvider.prototype.getStyles = function (uri, nonce) {
        var baseStyles = [
            this.getMediaPath('markdown.css'),
            this.getMediaPath('tomorrow.css')
        ].concat(this.extraStyles.map(function (resource) { return resource.toString(); }));
        return baseStyles.map(function (href) { return "<link rel=\"stylesheet\" type=\"text/css\" href=\"" + href + "\">"; }).join('\n') + "\n\t\t\t" + this.getSettingsOverrideStyles(nonce) + "\n\t\t\t" + this.computeCustomStyleSheetIncludes(uri);
    };
    MDDocumentContentProvider.prototype.getScripts = function (nonce) {
        var scripts = [this.getMediaPath('main.js')].concat(this.extraScripts.map(function (resource) { return resource.toString(); }));
        return scripts
            .map(function (source) { return "<script async src=\"" + source + "\" nonce=\"" + nonce + "\"></script>"; })
            .join('\n');
    };
    MDDocumentContentProvider.prototype.provideTextDocumentContent = function (uri) {
        return __awaiter(this, void 0, void 0, function () {
            var sourceUri, initialLine, editor, document, initialData, nonce, csp, body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sourceUri = vscode.Uri.parse(uri.query);
                        initialLine = undefined;
                        editor = vscode.window.activeTextEditor;
                        if (editor && editor.document.uri.fsPath === sourceUri.fsPath) {
                            initialLine = editor.selection.active.line;
                        }
                        return [4 /*yield*/, vscode.workspace.openTextDocument(sourceUri)];
                    case 1:
                        document = _a.sent();
                        this.config = MarkdownPreviewConfig.getCurrentConfig();
                        initialData = {
                            previewUri: uri.toString(),
                            source: sourceUri.toString(),
                            line: initialLine,
                            scrollPreviewWithEditorSelection: this.config.scrollPreviewWithEditorSelection,
                            scrollEditorWithPreview: this.config.scrollEditorWithPreview,
                            doubleClickToSwitchToEditor: this.config.doubleClickToSwitchToEditor
                        };
                        this.logger.log('provideTextDocumentContent', initialData);
                        nonce = new Date().getTime() + '' + new Date().getMilliseconds();
                        csp = this.getCspForResource(sourceUri, nonce);
                        return [4 /*yield*/, this.engine.render(sourceUri, this.config.previewFrontMatter === 'hide', document.getText())];
                    case 2:
                        body = _a.sent();
                        return [2 /*return*/, "<!DOCTYPE html>\n\t\t\t<html>\n\t\t\t<head>\n\t\t\t\t<meta http-equiv=\"Content-type\" content=\"text/html;charset=UTF-8\">\n\t\t\t\t" + csp + "\n\t\t\t\t<meta id=\"vscode-markdown-preview-data\" data-settings=\"" + JSON.stringify(initialData).replace(/"/g, '&quot;') + "\" data-strings=\"" + JSON.stringify(previewStrings).replace(/"/g, '&quot;') + "\">\n\t\t\t\t<script src=\"" + this.getMediaPath('csp.js') + "\" nonce=\"" + nonce + "\"></script>\n\t\t\t\t<script src=\"" + this.getMediaPath('loading.js') + "\" nonce=\"" + nonce + "\"></script>\n\t\t\t\t" + this.getStyles(uri, nonce) + "\n\t\t\t\t<base href=\"" + document.uri.toString(true) + "\">\n\t\t\t</head>\n\t\t\t<body class=\"vscode-body " + (this.config.scrollBeyondLastLine ? 'scrollBeyondLastLine' : '') + " " + (this.config.wordWrap ? 'wordWrap' : '') + " " + (this.config.markEditorSelection ? 'showEditorSelection' : '') + "\">\n\t\t\t\t" + body + "\n\t\t\t\t<div class=\"code-line\" data-line=\"" + document.lineCount + "\"></div>\n\t\t\t\t" + this.getScripts(nonce) + "\n\t\t\t</body>\n\t\t\t</html>"];
                }
            });
        });
    };
    MDDocumentContentProvider.prototype.updateConfiguration = function () {
        var newConfig = MarkdownPreviewConfig.getCurrentConfig();
        if (!this.config.isEqualTo(newConfig)) {
            this.config = newConfig;
            // update all generated md documents
            for (var _i = 0, _a = vscode.workspace.textDocuments; _i < _a.length; _i++) {
                var document_1 = _a[_i];
                if (document_1.uri.scheme === 'markdown') {
                    this.update(document_1.uri);
                }
            }
        }
    };
    Object.defineProperty(MDDocumentContentProvider.prototype, "onDidChange", {
        get: function () {
            return this._onDidChange.event;
        },
        enumerable: true,
        configurable: true
    });
    MDDocumentContentProvider.prototype.update = function (uri) {
        var _this = this;
        if (!this._waiting) {
            this._waiting = true;
            setTimeout(function () {
                _this._waiting = false;
                _this._onDidChange.fire(uri);
            }, 300);
        }
    };
    MDDocumentContentProvider.prototype.getCspForResource = function (resource, nonce) {
        switch (this.cspArbiter.getSecurityLevelForResource(resource)) {
            case security_1.MarkdownPreviewSecurityLevel.AllowInsecureContent:
                return "<meta http-equiv=\"Content-Security-Policy\" content=\"default-src 'none'; img-src 'self' http: https: data:; media-src 'self' http: https: data:; script-src 'nonce-" + nonce + "'; style-src 'self' 'unsafe-inline' http: https: data:; font-src 'self' http: https: data:;\">";
            case security_1.MarkdownPreviewSecurityLevel.AllowScriptsAndAllContent:
                return '';
            case security_1.MarkdownPreviewSecurityLevel.Strict:
            default:
                return "<meta http-equiv=\"Content-Security-Policy\" content=\"default-src 'none'; img-src 'self' https: data:; media-src 'self' https: data:; script-src 'nonce-" + nonce + "'; style-src 'self' 'unsafe-inline' https: data:; font-src 'self' https: data:;\">";
        }
    };
    return MDDocumentContentProvider;
}());
exports.MDDocumentContentProvider = MDDocumentContentProvider;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/0eb40ad2cd45f7b02b138b1a4090966905ed0fec/extensions/markdown/out/previewContentProvider.js.map
