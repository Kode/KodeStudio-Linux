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
define(["require", "exports", 'vs/editor/common/modes', 'vs/editor/common/core/range', 'vs/editor/common/core/position'], function (require, exports, Modes, range_1, position_1) {
    var Node = (function () {
        function Node() {
        }
        Object.defineProperty(Node.prototype, "range", {
            get: function () {
                return {
                    startLineNumber: this.start.lineNumber,
                    startColumn: this.start.column,
                    endLineNumber: this.end.lineNumber,
                    endColumn: this.end.column
                };
            },
            enumerable: true,
            configurable: true
        });
        return Node;
    })();
    exports.Node = Node;
    var NodeList = (function (_super) {
        __extends(NodeList, _super);
        function NodeList() {
            _super.apply(this, arguments);
        }
        Object.defineProperty(NodeList.prototype, "start", {
            get: function () {
                return this.hasChildren
                    ? this.children[0].start
                    : this.parent.start;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NodeList.prototype, "end", {
            get: function () {
                return this.hasChildren
                    ? this.children[this.children.length - 1].end
                    : this.parent.end;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NodeList.prototype, "hasChildren", {
            get: function () {
                return this.children && this.children.length > 0;
            },
            enumerable: true,
            configurable: true
        });
        NodeList.prototype.append = function (node) {
            if (!node) {
                return false;
            }
            node.parent = this;
            if (!this.children) {
                this.children = [];
            }
            if (node instanceof NodeList) {
                if (node.children) {
                    this.children.push.apply(this.children, node.children);
                }
            }
            else {
                this.children.push(node);
            }
            return true;
        };
        return NodeList;
    })(Node);
    exports.NodeList = NodeList;
    var Block = (function (_super) {
        __extends(Block, _super);
        function Block() {
            _super.call(this);
            this.elements = new NodeList();
            this.elements.parent = this;
        }
        Object.defineProperty(Block.prototype, "start", {
            get: function () {
                return this.open.start;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Block.prototype, "end", {
            get: function () {
                return this.close.end;
            },
            enumerable: true,
            configurable: true
        });
        return Block;
    })(Node);
    exports.Block = Block;
    function newNode(token) {
        var node = new Node();
        node.start = position_1.Position.startPosition(token.range);
        node.end = position_1.Position.endPosition(token.range);
        return node;
    }
    var TokenScanner = (function () {
        function TokenScanner(model) {
            this._model = model;
            this._versionId = model.getVersionId();
            this._currentLineNumber = 1;
        }
        TokenScanner.prototype.next = function () {
            if (this._versionId !== this._model.getVersionId()) {
                // model has been modified
                return null;
            }
            if (this._currentLineNumber >= this._model.getLineCount() + 1) {
                // all line visisted
                return null;
            }
            if (!this._currentLineTokens) {
                // no tokens for this line
                this._currentLineTokens = this._model.getLineTokens(this._currentLineNumber);
                this._currentTokenIndex = 0;
            }
            if (this._currentTokenIndex >= this._currentLineTokens.getTokenCount()) {
                // last token of line visited
                this._currentLineNumber += 1;
                this._currentLineTokens = null;
                return this.next();
            }
            var token = {
                type: this._currentLineTokens.getTokenType(this._currentTokenIndex),
                bracket: this._currentLineTokens.getTokenBracket(this._currentTokenIndex),
                range: {
                    startLineNumber: this._currentLineNumber,
                    startColumn: 1 + this._currentLineTokens.getTokenStartIndex(this._currentTokenIndex),
                    endLineNumber: this._currentLineNumber,
                    endColumn: 1 + this._currentLineTokens.getTokenEndIndex(this._currentTokenIndex, this._model.getLineMaxColumn(this._currentLineNumber))
                }
            };
            //		token.__debugContent = this._model.getValueInRange(token.range);
            this._currentTokenIndex += 1;
            return token;
        };
        return TokenScanner;
    })();
    var TokenTreeBuilder = (function () {
        function TokenTreeBuilder(model) {
            this._stack = [];
            this._scanner = new TokenScanner(model);
        }
        TokenTreeBuilder.prototype.build = function () {
            var node = new NodeList();
            while (node.append(this._line() || this._any())) {
            }
            return node;
        };
        TokenTreeBuilder.prototype._accept = function (condt) {
            var token = this._stack.pop() || this._scanner.next();
            if (!token) {
                return false;
            }
            var accepted = condt(token);
            if (!accepted) {
                this._stack.push(token);
                this._currentToken = null;
            }
            else {
                this._currentToken = token;
            }
            return accepted;
        };
        TokenTreeBuilder.prototype._peek = function (condt) {
            var ret = false;
            this._accept(function (info) {
                ret = condt(info);
                return false;
            });
            return ret;
        };
        TokenTreeBuilder.prototype._line = function () {
            var node = new NodeList(), lineNumber;
            // capture current linenumber
            this._peek(function (info) {
                lineNumber = info.range.startLineNumber;
                return false;
            });
            while (this._peek(function (info) { return info.range.startLineNumber === lineNumber; })
                && node.append(this._token() || this._block())) {
            }
            if (!node.children || node.children.length === 0) {
                return null;
            }
            else if (node.children.length === 1) {
                return node.children[0];
            }
            else {
                return node;
            }
        };
        TokenTreeBuilder.prototype._token = function () {
            if (!this._accept(function (token) { return token.bracket === Modes.Bracket.None; })) {
                return null;
            }
            return newNode(this._currentToken);
        };
        TokenTreeBuilder.prototype._block = function () {
            var bracketType, accepted;
            accepted = this._accept(function (token) {
                bracketType = token.type;
                return token.bracket === Modes.Bracket.Open;
            });
            if (!accepted) {
                return null;
            }
            var bracket = new Block();
            bracket.open = newNode(this._currentToken);
            while (bracket.elements.append(this._line())) {
            }
            if (!this._accept(function (token) { return token.bracket === Modes.Bracket.Close && token.type === bracketType; })) {
                // missing closing bracket -> return just a node list
                var nodelist = new NodeList();
                nodelist.append(bracket.open);
                nodelist.append(bracket.elements);
                return nodelist;
            }
            bracket.close = newNode(this._currentToken);
            return bracket;
        };
        TokenTreeBuilder.prototype._any = function () {
            if (!this._accept(function (_) { return true; })) {
                return null;
            }
            return newNode(this._currentToken);
        };
        return TokenTreeBuilder;
    })();
    /**
     * Parses this grammar:
     *	grammer = { line }
     *	line = { block | "token" }
     *	block = "open_bracket" { line } "close_bracket"
     */
    function build(model) {
        var node = new TokenTreeBuilder(model).build();
        return node;
    }
    exports.build = build;
    function find(node, position) {
        if (!range_1.Range.containsPosition(node.range, position)) {
            return null;
        }
        var result;
        if (node instanceof NodeList) {
            for (var i = 0, len = node.children.length; i < len && !result; i++) {
                result = find(node.children[i], position);
            }
        }
        else if (node instanceof Block) {
            result = find(node.open, position) || find(node.elements, position) || find(node.close, position);
        }
        return result || node;
    }
    exports.find = find;
});
//# sourceMappingURL=tokenTree.js.map