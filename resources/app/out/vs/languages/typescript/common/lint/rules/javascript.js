/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/base/common/strings', 'vs/base/common/collections', 'vs/languages/typescript/common/lib/typescriptServices'], function (require, exports, strings, collections, ts) {
    /**
     * Use !== and === insteaf of != and ==.
     */
    var ComparisonOperatorsNotStrict = (function () {
        function ComparisonOperatorsNotStrict() {
            this.code = 'SA9005';
            this.name = 'ComparisonOperatorsNotStrict';
            this.filter = [172 /* BinaryExpression */];
        }
        ComparisonOperatorsNotStrict.prototype.checkNode = function (node, context) {
            if (node.operatorToken.kind === 28 /* EqualsEqualsToken */ || node.operatorToken.kind === 29 /* ExclamationEqualsToken */) {
                var operatorPos = node.right.pos - 2;
                context.reportError(node, this.name, this.code, operatorPos, 2);
            }
        };
        return ComparisonOperatorsNotStrict;
    })();
    exports.ComparisonOperatorsNotStrict = ComparisonOperatorsNotStrict;
    /**
     * Checks for missing semicolons (which are those that the parser inserted).
     */
    var MissingSemicolon = (function () {
        function MissingSemicolon() {
            this.code = 'SA9050';
            this.name = 'MissingSemicolon';
            this.filter = [
                183 /* VariableStatement */,
                185 /* ExpressionStatement */,
                194 /* ReturnStatement */,
                134 /* PropertyDeclaration */,
                133 /* PropertySignature */
            ];
        }
        MissingSemicolon.prototype.checkNode = function (node, context) {
            var semicolon = ts.findChildOfKind(node, 22 /* SemicolonToken */);
            if (!semicolon) {
                var nodeEnd = ts.getTokenPosOfNode(node) + node.getWidth() - 1;
                context.reportError(node, this.name, this.code, nodeEnd, 1);
            }
        };
        return MissingSemicolon;
    })();
    exports.MissingSemicolon = MissingSemicolon;
    /**
     * Checks for proper usage of the typeof operator as defined here
     * http://ecma-international.org/ecma-262/5.1/#sec-11.4.3
     */
    var UnknownTypeOfResults = (function () {
        function UnknownTypeOfResults() {
            this.code = 'SA9053';
            this.filter = [172 /* BinaryExpression */];
            this.name = 'UnknownTypeOfResults';
        }
        UnknownTypeOfResults.prototype.checkNode = function (node, context) {
            if (!node.left || node.left.kind !== 168 /* TypeOfExpression */) {
                return;
            }
            var problem = false;
            if (node.right.kind === 8 /* StringLiteral */) {
                var textValue = ts.getTextOfNode(node.right);
                textValue = strings.trim(textValue, '\'');
                textValue = strings.trim(textValue, '"');
                problem = !collections.contains(UnknownTypeOfResults._AllowedStrings, textValue);
            }
            else if (node.right.kind === 89 /* NullKeyword */) {
                problem = true;
            }
            else if (ts.getTextOfNode(node.right) === 'undefined') {
                problem = true;
            }
            if (problem) {
                context.reportError(node, this.name, this.code);
            }
        };
        UnknownTypeOfResults._AllowedStrings = {
            'undefined': true,
            'object': true,
            'function': true,
            'boolean': true,
            'number': true,
            'string': true
        };
        return UnknownTypeOfResults;
    })();
    exports.UnknownTypeOfResults = UnknownTypeOfResults;
    /**
     * The body of if, else, do, for, and for-in should not be a semi-colon only.
     */
    var SemicolonsInsteadOfBlocks = (function () {
        function SemicolonsInsteadOfBlocks() {
            this.code = 'SA9054';
            this.name = 'SemicolonsInsteadOfBlocks';
            this.filter = [186 /* IfStatement */, 76 /* ElseKeyword */,
                188 /* WhileStatement */, 189 /* ForStatement */,
                190 /* ForInStatement */];
        }
        SemicolonsInsteadOfBlocks.prototype.checkNode = function (node, context) {
            if (node.kind === 186 /* IfStatement */) {
                var ifNode = node;
                if ((ifNode.thenStatement && ifNode.thenStatement.kind === 184 /* EmptyStatement */) ||
                    (ifNode.elseStatement && ifNode.elseStatement.kind === 184 /* EmptyStatement */)) {
                    context.reportError(ifNode, this.name, this.code);
                }
            }
            var iterationNode = node;
            if (iterationNode && iterationNode.statement && iterationNode.statement.kind === 184 /* EmptyStatement */) {
                context.reportError(iterationNode, this.name, this.code);
            }
        };
        return SemicolonsInsteadOfBlocks;
    })();
    exports.SemicolonsInsteadOfBlocks = SemicolonsInsteadOfBlocks;
    /**
     * Checks for functions inside loops.
     */
    var FunctionsInsideLoops = (function () {
        function FunctionsInsideLoops() {
            this.code = 'SA9055';
            this.name = 'FunctionsInsideLoops';
            this.filter = [165 /* FunctionExpression */,
                203 /* FunctionDeclaration */,
                166 /* ArrowFunction */];
        }
        FunctionsInsideLoops.prototype.checkNode = function (node, context) {
            var parent = node.parent;
            while (parent) {
                if (parent.kind === 189 /* ForStatement */ ||
                    parent.kind === 190 /* ForInStatement */ ||
                    parent.kind === 188 /* WhileStatement */ ||
                    parent.kind === 187 /* DoStatement */) {
                    context.reportError(node, this.name, this.code);
                    break;
                }
                parent = parent.parent;
            }
        };
        return FunctionsInsideLoops;
    })();
    exports.FunctionsInsideLoops = FunctionsInsideLoops;
    /**
     * Checks for function with lower-case names that are used
     * as constructors.
     */
    var NewOnLowercaseFunctions = (function () {
        function NewOnLowercaseFunctions() {
            this.code = 'SA9062';
            this.name = 'NewOnLowercaseFunctions';
            this.filter = [161 /* NewExpression */];
        }
        NewOnLowercaseFunctions.prototype.checkNode = function (node, context) {
            var name;
            switch (node.expression.kind) {
                case 65 /* Identifier */:
                    name = node.expression.text;
                    break;
                case 158 /* PropertyAccessExpression */:
                    name = node.expression.name.text;
                    break;
            }
            if (name && !name.charAt(0).match(/[A-Z_]/)) {
                context.reportError(node.expression, this.name, this.code);
            }
        };
        return NewOnLowercaseFunctions;
    })();
    exports.NewOnLowercaseFunctions = NewOnLowercaseFunctions;
});
//# sourceMappingURL=javascript.js.map