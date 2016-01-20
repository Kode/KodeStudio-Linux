/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'vs/nls', 'vs/base/common/severity', 'vs/base/common/types', 'vs/base/common/collections', 'vs/languages/typescript/common/lib/typescriptServices', './rules/layout', './rules/typescript', './rules/javascript'], function (require, exports, nls, severity_1, types, collections, ts, layoutRules, typescriptRules, javascriptRules) {
    var SimpleStyleRuleChecker = (function () {
        function SimpleStyleRuleChecker(rules) {
            this._rules = {};
            this._errors = [];
            for (var i = 0, len = rules.length; i < len; i++) {
                this._addRule(rules[i]);
            }
        }
        SimpleStyleRuleChecker.prototype._addRule = function (entry) {
            var _this = this;
            var callback = function (filter) {
                collections.lookupOrInsert(_this._rules, filter, []).push(entry);
            };
            if (entry.rule.filter) {
                entry.rule.filter.forEach(callback);
            }
            else {
                callback(-1);
            }
        };
        SimpleStyleRuleChecker.prototype.check = function (sourceFile) {
            this._errors.length = 0;
            this._currentSeverity = severity_1.default.Warning;
            this._sourceFile = sourceFile;
            this._visit(sourceFile);
            return this._errors.slice(0);
        };
        // ----- context implementation ------------------------------------------------------------
        SimpleStyleRuleChecker.prototype.reportError = function (node, message, code, position, width) {
            if (!node) {
                return;
            }
            if (typeof position === 'undefined') {
                position = ts.getTokenPosOfNode(node);
            }
            if (typeof width === 'undefined') {
                width = node.getWidth();
            }
            var startPosition = this._sourceFile.getLineAndCharacterOfPosition(position), endPosition = this._sourceFile.getLineAndCharacterOfPosition(position + width);
            this._errors.push({
                message: message,
                code: code,
                severity: this._currentSeverity,
                range: {
                    startLineNumber: 1 + startPosition.line,
                    startColumn: 1 + startPosition.character,
                    endLineNumber: 1 + endPosition.line,
                    endColumn: 1 + endPosition.character
                }
            });
        };
        // ---- traversal -------------------------------------------------------------------------
        SimpleStyleRuleChecker.prototype._visit = function (node) {
            var _this = this;
            if (!node) {
                return;
            }
            // check the syntax element
            this._checkNodeOrToken(node);
            // continue with children
            ts.forEachChild(node, function (child) {
                _this._visit(child);
            });
        };
        SimpleStyleRuleChecker.prototype._checkNodeOrToken = function (node) {
            var rules = collections.lookup(this._rules, node.kind, []).concat(collections.lookup(this._rules, -1, []));
            for (var i = 0, len = rules.length; i < len; i++) {
                this._currentSeverity = rules[i].severity;
                if (this._currentSeverity === severity_1.default.Ignore) {
                    continue;
                }
                try {
                    rules[i].rule.checkNode(node, this);
                }
                catch (e) {
                    // remove lint rule?
                    console.error(e);
                }
            }
        };
        return SimpleStyleRuleChecker;
    })();
    exports.SimpleStyleRuleChecker = SimpleStyleRuleChecker;
    var LanuageServiceStyleRuleChecker = (function (_super) {
        __extends(LanuageServiceStyleRuleChecker, _super);
        function LanuageServiceStyleRuleChecker(_languageService, rules) {
            _super.call(this, rules);
            this._languageService = _languageService;
        }
        // ---- context implementation -----------------------------------------------
        LanuageServiceStyleRuleChecker.prototype.languageService = function () {
            return this._languageService;
        };
        LanuageServiceStyleRuleChecker.prototype.filename = function () {
            return this._filename;
        };
        // ---- checker ---------------------------------------------------------------
        LanuageServiceStyleRuleChecker.prototype.check = function (syntaxTree) {
            this._filename = syntaxTree.fileName;
            return _super.prototype.check.call(this, syntaxTree);
        };
        return LanuageServiceStyleRuleChecker;
    })(SimpleStyleRuleChecker);
    exports.LanuageServiceStyleRuleChecker = LanuageServiceStyleRuleChecker;
    var StyleRuleCheckerWithMessages = (function (_super) {
        __extends(StyleRuleCheckerWithMessages, _super);
        function StyleRuleCheckerWithMessages() {
            _super.apply(this, arguments);
        }
        StyleRuleCheckerWithMessages.prototype.reportError = function (element, message, code, position, width) {
            return _super.prototype.reportError.call(this, element, this._lookupMessage(message, code), code, position, width);
        };
        StyleRuleCheckerWithMessages.prototype._lookupMessage = function (message, code) {
            switch (code) {
                case 'SA1503': return nls.localize('layout.curlyBracketsMustNotBeOmitted', "Don't spare curly brackets.");
                case 'SA1514': return nls.localize('layout.emptyblock', "Empty block should have a comment.");
                case 'SA9005': return nls.localize('javascript.comparisonOperatorNotStrict', "Use '!==' and '===' instead of '!=' and '=='.");
                case 'SA9050': return nls.localize('javascript.missingSemicolon', "Missing semicolon.");
                case 'SA9051': return nls.localize('javascript.reservedKeyword', "Don't use reserved keywords.");
                case 'SA9052': return nls.localize('javascript.typescriptSpecific', "Don't use a TypeScript specific language construct in JavaScript.");
                case 'SA9053': return nls.localize('javascript.typeofCannotBeCompared', "Unexpected output of the 'typeof'-operator.");
                case 'SA9054': return nls.localize('javascript.semicolonInsteadOfBlock', "Semicolon instead of block.");
                case 'SA9055': return nls.localize('javascript.functionInsideLoop', "Function inside loop.");
                case 'SA9062': return nls.localize('javascript.newOnLowercaseFunctions', "Function with lowercase name used as constructor.");
                case 'SA9002': return nls.localize('typescript.missingReturnType', "Missing return type.");
                case 'SA9056': return nls.localize('typescript.looksLikeTripleSlash', "Did you mean '/// <reference path=\"some/path.ts\" />'?");
                case 'SA9057': return nls.localize('typescript.unusedImport', "Unused import.");
                case 'SA9058': return nls.localize('typescript.unusedLocalVariable', "Unused local variable.");
                case 'SA9059': return nls.localize('typescript.unusedFunction', "Unused local function.");
                case 'SA9060': return nls.localize('typescript.unusedPrivateMember', "Unused private member.");
                case 'SA9061': return nls.localize('typescript.variableUsedBeforeDeclared', "Variable is used before it is declared.");
            }
            return message;
        };
        return StyleRuleCheckerWithMessages;
    })(LanuageServiceStyleRuleChecker);
    exports.StyleRuleCheckerWithMessages = StyleRuleCheckerWithMessages;
    function fillInConstructorFunctions(_module, result) {
        for (var name in _module) {
            if (_module.hasOwnProperty(name)) {
                var ctor = _module[name];
                if (typeof ctor === 'function') {
                    result[String(name).toLowerCase()] = ctor;
                }
            }
        }
    }
    function createRulesFromSettings(options) {
        var functions = {}, result = [], settings = options.validate.lint;
        fillInConstructorFunctions(layoutRules, functions);
        fillInConstructorFunctions(javascriptRules, functions);
        fillInConstructorFunctions(typescriptRules, functions);
        for (var key in settings) {
            if (settings.hasOwnProperty(key)) {
                var ctor = collections.lookup(functions, String(key).toLowerCase());
                if (ctor) {
                    result.push({
                        rule: types.create(ctor),
                        severity: severity_1.default.fromValue(settings[key])
                    });
                }
            }
        }
        return result;
    }
    function check(settings, languageService, resource) {
        var rules = createRulesFromSettings(settings), checker = new StyleRuleCheckerWithMessages(languageService, rules);
        return checker.check(languageService.getSourceFile(resource.toString()));
    }
    exports.check = check;
});
//# sourceMappingURL=lint.js.map