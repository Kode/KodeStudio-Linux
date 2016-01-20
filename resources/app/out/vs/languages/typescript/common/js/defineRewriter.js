/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/languages/typescript/common/js/rewriting', 'vs/languages/typescript/common/lib/typescriptServices'], function (require, exports, rewriter, ts) {
    var DefineRewriter = (function () {
        function DefineRewriter() {
        }
        Object.defineProperty(DefineRewriter.prototype, "name", {
            get: function () {
                return 'rewriter.modules.define';
            },
            enumerable: true,
            configurable: true
        });
        DefineRewriter.prototype.computeEdits = function (context) {
            var sourceText = context.sourceFile.getFullText();
            DefineRewriter._pattern.lastIndex = 0;
            while (DefineRewriter._pattern.test(sourceText)) {
                var offset = DefineRewriter._pattern.lastIndex - 1, node = ts.getTokenAtPosition(context.sourceFile, offset);
                if (node && node.kind === 65 /* Identifier */ && node.parent
                    && node.parent.kind === 160 /* CallExpression */) {
                    DefineRewriter._checkArguments(node.parent, context);
                }
            }
        };
        DefineRewriter._checkArguments = function (call, context) {
            var dependencies, parameters;
            var idx = call.arguments[0] && call.arguments[0].kind === 8 /* StringLiteral */
                ? 1 : 0;
            // define(id?, [dep], function(){ ... });
            //              ^^^
            if (call.arguments[idx] && call.arguments[idx].kind === 156 /* ArrayLiteralExpression */) {
                call.arguments[idx].elements.forEach(function (element) {
                    if (element.kind === 8 /* StringLiteral */) {
                        if (!dependencies) {
                            dependencies = [element];
                        }
                        else {
                            dependencies.push(element);
                        }
                    }
                });
            }
            // define(id?, [dep], function(dep1, dep2){ ... });
            //                             ^^^^^^^^^^
            idx += 1;
            if (dependencies && call.arguments[idx] && call.arguments[idx].kind === 165 /* FunctionExpression */) {
                parameters = call.arguments[idx].parameters;
            }
            if (!dependencies || !parameters || !parameters.length) {
                return;
            }
            for (var i = 0; i < parameters.length; i++) {
                var parameter = parameters[i];
                if (DefineRewriter._specialModules[parameter.name.getText()]) {
                    // ignore magic dependencies: require, exports, and module
                    continue;
                }
                var dependency = dependencies[i];
                if (!dependency) {
                    // no more dependencies to fill in
                    break;
                }
                var variableName = rewriter.encodeVariableName(parameter);
                context.newDerive(dependency, DefineRewriter._importPattern, variableName, dependency.getText());
                context.newInsert(parameter.name.getEnd(), DefineRewriter._typeOfPattern, variableName);
            }
        };
        DefineRewriter._pattern = /\bdefine\b/g;
        DefineRewriter._specialModules = { 'require': true, 'exports': true, 'module': true };
        DefineRewriter._importPattern = 'import * as {0} from {1};\n';
        DefineRewriter._typeOfPattern = ': typeof {0}';
        return DefineRewriter;
    })();
    return DefineRewriter;
});
//# sourceMappingURL=defineRewriter.js.map