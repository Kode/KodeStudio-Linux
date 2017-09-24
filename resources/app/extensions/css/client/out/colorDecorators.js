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
var parse = require("parse-color");
var vscode_1 = require("vscode");
var MAX_DECORATORS = 500;
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
function activateColorDecorations(decoratorProvider, supportedLanguages, isDecoratorEnabled) {
    var disposables = [];
    var colorsDecorationType = vscode_1.window.createTextEditorDecorationType(decorationType);
    disposables.push(colorsDecorationType);
    var decoratorEnablement = {};
    for (var languageId in supportedLanguages) {
        decoratorEnablement[languageId] = isDecoratorEnabled(languageId);
    }
    var pendingUpdateRequests = {};
    vscode_1.window.onDidChangeVisibleTextEditors(function (editors) {
        for (var _i = 0, editors_1 = editors; _i < editors_1.length; _i++) {
            var editor = editors_1[_i];
            triggerUpdateDecorations(editor.document);
        }
    }, null, disposables);
    vscode_1.workspace.onDidChangeTextDocument(function (event) { return triggerUpdateDecorations(event.document); }, null, disposables);
    // track open and close for document languageId changes
    vscode_1.workspace.onDidCloseTextDocument(function (event) { return triggerUpdateDecorations(event, true); });
    vscode_1.workspace.onDidOpenTextDocument(function (event) { return triggerUpdateDecorations(event); });
    vscode_1.workspace.onDidChangeConfiguration(function (_) {
        var hasChanges = false;
        for (var languageId in supportedLanguages) {
            var prev = decoratorEnablement[languageId];
            var curr = isDecoratorEnabled(languageId);
            if (prev !== curr) {
                decoratorEnablement[languageId] = curr;
                hasChanges = true;
            }
        }
        if (hasChanges) {
            updateAllVisibleEditors(true);
        }
    }, null, disposables);
    updateAllVisibleEditors(false);
    function updateAllVisibleEditors(settingsChanges) {
        vscode_1.window.visibleTextEditors.forEach(function (editor) {
            if (editor.document) {
                triggerUpdateDecorations(editor.document, settingsChanges);
            }
        });
    }
    function triggerUpdateDecorations(document, settingsChanges) {
        if (settingsChanges === void 0) { settingsChanges = false; }
        var triggerUpdate = supportedLanguages[document.languageId] && (decoratorEnablement[document.languageId] || settingsChanges);
        if (triggerUpdate) {
            var documentUriStr_1 = document.uri.toString();
            var timeout = pendingUpdateRequests[documentUriStr_1];
            if (typeof timeout !== 'undefined') {
                clearTimeout(timeout);
            }
            pendingUpdateRequests[documentUriStr_1] = setTimeout(function () {
                // check if the document is in use by an active editor
                for (var _i = 0, _a = vscode_1.window.visibleTextEditors; _i < _a.length; _i++) {
                    var editor = _a[_i];
                    if (editor.document && documentUriStr_1 === editor.document.uri.toString()) {
                        if (decoratorEnablement[editor.document.languageId]) {
                            updateDecorationForEditor(documentUriStr_1, editor.document.version);
                            break;
                        }
                        else {
                            editor.setDecorations(colorsDecorationType, []);
                        }
                    }
                }
                delete pendingUpdateRequests[documentUriStr_1];
            }, 500);
        }
    }
    function updateDecorationForEditor(contentUri, documentVersion) {
        decoratorProvider(contentUri).then(function (ranges) {
            var _loop_1 = function (editor) {
                var document = editor.document;
                if (document && document.version === documentVersion && contentUri === document.uri.toString()) {
                    var decorations = ranges.slice(0, MAX_DECORATORS).map(function (range) {
                        var color = document.getText(range);
                        if (color[0] === '#' && (color.length === 5 || color.length === 9)) {
                            var c = vscode_1.Color.fromHex(color);
                            if (c) {
                                color = "rgba(" + c.red + ", " + c.green + ", " + c.blue + ", " + c.alpha + ")";
                            }
                        }
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
                }
            };
            for (var _i = 0, _a = vscode_1.window.visibleTextEditors; _i < _a.length; _i++) {
                var editor = _a[_i];
                _loop_1(editor);
            }
        });
    }
    return vscode_1.Disposable.from.apply(vscode_1.Disposable, disposables);
}
exports.activateColorDecorations = activateColorDecorations;
var CSSColorFormats = {
    Hex: '#{red:X}{green:X}{blue:X}',
    RGB: {
        opaque: 'rgb({red}, {green}, {blue})',
        transparent: 'rgba({red}, {green}, {blue}, {alpha:2f[0-1]})'
    },
    HSL: {
        opaque: 'hsl({hue:d[0-360]}, {saturation:d[0-100]}%, {luminosity:d[0-100]}%)',
        transparent: 'hsla({hue:d[0-360]}, {saturation:d[0-100]}%, {luminosity:d[0-100]}%, {alpha:2f[0-1]})'
    }
};
function detectFormat(value) {
    if (/^rgb/i.test(value)) {
        return CSSColorFormats.RGB;
    }
    else if (/^hsl/i.test(value)) {
        return CSSColorFormats.HSL;
    }
    else {
        return CSSColorFormats.Hex;
    }
}
var ColorProvider = (function () {
    function ColorProvider(decoratorProvider) {
        this.decoratorProvider = decoratorProvider;
    }
    ColorProvider.prototype.provideDocumentColors = function (document) {
        return __awaiter(this, void 0, void 0, function () {
            var ranges, result, _i, ranges_1, range, color, value, parsedColor, _a, red, green, blue, alpha, format;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.decoratorProvider(document.uri.toString())];
                    case 1:
                        ranges = _b.sent();
                        result = [];
                        for (_i = 0, ranges_1 = ranges; _i < ranges_1.length; _i++) {
                            range = ranges_1[_i];
                            color = void 0;
                            value = document.getText(range);
                            if (value[0] === '#') {
                                color = vscode_1.Color.fromHex(value);
                            }
                            else {
                                parsedColor = parse(value);
                                if (parsedColor && parsedColor.rgba) {
                                    _a = parsedColor.rgba, red = _a[0], green = _a[1], blue = _a[2], alpha = _a[3];
                                    color = new vscode_1.Color(red, green, blue, alpha);
                                }
                            }
                            if (color) {
                                format = detectFormat(value);
                                result.push(new vscode_1.ColorInfo(range, color, format, [CSSColorFormats.Hex, CSSColorFormats.RGB, CSSColorFormats.HSL]));
                            }
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    return ColorProvider;
}());
exports.ColorProvider = ColorProvider;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/0eb40ad2cd45f7b02b138b1a4090966905ed0fec/extensions/css/client/out/colorDecorators.js.map
