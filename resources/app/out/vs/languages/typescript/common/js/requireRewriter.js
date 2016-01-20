/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/languages/typescript/common/js/rewriting', 'vs/languages/typescript/common/lib/typescriptServices'], function (require, exports, rewriter, ts) {
    var RequireRewriter = (function () {
        function RequireRewriter() {
        }
        Object.defineProperty(RequireRewriter.prototype, "name", {
            get: function () {
                return 'rewriter.modules.require';
            },
            enumerable: true,
            configurable: true
        });
        RequireRewriter.prototype.computeEdits = function (context) {
            var sourceText = context.sourceFile.getFullText();
            RequireRewriter._pattern.lastIndex = 0;
            while (RequireRewriter._pattern.test(sourceText)) {
                var offset = RequireRewriter._pattern.lastIndex - 1, node = ts.getTokenAtPosition(context.sourceFile, offset);
                if (node && node.kind === 65 /* Identifier */ && node.parent
                    && node.parent.kind === 160 /* CallExpression */) {
                    RequireRewriter._checkCallExpression(node.parent, context);
                }
            }
        };
        RequireRewriter._checkCallExpression = function (call, context) {
            if (call.arguments.length !== 1 || call.arguments[0].kind !== 8 /* StringLiteral */) {
                return;
            }
            var stringLiteral = call.arguments[0];
            var modulePath = stringLiteral.getText().replace(/\.js("|')$/, function (m, g1) { return g1; });
            var variableName = rewriter.encodeVariableName(stringLiteral);
            context.newDerive(stringLiteral, "import * as " + variableName + " from " + modulePath + ";\n");
            if (RequireRewriter._needsLeadingSemicolon(call)) {
                context.newReplace(call.getStart(), call.getWidth(), ";(<typeof " + variableName + ">" + call.getText() + ")");
            }
            else {
                context.newReplace(call.getStart(), call.getWidth(), "(<typeof " + variableName + ">" + call.getText() + ")");
            }
        };
        RequireRewriter._needsLeadingSemicolon = function (call) {
            var prevToken = ts.getTokenAtPosition(call.getSourceFile(), call.getFullStart() - 1);
            if (!prevToken || !prevToken.parent) {
                return false;
            }
            switch (prevToken.parent.kind) {
                case 160 /* CallExpression */:
                case 183 /* VariableStatement */:
                case 185 /* ExpressionStatement */:
                case 194 /* ReturnStatement */:
                case 134 /* PropertyDeclaration */:
                case 133 /* PropertySignature */:
                    var semicolon = ts.findChildOfKind(prevToken.parent, 22 /* SemicolonToken */);
                    return !semicolon;
            }
            return false;
        };
        RequireRewriter._pattern = /\brequire\b/g;
        return RequireRewriter;
    })();
    return RequireRewriter;
});
//# sourceMappingURL=requireRewriter.js.map