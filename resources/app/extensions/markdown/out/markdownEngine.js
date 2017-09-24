"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
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
var tableOfContentsProvider_1 = require("./tableOfContentsProvider");
var FrontMatterRegex = /^---\s*[^]*?(-{3}|\.{3})\s*/;
var MarkdownEngine = (function () {
    function MarkdownEngine() {
        this.plugins = [];
    }
    MarkdownEngine.prototype.addPlugin = function (factory) {
        if (this.md) {
            this.usePlugin(factory);
        }
        else {
            this.plugins.push(factory);
        }
    };
    MarkdownEngine.prototype.usePlugin = function (factory) {
        try {
            this.md = factory(this.md);
        }
        catch (e) {
            // noop
        }
    };
    MarkdownEngine.prototype.getEngine = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var hljs_1, mdnh, _a, _i, _b, plugin, _c, _d, renderName, config;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        if (!!this.md) return [3 /*break*/, 4];
                        return [4 /*yield*/, Promise.resolve().then(function () { return require('highlight.js'); })];
                    case 1:
                        hljs_1 = _e.sent();
                        return [4 /*yield*/, Promise.resolve().then(function () { return require('markdown-it-named-headers'); })];
                    case 2:
                        mdnh = _e.sent();
                        _a = this;
                        return [4 /*yield*/, Promise.resolve().then(function () { return require('markdown-it'); })];
                    case 3:
                        _a.md = (_e.sent())({
                            html: true,
                            highlight: function (str, lang) {
                                if (lang && hljs_1.getLanguage(lang)) {
                                    try {
                                        return "<pre class=\"hljs\"><code><div>" + hljs_1.highlight(lang, str, true).value + "</div></code></pre>";
                                    }
                                    catch (error) { }
                                }
                                return "<pre class=\"hljs\"><code><div>" + _this.md.utils.escapeHtml(str) + "</div></code></pre>";
                            }
                        }).use(mdnh, {
                            slugify: function (header) { return tableOfContentsProvider_1.TableOfContentsProvider.slugify(header); }
                        });
                        for (_i = 0, _b = this.plugins; _i < _b.length; _i++) {
                            plugin = _b[_i];
                            this.usePlugin(plugin);
                        }
                        this.plugins = [];
                        for (_c = 0, _d = ['paragraph_open', 'heading_open', 'image', 'code_block', 'blockquote_open', 'list_item_open']; _c < _d.length; _c++) {
                            renderName = _d[_c];
                            this.addLineNumberRenderer(this.md, renderName);
                        }
                        this.addLinkNormalizer(this.md);
                        this.addLinkValidator(this.md);
                        _e.label = 4;
                    case 4:
                        config = vscode.workspace.getConfiguration('markdown');
                        this.md.set({
                            breaks: config.get('preview.breaks', false),
                            linkify: config.get('preview.linkify', true)
                        });
                        return [2 /*return*/, this.md];
                }
            });
        });
    };
    MarkdownEngine.prototype.stripFrontmatter = function (text) {
        var offset = 0;
        var frontMatterMatch = FrontMatterRegex.exec(text);
        if (frontMatterMatch) {
            var frontMatter = frontMatterMatch[0];
            offset = frontMatter.split(/\r\n|\n|\r/g).length - 1;
            text = text.substr(frontMatter.length);
        }
        return { text: text, offset: offset };
    };
    MarkdownEngine.prototype.render = function (document, stripFrontmatter, text) {
        return __awaiter(this, void 0, void 0, function () {
            var offset, markdownContent, engine;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        offset = 0;
                        if (stripFrontmatter) {
                            markdownContent = this.stripFrontmatter(text);
                            offset = markdownContent.offset;
                            text = markdownContent.text;
                        }
                        this.currentDocument = document;
                        this.firstLine = offset;
                        return [4 /*yield*/, this.getEngine()];
                    case 1:
                        engine = _a.sent();
                        return [2 /*return*/, engine.render(text)];
                }
            });
        });
    };
    MarkdownEngine.prototype.parse = function (document, source) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, text, offset, engine;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.stripFrontmatter(source), text = _a.text, offset = _a.offset;
                        this.currentDocument = document;
                        return [4 /*yield*/, this.getEngine()];
                    case 1:
                        engine = _b.sent();
                        return [2 /*return*/, engine.parse(text, {}).map(function (token) {
                                if (token.map) {
                                    token.map[0] += offset;
                                }
                                return token;
                            })];
                }
            });
        });
    };
    MarkdownEngine.prototype.addLineNumberRenderer = function (md, ruleName) {
        var _this = this;
        var original = md.renderer.rules[ruleName];
        md.renderer.rules[ruleName] = function (tokens, idx, options, env, self) {
            var token = tokens[idx];
            if (token.map && token.map.length) {
                token.attrSet('data-line', _this.firstLine + token.map[0]);
                token.attrJoin('class', 'code-line');
            }
            if (original) {
                return original(tokens, idx, options, env, self);
            }
            else {
                return self.renderToken(tokens, idx, options, env, self);
            }
        };
    };
    MarkdownEngine.prototype.addLinkNormalizer = function (md) {
        var _this = this;
        var normalizeLink = md.normalizeLink;
        md.normalizeLink = function (link) {
            try {
                var uri = vscode.Uri.parse(link);
                if (!uri.scheme && uri.path && !uri.fragment) {
                    // Assume it must be a file
                    if (uri.path[0] === '/') {
                        var root = vscode.workspace.getWorkspaceFolder(_this.currentDocument);
                        if (root) {
                            uri = vscode.Uri.file(path.join(root.uri.fsPath, uri.path));
                        }
                    }
                    else {
                        uri = vscode.Uri.file(path.join(path.dirname(_this.currentDocument.path), uri.path));
                    }
                    return normalizeLink(uri.toString(true));
                }
            }
            catch (e) {
                // noop
            }
            return normalizeLink(link);
        };
    };
    MarkdownEngine.prototype.addLinkValidator = function (md) {
        var validateLink = md.validateLink;
        md.validateLink = function (link) {
            // support file:// links
            return validateLink(link) || link.indexOf('file:') === 0;
        };
    };
    return MarkdownEngine;
}());
exports.MarkdownEngine = MarkdownEngine;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/0eb40ad2cd45f7b02b138b1a4090966905ed0fec/extensions/markdown/out/markdownEngine.js.map
