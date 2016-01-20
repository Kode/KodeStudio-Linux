/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/languages/typescript/common/lib/typescriptServices'], function (require, exports, ts) {
    /**
     * Do not skip curly brackets.
     */
    var CurlyBracketsMustNotBeOmitted = (function () {
        function CurlyBracketsMustNotBeOmitted() {
            this.code = 'SA1503';
            this.name = 'CurlyBracketsMustNotBeOmitted';
            this.filter = [
                186 /* IfStatement */,
                76 /* ElseKeyword */,
                187 /* DoStatement */,
                190 /* ForInStatement */,
                189 /* ForStatement */,
                188 /* WhileStatement */
            ];
        }
        CurlyBracketsMustNotBeOmitted.prototype.checkNode = function (node, context) {
            if (node.kind === 186 /* IfStatement */) {
                var ifNode = node;
                if (ifNode.elseStatement && ifNode.elseStatement.kind === 186 /* IfStatement */) {
                    return;
                }
                if (ifNode.thenStatement && ifNode.thenStatement.kind !== 182 /* Block */) {
                    context.reportError(ifNode.thenStatement, this.name, this.code);
                }
                if (ifNode.elseStatement && ifNode.elseStatement.kind !== 182 /* Block */) {
                    context.reportError(ifNode.elseStatement, this.name, this.code);
                }
            }
            else {
                var iterationNode = node;
                if (iterationNode.statement && iterationNode.statement.kind !== 182 /* Block */) {
                    context.reportError(iterationNode.statement, this.name, this.code);
                }
            }
        };
        return CurlyBracketsMustNotBeOmitted;
    })();
    exports.CurlyBracketsMustNotBeOmitted = CurlyBracketsMustNotBeOmitted;
    /**
     * An empty block should have a comment.
     */
    var EmptyBlocksWithoutComment = (function () {
        function EmptyBlocksWithoutComment() {
            this.code = 'SA1514';
            this.name = 'EmptyBlocksWithoutComment';
            this.filter = [182 /* Block */];
        }
        EmptyBlocksWithoutComment.prototype.checkNode = function (node, context) {
            if (node.statements.pos < node.statements.end) {
                return;
            }
            if (ts.getTextOfNode(node).match(/\/\/|\/|\*/)) {
                return;
            }
            //		if(this._hasComment(node)) {
            //			return;
            //		}
            context.reportError(node, this.name, this.code);
        };
        EmptyBlocksWithoutComment.prototype._hasComment = function (block) {
            var insideBlock = block.getChildAt(1);
            if (insideBlock) {
                var text = ts.getTextOfNode(insideBlock);
                if (text && text.trim().length > 0) {
                    return true;
                }
            }
            return false;
        };
        return EmptyBlocksWithoutComment;
    })();
    exports.EmptyBlocksWithoutComment = EmptyBlocksWithoutComment;
});
//# sourceMappingURL=layout.js.map