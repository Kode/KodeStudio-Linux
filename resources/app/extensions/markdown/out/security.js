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
var previewContentProvider_1 = require("./previewContentProvider");
var nls = require("vscode-nls");
var localize = nls.loadMessageBundle(__filename);
var MarkdownPreviewSecurityLevel;
(function (MarkdownPreviewSecurityLevel) {
    MarkdownPreviewSecurityLevel[MarkdownPreviewSecurityLevel["Strict"] = 0] = "Strict";
    MarkdownPreviewSecurityLevel[MarkdownPreviewSecurityLevel["AllowInsecureContent"] = 1] = "AllowInsecureContent";
    MarkdownPreviewSecurityLevel[MarkdownPreviewSecurityLevel["AllowScriptsAndAllContent"] = 2] = "AllowScriptsAndAllContent";
})(MarkdownPreviewSecurityLevel = exports.MarkdownPreviewSecurityLevel || (exports.MarkdownPreviewSecurityLevel = {}));
var ExtensionContentSecurityPolicyArbiter = (function () {
    function ExtensionContentSecurityPolicyArbiter(globalState) {
        this.globalState = globalState;
        this.old_trusted_workspace_key = 'trusted_preview_workspace:';
        this.security_level_key = 'preview_security_level:';
    }
    ExtensionContentSecurityPolicyArbiter.prototype.getSecurityLevelForResource = function (resource) {
        // Use new security level setting first
        var level = this.globalState.get(this.security_level_key + this.getRoot(resource), undefined);
        if (typeof level !== 'undefined') {
            return level;
        }
        // Fallback to old trusted workspace setting
        if (this.globalState.get(this.old_trusted_workspace_key + this.getRoot(resource), false)) {
            return MarkdownPreviewSecurityLevel.AllowScriptsAndAllContent;
        }
        return MarkdownPreviewSecurityLevel.Strict;
    };
    ExtensionContentSecurityPolicyArbiter.prototype.setSecurityLevelForResource = function (resource, level) {
        return this.globalState.update(this.security_level_key + this.getRoot(resource), level);
    };
    ExtensionContentSecurityPolicyArbiter.prototype.shouldAllowSvgsForResource = function (resource) {
        var securityLevel = this.getSecurityLevelForResource(resource);
        return securityLevel === MarkdownPreviewSecurityLevel.AllowInsecureContent || securityLevel === MarkdownPreviewSecurityLevel.AllowScriptsAndAllContent;
    };
    ExtensionContentSecurityPolicyArbiter.prototype.getRoot = function (resource) {
        if (vscode.workspace.workspaceFolders) {
            var folderForResource = vscode.workspace.getWorkspaceFolder(resource);
            if (folderForResource) {
                return folderForResource.uri;
            }
            if (vscode.workspace.workspaceFolders.length) {
                return vscode.workspace.workspaceFolders[0].uri;
            }
        }
        return resource;
    };
    return ExtensionContentSecurityPolicyArbiter;
}());
exports.ExtensionContentSecurityPolicyArbiter = ExtensionContentSecurityPolicyArbiter;
var PreviewSecuritySelector = (function () {
    function PreviewSecuritySelector(cspArbiter, contentProvider) {
        this.cspArbiter = cspArbiter;
        this.contentProvider = contentProvider;
    }
    PreviewSecuritySelector.prototype.showSecutitySelectorForResource = function (resource) {
        return __awaiter(this, void 0, void 0, function () {
            function markActiveWhen(when) {
                return when ? '• ' : '';
            }
            var currentSecurityLevel, selection, sourceUri;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        currentSecurityLevel = this.cspArbiter.getSecurityLevelForResource(resource);
                        return [4 /*yield*/, vscode.window.showQuickPick([
                                {
                                    type: MarkdownPreviewSecurityLevel.Strict,
                                    label: markActiveWhen(currentSecurityLevel === MarkdownPreviewSecurityLevel.Strict) + localize(0, null),
                                    description: localize(1, null),
                                }, {
                                    type: MarkdownPreviewSecurityLevel.AllowInsecureContent,
                                    label: markActiveWhen(currentSecurityLevel === MarkdownPreviewSecurityLevel.AllowInsecureContent) + localize(2, null),
                                    description: localize(3, null),
                                }, {
                                    type: MarkdownPreviewSecurityLevel.AllowScriptsAndAllContent,
                                    label: markActiveWhen(currentSecurityLevel === MarkdownPreviewSecurityLevel.AllowScriptsAndAllContent) + localize(4, null),
                                    description: localize(5, null),
                                }, {
                                    type: 'moreinfo',
                                    label: localize(6, null),
                                    description: ''
                                }
                            ], {
                                placeHolder: localize(7, null),
                            })];
                    case 1:
                        selection = _a.sent();
                        if (!selection) {
                            return [2 /*return*/];
                        }
                        if (selection.type === 'moreinfo') {
                            vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://go.microsoft.com/fwlink/?linkid=854414'));
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.cspArbiter.setSecurityLevelForResource(resource, selection.type)];
                    case 2:
                        _a.sent();
                        sourceUri = previewContentProvider_1.getMarkdownUri(resource);
                        return [4 /*yield*/, vscode.commands.executeCommand('_workbench.htmlPreview.updateOptions', sourceUri, {
                                allowScripts: true,
                                allowSvgs: this.cspArbiter.shouldAllowSvgsForResource(resource)
                            })];
                    case 3:
                        _a.sent();
                        this.contentProvider.update(sourceUri);
                        return [2 /*return*/];
                }
            });
        });
    };
    return PreviewSecuritySelector;
}());
exports.PreviewSecuritySelector = PreviewSecuritySelector;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/0eb40ad2cd45f7b02b138b1a4090966905ed0fec/extensions/markdown/out/security.js.map
