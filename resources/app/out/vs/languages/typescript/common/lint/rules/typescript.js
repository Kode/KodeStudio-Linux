/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/base/common/strings', 'vs/languages/typescript/common/lib/typescriptServices'], function (require, exports, strings, ts) {
    /**
     * Use of functions without return type
     */
    var FunctionsWithoutReturnType = (function () {
        function FunctionsWithoutReturnType() {
            this.code = 'SA9002';
            this.name = 'FunctionsWithoutReturnType';
            this.filter = [
                203 /* FunctionDeclaration */,
                136 /* MethodDeclaration */,
                166 /* ArrowFunction */
            ];
        }
        FunctionsWithoutReturnType.prototype.checkNode = function (node, context) {
            if (node.type) {
                return;
            }
            context.reportError(node.name, this.name, this.code);
        };
        return FunctionsWithoutReturnType;
    })();
    exports.FunctionsWithoutReturnType = FunctionsWithoutReturnType;
    /**
     * A single line comment that could be a mistyped ///-reference.
     */
    var TripleSlashReferenceAlike = (function () {
        function TripleSlashReferenceAlike() {
            this.code = 'SA9056';
            this.name = 'TripleSlashReferenceAlike';
            this.filter = [230 /* SourceFile */];
        }
        TripleSlashReferenceAlike.prototype.checkNode = function (node, context) {
            var triviaWidth = node.getLeadingTriviaWidth();
            var triviaText = node.getFullText().substr(0, triviaWidth);
            if (this._couldMeanTripleSlash(triviaText)) {
                context.reportError(node, this.name, this.code, 0, triviaWidth);
            }
        };
        TripleSlashReferenceAlike.prototype._couldMeanTripleSlash = function (text) {
            if (TripleSlashReferenceAlike._TripleSlashReference.test(text)) {
                // a proper reference
                return false;
            }
            var segments = text.split(/[\s=]/);
            if (segments.length > 5) {
                // smells like something else
                return;
            }
            var reference = 0, path = 0, literal = 0;
            for (var i = 0, len = segments.length; i < len; i++) {
                reference = Math.max(reference, strings.difference('reference', segments[i]));
                path = Math.max(path, strings.difference('path', segments[i]));
                literal = Math.max(literal, (strings.startsWith(segments[i], '"') || strings.startsWith(segments[i], '\'') ? 1 : 0) +
                    (strings.endsWith(segments[i], '"') || strings.endsWith(segments[i], '\'') ? 1 : 0));
            }
            if ((literal > 0 || path > 5) && reference > 5) {
                return true;
            }
            return false;
        };
        TripleSlashReferenceAlike._TripleSlashReference = /^(\/\/\/\s*<reference\s+path=)('|")(.+?)\2\s*(static=('|")(.+?)\2\s*)*/im;
        return TripleSlashReferenceAlike;
    })();
    exports.TripleSlashReferenceAlike = TripleSlashReferenceAlike;
    /**
     * Checks for import statements that are not used.
     */
    var UnusedImports = (function () {
        function UnusedImports() {
            this.code = 'SA9057';
            this.name = 'UnusedImports';
            this.filter = [211 /* ImportEqualsDeclaration */];
        }
        UnusedImports.prototype.checkNode = function (node, context) {
            var position = ts.getTokenPosOfNode(node.name), entries = context.languageService().getOccurrencesAtPosition(context.filename(), position);
            if (entries && entries.length === 1) {
                context.reportError(node, this.name, this.code, ts.getTokenPosOfNode(node));
            }
        };
        return UnusedImports;
    })();
    exports.UnusedImports = UnusedImports;
    /**
     * Checks for variables that are not being used nor exported.
     */
    var UnusedVariables = (function () {
        function UnusedVariables() {
            this.code = 'SA9058';
            this.name = 'UnusedVariables';
            this.filter = [183 /* VariableStatement */];
        }
        UnusedVariables.prototype.checkNode = function (node, context) {
            var _this = this;
            if (node.flags & 1 /* Export */) {
                // exported variable
                return;
            }
            if (node.parent.kind === 230 /* SourceFile */) {
                // global variable
                return;
            }
            var parent = node.parent, body, bodyText;
            while (parent && !body) {
                switch (parent.kind) {
                    case 137 /* Constructor */:
                    case 136 /* MethodDeclaration */:
                    case 203 /* FunctionDeclaration */:
                    case 165 /* FunctionExpression */:
                    case 138 /* GetAccessor */:
                    case 139 /* SetAccessor */:
                        body = parent.body;
                        break;
                }
                parent = parent.parent;
            }
            var isUsed;
            if (body) {
                // strategy 1: string.indexOf
                var bodyText = body.getFullText(), offset = body.getFullStart();
                isUsed = function (name) {
                    var c = 0, idx = 0;
                    while (c < 2) {
                        idx = bodyText.indexOf(name.getText(), idx);
                        if (idx === -1) {
                            break;
                        }
                        idx += name.getText().length;
                        var items = context.languageService().getDefinitionAtPosition(context.filename(), offset + idx);
                        if (items && items.length > 0 && items[0].textSpan.start <= name.getStart()
                            && name.getStart() <= items[0].textSpan.start + items[0].textSpan.length) {
                            c += 1;
                        }
                    }
                    return c > 1;
                };
            }
            else {
                // strategy 2: languageService#findOccurrences
                isUsed = function (name) {
                    var position = ts.getTokenPosOfNode(name), entries;
                    entries = context.languageService().getOccurrencesAtPosition(context.filename(), position);
                    return entries && entries.length > 1;
                };
            }
            node.declarationList.declarations.forEach(function (declaration) {
                if (!declaration.name) {
                    return;
                }
                if (declaration.name.kind === 65 /* Identifier */) {
                    if (!isUsed(declaration.name)) {
                        context.reportError(declaration.name, _this.name, _this.code);
                    }
                }
                else {
                    var patterns = [declaration.name];
                    while (patterns.length) {
                        var pattern = patterns.pop();
                        for (var _i = 0, _a = pattern.elements; _i < _a.length; _i++) {
                            var element = _a[_i];
                            if (element.name.kind === 65 /* Identifier */) {
                                if (!isUsed(element.name)) {
                                    context.reportError(element.name, _this.name, _this.code);
                                }
                            }
                            else {
                                patterns.push(element.name);
                            }
                        }
                    }
                }
            });
        };
        return UnusedVariables;
    })();
    exports.UnusedVariables = UnusedVariables;
    /**
     * Checks for local functions that aren't used
     */
    var UnusedFunctions = (function () {
        function UnusedFunctions() {
            this.code = 'SA9059';
            this.name = 'UnusedFunctions';
            this.filter = [203 /* FunctionDeclaration */];
        }
        UnusedFunctions.prototype.checkNode = function (node, context) {
            if ((node.flags & 1 /* Export */) || (node.flags & 2048 /* DeclarationFile */)) {
                return;
            }
            var position = ts.getTokenPosOfNode(node.name), entries = context.languageService().getOccurrencesAtPosition(context.filename(), position);
            if (entries && entries.length <= 1) {
                context.reportError(node.name, this.name, this.code, position);
            }
        };
        return UnusedFunctions;
    })();
    exports.UnusedFunctions = UnusedFunctions;
    /**
     * Checks for private members that are not accessed.
     */
    var UnusedMembers = (function () {
        function UnusedMembers() {
            this.code = 'SA9060';
            this.name = 'UnusedMembers';
            this.filter = [134 /* PropertyDeclaration */, 136 /* MethodDeclaration */];
        }
        UnusedMembers.prototype.checkNode = function (node, context) {
            if (!(node.flags & 32 /* Private */)) {
                return;
            }
            if (!node.name) {
                return;
            }
            var position = ts.getTokenPosOfNode(node.name), entries = context.languageService().getOccurrencesAtPosition(context.filename(), position);
            if (entries && entries.length <= 1) {
                context.reportError(node.name, this.name, this.code, position);
            }
        };
        return UnusedMembers;
    })();
    exports.UnusedMembers = UnusedMembers;
});
///**
// * Checks if a variable is being used before its declared.
// */
//export class UsedBeforeDeclared implements rules.IStyleRule2<typescriptServices.VariableDeclaratorSyntax> {
//
//	public code = 'SA9061';
//
//	public name = 'UsedBeforeDeclared';
//
//	public filter = [typescriptServices.SyntaxKind.VariableDeclarator];
//
//    public checkNode(token:typescriptServices.VariableDeclaratorSyntax, context:rules.IRuleContext2): void {
//
//		var start = context.start(token.identifier),
//			position = context.end(token.identifier) - 1,
//			entries = context.languageService().getOccurrencesAtPosition(context.filename(), position);
//
//		for(var i = 0, len = entries.length; i < len; i++) {
//			if(entries[i].minChar < start) {
//				context.reportError(token.identifier, this.name, this.code);
//				break;
//			}
//		}
//	}
//} 
//# sourceMappingURL=typescript.js.map