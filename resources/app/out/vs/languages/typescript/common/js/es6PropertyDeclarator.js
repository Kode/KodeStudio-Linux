/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/languages/typescript/common/lib/typescriptServices'], function (require, exports, ts) {
    var ES6PropertyDeclarator = (function () {
        function ES6PropertyDeclarator() {
        }
        Object.defineProperty(ES6PropertyDeclarator.prototype, "name", {
            get: function () {
                return 'rewriter.es6.propertyDeclarator';
            },
            enumerable: true,
            configurable: true
        });
        ES6PropertyDeclarator.prototype.computeEdits = function (context) {
            var offset = 0, sourceText = context.sourceFile.getFullText(), pattern = /\bclass\b/g;
            while (pattern.test(sourceText)) {
                var node = ts.getTokenAtPosition(context.sourceFile, pattern.lastIndex - 1);
                if (node.parent
                    && (node.parent.kind === 204 /* ClassDeclaration */ || node.parent.kind === 177 /* ClassExpression */)) {
                    this._checkForThisAssignments(node.parent, context);
                }
            }
        };
        ES6PropertyDeclarator.prototype._checkForThisAssignments = function (decl, context) {
            var pattern = /this/g, classSourceText = decl.getText(), names, skipNames;
            while (pattern.test(classSourceText)) {
                var offset = decl.getStart() + pattern.lastIndex - 1;
                var token = ts.getTokenAtPosition(decl.getSourceFile(), offset);
                if (token.parent.kind === 158 /* PropertyAccessExpression */
                    && token.parent.parent.kind === 172 /* BinaryExpression */) {
                    if (!skipNames) {
                        // index get/set accessor to avoid duplicate members
                        // https://monacotools.visualstudio.com/DefaultCollection/Monaco/_workitems/edit/18402
                        skipNames = Object.create(null);
                        for (var _i = 0, _a = decl.members; _i < _a.length; _i++) {
                            var member = _a[_i];
                            if (member.kind === 139 /* SetAccessor */ ||
                                member.kind === 138 /* GetAccessor */) {
                                skipNames[member.name.getText()] = true;
                            }
                        }
                    }
                    // TODO@Joh - filter this-use inside functions
                    var name = token.parent.name;
                    if (!skipNames[name.text]) {
                        if (!names) {
                            names = Object.create(null);
                        }
                        names[name.text] = true;
                    }
                }
            }
            if (names) {
                var text = [];
                for (var k in names) {
                    text.push('\n;');
                    text.push(k);
                }
                context.newInsert(decl.members.end, text.join(''));
            }
        };
        return ES6PropertyDeclarator;
    })();
    return ES6PropertyDeclarator;
});
//# sourceMappingURL=es6PropertyDeclarator.js.map