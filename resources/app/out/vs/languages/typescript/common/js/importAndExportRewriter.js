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
define(["require", "exports", 'vs/base/common/strings', 'vs/base/common/paths', 'vs/languages/typescript/common/js/rewriting', 'vs/languages/typescript/common/lib/typescriptServices', 'vs/base/common/collections'], function (require, exports, strings, paths, rewriter, ts, collections) {
    var Node = (function () {
        function Node(offset, length) {
            this.offset = offset;
            this.length = length;
            // empty
        }
        return Node;
    })();
    exports.Node = Node;
    var List = (function (_super) {
        __extends(List, _super);
        function List() {
            _super.apply(this, arguments);
            this.items = [];
        }
        return List;
    })(Node);
    exports.List = List;
    var DefineNode = (function (_super) {
        __extends(DefineNode, _super);
        function DefineNode(offset, length, scope) {
            _super.call(this, offset, length);
            this.scope = scope;
            this.requireStatements = [];
            this.exportsDotExpressions = [];
        }
        return DefineNode;
    })(Node);
    exports.DefineNode = DefineNode;
    var CallbackParameter = (function (_super) {
        __extends(CallbackParameter, _super);
        function CallbackParameter(offset, length, name) {
            _super.call(this, offset, length);
            this.name = name;
        }
        return CallbackParameter;
    })(Node);
    exports.CallbackParameter = CallbackParameter;
    var DependencyNode = (function (_super) {
        __extends(DependencyNode, _super);
        function DependencyNode(offset, length, _path) {
            _super.call(this, offset, length);
            this._path = _path;
            // normalize paths that end with an extension
            // 'farboo.js' becomes 'farboo'
            var match = /('|")(.+)\1/.exec(this._path), extname;
            if (match && (extname = paths.extname(match[2]))) {
                this._path = "" + match[1] + match[2].substring(0, match[2].length - extname.length) + match[1];
            }
        }
        Object.defineProperty(DependencyNode.prototype, "path", {
            get: function () {
                return this._path;
            },
            enumerable: true,
            configurable: true
        });
        return DependencyNode;
    })(Node);
    exports.DependencyNode = DependencyNode;
    var RequireStatement = (function (_super) {
        __extends(RequireStatement, _super);
        function RequireStatement(offset, length, name, path) {
            _super.call(this, offset, length, path);
            this.name = name;
        }
        return RequireStatement;
    })(DependencyNode);
    exports.RequireStatement = RequireStatement;
    var ExportsExpression = (function (_super) {
        __extends(ExportsExpression, _super);
        function ExportsExpression(offset, length, name, node) {
            _super.call(this, offset, length);
            this.name = name;
            this.node = node;
        }
        return ExportsExpression;
    })(Node);
    exports.ExportsExpression = ExportsExpression;
    var GlobalExportsExpression = (function (_super) {
        __extends(GlobalExportsExpression, _super);
        function GlobalExportsExpression(offset, length) {
            _super.call(this, offset, length);
        }
        return GlobalExportsExpression;
    })(Node);
    exports.GlobalExportsExpression = GlobalExportsExpression;
    var NamedExportExpresson = (function (_super) {
        __extends(NamedExportExpresson, _super);
        function NamedExportExpresson(name) {
            _super.call(this, 0, 0);
            this.name = name;
        }
        return NamedExportExpresson;
    })(Node);
    exports.NamedExportExpresson = NamedExportExpresson;
    var ImportsAndExportsCollector = (function () {
        function ImportsAndExportsCollector() {
        }
        Object.defineProperty(ImportsAndExportsCollector.prototype, "name", {
            get: function () {
                return 'rewriter.importsAndExports';
            },
            enumerable: true,
            configurable: true
        });
        ImportsAndExportsCollector.prototype.computeEdits = function (context) {
            // pseudo declare exports, module, and require so that
            // we don't show error for module'ish statements that
            // we cannot translate (for instance exports.far.boo = 'farboo')
            context.newInsert('declare var exports:any; declare var module:any; declare var require:any;\n');
            // init state
            this._context = context;
            this._currentScopeId = 0;
            this._currentNode = null;
            this._bucket = [];
            this._variableNames = new VariableNames();
            // walk the syntax tree
            this._visitNode(this._context.sourceFile);
            // compute edits
            var hasSeenDefine = false;
            var exports = [];
            for (var i = 0, len = this._bucket.length; i < len; i++) {
                var node = this._bucket[i];
                if (node instanceof DefineNode && !hasSeenDefine && node.scope === 0) {
                    this._translateDefineNode(node);
                    hasSeenDefine = true;
                }
                else if (node instanceof GlobalExportsExpression) {
                    this._translateGlobalExportsExpression(node);
                }
                else if (node instanceof ExportsExpression) {
                    // this._translateExportsExpression(<ExportsExpression> node, exports);
                    var lhs = rewriter.encodeVariableName(node.node);
                    this._context.newReplace(node.node.getStart(), node.node.getWidth(), "var " + lhs);
                    exports.push(lhs + " as " + node.name);
                }
                else if (node instanceof NamedExportExpresson) {
                    // this._translateNamedExportExpresson(<NamedExportExpresson> node);
                    exports.push(node.name);
                }
                else if (node instanceof RequireStatement) {
                    this._translateRequireStatement(node);
                }
            }
            if (exports.length) {
                this._context.newAppend("\nexport {" + exports.join(', ') + "}");
            }
        };
        Object.defineProperty(ImportsAndExportsCollector.prototype, "nodes", {
            get: function () {
                return this._bucket;
            },
            enumerable: true,
            configurable: true
        });
        // ---- until methods ---------------------------------------
        ImportsAndExportsCollector.prototype._untilParent = function (node, kind) {
            var parent = node.parent;
            while (parent && parent.kind !== kind) {
                parent = parent.parent;
            }
            return parent;
        };
        ImportsAndExportsCollector.prototype._store = function (node) {
            if (this._currentNode) {
                if (node instanceof RequireStatement) {
                    this._currentNode.requireStatements.push(node);
                }
                else if (node instanceof ExportsExpression) {
                    this._currentNode.exportsDotExpressions.push(node);
                }
            }
            else {
                this._bucket.push(node);
            }
        };
        // ---- visit implementation ---------------------------------------
        ImportsAndExportsCollector.prototype.visitBinaryExpression = function (node) {
            var exp;
            // we must cover these cases:
            // (1) exports = function f() {}
            // (2) exports.f = function f() {}
            // (3) module.exports = function f() {}
            // (4) module.exports.f = function f() {}
            if (node.operatorToken.kind === 53 /* EqualsToken */ && node.parent.kind === 185 /* ExpressionStatement */) {
                var start, end;
                if (syntax.isIdentifier(node.left, 'exports')) {
                    // (1) exports = ...
                    start = node.left.getStart();
                    end = node.left.getEnd();
                    exp = new GlobalExportsExpression(start, end - start);
                }
                else if (node.left.kind === 158 /* PropertyAccessExpression */) {
                    var propertyAccess = node.left, nameText = propertyAccess.name.text;
                    if (propertyAccess.expression.kind === 65 /* Identifier */) {
                        var expressionText = ts.getTextOfNode(propertyAccess.expression);
                        if (expressionText === 'exports') {
                            // (2) exports.f = ...
                            exp = new ExportsExpression(propertyAccess.getStart(), propertyAccess.getWidth(), nameText, node.left);
                        }
                        else if (expressionText === 'module' && nameText === 'exports') {
                            // (3) module.exports = ...
                            exp = new GlobalExportsExpression(propertyAccess.getStart(), propertyAccess.getWidth());
                        }
                    }
                    else if (propertyAccess.expression.kind === 158 /* PropertyAccessExpression */) {
                        var nestedMemberAccessExpression = propertyAccess.expression;
                        if (syntax.isIdentifier(nestedMemberAccessExpression.expression, 'module') && syntax.isIdentifier(nestedMemberAccessExpression.name, 'exports')) {
                            // (4) module.exports.f = ...
                            exp = new ExportsExpression(propertyAccess.getStart(), propertyAccess.getWidth(), nameText, node.left);
                        }
                    }
                }
                if (exp && ts.getContainingFunction(node) && !syntax.getContainingAmdDefineCall(node)) {
                    if (exp instanceof ExportsExpression) {
                        // (module.)exports.f = ...
                        // when occurring inside a function we can
                        // only hoist up the name of the variable
                        exp = new NamedExportExpresson(exp.name);
                    }
                    else if (exp instanceof GlobalExportsExpression) {
                        // (module.)exports = ...
                        // when occuring inside a function we cannot
                        // do anything and don't rewrite in this case
                        exp = undefined;
                    }
                }
            }
            if (exp) {
                this._store(exp);
            }
            else {
                this._visitNode(node);
            }
        };
        ImportsAndExportsCollector.prototype.visitCallExpression = function (node) {
            if (false && syntax.isIdentifier(node.expression, ImportsAndExportsCollector._Require)) {
                var args = node.arguments;
                if (syntax.isPath(args, 8 /* StringLiteral */)) {
                    // amd/commonjs: require via explicit call
                    var name, variableDeclaration = this._untilParent(node, 201 /* VariableDeclaration */);
                    if (variableDeclaration && variableDeclaration.name.kind === 65 /* Identifier */) {
                        name = variableDeclaration.name.text;
                    }
                    this._store(new RequireStatement(ts.getTokenPosOfNode(node), node.getWidth(), name, ts.getTextOfNode(args[0])));
                }
            }
            else if (syntax.isIdentifier(node.expression, ImportsAndExportsCollector._Define)) {
                this._currentNode = new DefineNode(ts.getTokenPosOfNode(node), node.getWidth(), this._currentScopeId);
                args = node.arguments;
                if (syntax.isPath(args, 157 /* ObjectLiteralExpression */)) {
                    // § 1.3.1: simple name/value pairs
                    this._currentNode.objectLiteral = new Node(ts.getTokenPosOfNode(args[0]), args[0].getWidth());
                }
                else if (syntax.isPath(args, 165 /* FunctionExpression */)) {
                    // § 1.3.2: definition functions
                    this._fillInParametersAndBody(args[0], this._currentNode);
                }
                else if (syntax.isPath(args, 156 /* ArrayLiteralExpression */, 165 /* FunctionExpression */)) {
                    // § 1.3.3: definition function with dependencies
                    this._fillInDependencies(args[0], this._currentNode);
                    this._fillInParametersAndBody(args[1], this._currentNode);
                }
                else if (syntax.isPath(args, 8 /* StringLiteral */, 156 /* ArrayLiteralExpression */, 165 /* FunctionExpression */)) {
                    // § 1.3.6: module with a name
                    this._currentNode.identifier = args[0].text;
                    this._fillInDependencies(args[1], this._currentNode);
                    this._fillInParametersAndBody(args[2], this._currentNode);
                }
                else {
                    this._currentNode = null;
                }
                if (this._currentNode) {
                    this._bucket.push(this._currentNode);
                    this._visitNode(node);
                    this._currentNode = null;
                    return;
                }
            }
            this._visitNode(node);
        };
        ImportsAndExportsCollector.prototype._fillInDependencies = function (arraySyntax, node) {
            node.dependencyArray = new List(ts.getTokenPosOfNode(arraySyntax), arraySyntax.getWidth());
            for (var i = 0, len = arraySyntax.elements.length; i < len; i++) {
                var expression = arraySyntax.elements[i];
                node.dependencyArray.items.push(new DependencyNode(ts.getTokenPosOfNode(expression), expression.getWidth(), ts.getTextOfNode(expression)));
            }
        };
        ImportsAndExportsCollector.prototype._fillInParametersAndBody = function (functionSyntax, node) {
            var start, end;
            // parameter: list
            start = functionSyntax.parameters.pos;
            end = functionSyntax.parameters.end;
            node.callbackParameters = new List(start, end - start);
            // parameter: each parameter
            var params = functionSyntax.parameters;
            for (var i = 0, len = params.length; i < len; i++) {
                var param = params[i];
                node.callbackParameters.items.push(new CallbackParameter(ts.getTokenPosOfNode(param), param.getWidth(), ts.getTextOfNode(param)));
            }
            // body: omit curly brackets
            start = functionSyntax.body.getStart() + 1;
            end = functionSyntax.body.getEnd() - 1;
            node.callbackBody = new Node(start, end - start);
        };
        ImportsAndExportsCollector.prototype._visitNode = function (node) {
            var _this = this;
            ts.forEachChild(node, function (child) {
                switch (child.kind) {
                    case 172 /* BinaryExpression */:
                        _this.visitBinaryExpression(child);
                        break;
                    case 160 /* CallExpression */:
                        _this.visitCallExpression(child);
                        break;
                    case 203 /* FunctionDeclaration */:
                    case 165 /* FunctionExpression */:
                    case 166 /* ArrowFunction */:
                        _this._currentScopeId += 1;
                        _this._visitNode(child);
                        _this._currentScopeId -= 1;
                        break;
                    default:
                        _this._visitNode(child);
                        break;
                }
            });
        };
        // ---- rewrite implementation ---------------------------------------
        ImportsAndExportsCollector.prototype._translateRequireStatement = function (node) {
            var varName = this._variableNames.next(node.name || node.path);
            this._context.newInsert(strings.format('import {0} = require({1});\n', varName, node.path));
            this._context.newReplace(node.offset, node.length, varName);
        };
        ImportsAndExportsCollector.prototype._translateGlobalExportsExpression = function (node) {
            var varName = this._variableNames.next();
            this._context.newReplace(node.offset, node.length, strings.format('var {0}', varName));
            this._context.newAppend(strings.format('\nexport = {0};', varName));
        };
        // private _translateExportsExpression(node: ExportsExpression): void {
        // 	let lhs = rewriter.encodeVariableName(node.node);
        // 	this._context.newReplace(node.node.getStart(), node.node.getWidth(), `export var ${lhs}`);
        // 	// this._context.newReplace(node.offset, node.length - node.name.length, 'export var ');
        // }
        ImportsAndExportsCollector.prototype._translateNamedExportExpresson = function (node) {
            this._context.newAppend("export var " + node.name + ":any;\n");
        };
        ImportsAndExportsCollector.prototype._translateDefineNode = function (node) {
            if (node.objectLiteral) {
                this._context.newInsert(ImportsAndExportsCollector._DeclareWithLiteral);
            }
            else {
                // dependency-array: import-require statements
                if (false && node.dependencyArray) {
                    for (var i = 0, len = node.callbackParameters.items.length; i < len; i++) {
                        var param = node.callbackParameters.items[i], dependency = node.dependencyArray.items[i];
                        if (ImportsAndExportsCollector._SpecialCallbackParams.hasOwnProperty(param.name)) {
                            continue;
                        }
                        if (dependency) {
                            var dependencyName = this._variableNames.next();
                            this._context.newInsert(strings.format('import {0} = require({1});\n', dependencyName, dependency.path));
                            this._context.newInsert(param.offset + param.length, strings.format(':typeof {0}', dependencyName));
                        }
                    }
                }
                // require-call: move into signature
                var extraCallbackParams = [];
                for (var i = 0, len = node.requireStatements.length; i < len; i++) {
                    var requireStatement = node.requireStatements[i], importName = this._variableNames.next(), placeholderName = this._variableNames.next();
                    this._context.newInsert(strings.format('import {0} = require({1});\n', importName, requireStatement.path));
                    this._context.newReplace(requireStatement.offset, requireStatement.length, placeholderName);
                    extraCallbackParams.push(strings.format('{0}:typeof {1}', placeholderName, importName));
                }
                if (extraCallbackParams.length > 0) {
                    this._context.newInsert(node.callbackParameters.offset + node.callbackParameters.length, strings.format('{0}{1}', node.callbackParameters.items.length > 0 ? ',' : '', extraCallbackParams.join(',')));
                }
                // exports.<name>: generate return type
                var returnStructure = [];
                for (var i = 0, len = node.exportsDotExpressions.length; i < len; i++) {
                    var exportsDot = node.exportsDotExpressions[i], varName = this._variableNames.next();
                    this._context.newReplace(exportsDot.offset, exportsDot.length, strings.format('var {0}', varName));
                    returnStructure.push(exportsDot.name);
                    returnStructure.push(':');
                    returnStructure.push(varName);
                    returnStructure.push(',');
                }
                if (returnStructure.length > 0) {
                    returnStructure.pop(); // remote last comma
                    this._context.newInsert(node.callbackBody.offset + node.callbackBody.length, strings.format('return {{0}};', returnStructure.join(strings.empty)));
                }
                // add a 'nice' declaration for the define function
                var idParam = node.identifier ? 'id,' : strings.empty, depParam = node.dependencyArray ? 'dep,' : strings.empty, params = node.callbackParameters.items.map(function (item) { return item.name; }).concat(node.requireStatements.map(function (item, idx) { return strings.format('_p{0}', idx); })).join(',');
                this._context.newInsert(strings.format(ImportsAndExportsCollector._DeclareTemplate, idParam, depParam, params));
            }
            // export what we declare to be returned
            var returnVariable = this._variableNames.next();
            this._context.newInsert(node.offset, strings.format('var {0} = ', returnVariable));
            this._context.newAppend(strings.format('\nexport = {0};', returnVariable));
        };
        ImportsAndExportsCollector._SpecialCallbackParams = { 'exports': true, 'module': true, 'require': true };
        ImportsAndExportsCollector._DeclareWithLiteral = 'declare function define<T>(literal:T):T;\n';
        ImportsAndExportsCollector._DeclareTemplate = 'declare function define<T>({0}{1}callback:({2})=>T):T;\n';
        ImportsAndExportsCollector._Define = 'define';
        ImportsAndExportsCollector._Require = 'require';
        return ImportsAndExportsCollector;
    })();
    exports.ImportsAndExportsCollector = ImportsAndExportsCollector;
    var VariableNames = (function () {
        function VariableNames() {
            this._counter = 0;
            this._proposalToName = {};
            this._allNames = {};
        }
        VariableNames.prototype.next = function (proposal) {
            if (!proposal) {
                return strings.format('_var_{0}', this._counter++);
            }
            var name = collections.lookup(this._proposalToName, proposal);
            if (name) {
                return name;
            }
            name = proposal.replace(/["']/g, strings.empty);
            name = paths.basename(name);
            name = name.replace(VariableNames._RegExp, strings.empty);
            if (name.length === 0) {
                return this.next();
            }
            else {
                name = name.split(strings.empty).join(VariableNames._SpecialChar);
            }
            name = name + VariableNames._SpecialChar;
            var basename = name;
            for (var i = 1; collections.contains(this._allNames, name); i++) {
                name = basename + i;
            }
            this._allNames[name] = true;
            this._proposalToName[proposal] = name;
            return name;
        };
        VariableNames.prototype.allocateIfFree = function (name) {
            if (collections.contains(this._allNames, name)) {
                return false;
            }
            this._allNames[name] = true;
            return true;
        };
        VariableNames.prototype.reset = function () {
            this._counter = 0;
            this._proposalToName = {};
            this._allNames = {};
        };
        VariableNames._RegExp = /[^A-Za-z_$]/g;
        VariableNames._SpecialChar = '\u0332';
        return VariableNames;
    })();
    var syntax;
    (function (syntax) {
        function isPath(list) {
            var kinds = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                kinds[_i - 1] = arguments[_i];
            }
            if (kinds.length !== list.length) {
                return false;
            }
            for (var i = 0, len = kinds.length; i < len; i++) {
                if (list[i].kind !== kinds[i]) {
                    return false;
                }
            }
            return true;
        }
        syntax.isPath = isPath;
        function isIdentifier(node, value) {
            return node.kind === 65 /* Identifier */ && ts.getTextOfNode(node) === value;
        }
        syntax.isIdentifier = isIdentifier;
        function getContainingAmdDefineCall(node) {
            while (true) {
                node = node.parent;
                if (!node || isAmdDefineCall(node)) {
                    return node;
                }
            }
        }
        syntax.getContainingAmdDefineCall = getContainingAmdDefineCall;
        function isAmdDefineCall(node) {
            if (node.kind !== 160 /* CallExpression */) {
                return false;
            }
            var callExpression = node;
            if (!isIdentifier(callExpression.expression, 'define')) {
                return false;
            }
            if (syntax.isPath(callExpression.arguments, 157 /* ObjectLiteralExpression */)) {
                // § 1.3.1: simple name/value pairs
                return true;
            }
            else if (syntax.isPath(callExpression.arguments, 165 /* FunctionExpression */)) {
                // § 1.3.2: definition functions
                return true;
            }
            else if (syntax.isPath(callExpression.arguments, 156 /* ArrayLiteralExpression */, 165 /* FunctionExpression */)) {
                // § 1.3.3: definition function with dependencies
                return true;
            }
            else if (syntax.isPath(callExpression.arguments, 8 /* StringLiteral */, 156 /* ArrayLiteralExpression */, 165 /* FunctionExpression */)) {
                // § 1.3.6: module with a name
                return true;
            }
            return false;
        }
        syntax.isAmdDefineCall = isAmdDefineCall;
    })(syntax || (syntax = {}));
});
//# sourceMappingURL=importAndExportRewriter.js.map