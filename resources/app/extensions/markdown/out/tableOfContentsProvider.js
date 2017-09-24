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
var TableOfContentsProvider = (function () {
    function TableOfContentsProvider(engine, document) {
        this.engine = engine;
        this.document = document;
    }
    TableOfContentsProvider.prototype.getToc = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!!this.toc) return [3 /*break*/, 4];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        _a = this;
                        return [4 /*yield*/, this.buildToc(this.document)];
                    case 2:
                        _a.toc = _b.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _b.sent();
                        this.toc = [];
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, this.toc];
                }
            });
        });
    };
    TableOfContentsProvider.prototype.lookup = function (fragment) {
        return __awaiter(this, void 0, void 0, function () {
            var slug, _i, _a, entry;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        slug = TableOfContentsProvider.slugify(fragment);
                        _i = 0;
                        return [4 /*yield*/, this.getToc()];
                    case 1:
                        _a = _b.sent();
                        _b.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        entry = _a[_i];
                        if (entry.slug === slug) {
                            return [2 /*return*/, entry.line];
                        }
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 2];
                    case 4: return [2 /*return*/, NaN];
                }
            });
        });
    };
    TableOfContentsProvider.prototype.buildToc = function (document) {
        return __awaiter(this, void 0, void 0, function () {
            var toc, tokens, _i, _a, heading, lineNumber, line, href;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        toc = [];
                        return [4 /*yield*/, this.engine.parse(document.uri, document.getText())];
                    case 1:
                        tokens = _b.sent();
                        for (_i = 0, _a = tokens.filter(function (token) { return token.type === 'heading_open'; }); _i < _a.length; _i++) {
                            heading = _a[_i];
                            lineNumber = heading.map[0];
                            line = document.lineAt(lineNumber);
                            href = TableOfContentsProvider.slugify(line.text);
                            if (href) {
                                toc.push({
                                    slug: href,
                                    text: TableOfContentsProvider.getHeaderText(line.text),
                                    line: lineNumber,
                                    location: new vscode.Location(document.uri, line.range)
                                });
                            }
                        }
                        return [2 /*return*/, toc];
                }
            });
        });
    };
    TableOfContentsProvider.getHeaderText = function (header) {
        return header.replace(/^\s*(#+)\s*(.*?)\s*\1*$/, function (_, level, word) { return level + " " + word.trim(); });
    };
    TableOfContentsProvider.slugify = function (header) {
        return encodeURI(header.trim()
            .toLowerCase()
            .replace(/[\]\[\!\"\#\$\%\&\'\(\)\*\+\,\.\/\:\;\<\=\>\?\@\\\^\_\{\|\}\~]/g, '')
            .replace(/\s+/g, '-')
            .replace(/^\-+/, '')
            .replace(/\-+$/, ''));
    };
    return TableOfContentsProvider;
}());
exports.TableOfContentsProvider = TableOfContentsProvider;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/0eb40ad2cd45f7b02b138b1a4090966905ed0fec/extensions/markdown/out/tableOfContentsProvider.js.map
