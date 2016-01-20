/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/languages/typescript/common/lib/typescriptServices'], function (require, exports, ts) {
    var AngularServiceRewriter = (function () {
        function AngularServiceRewriter() {
        }
        Object.defineProperty(AngularServiceRewriter.prototype, "name", {
            get: function () {
                return 'rewriter.angular';
            },
            enumerable: true,
            configurable: true
        });
        AngularServiceRewriter.prototype.computeEdits = function (context) {
            var offset = 0, sourceText = context.sourceFile.getFullText();
            while ((offset = sourceText.indexOf('$', offset)) !== -1) {
                var node = ts.getTokenAtPosition(context.sourceFile, offset);
                if (node) {
                    offset += node.getFullWidth();
                    if (node.kind === 65 /* Identifier */
                        && node.parent && node.parent.kind === 131 /* Parameter */) {
                        var parent = node.parent, name = parent.name.getText();
                        if (name.length > 1) {
                            var typeAnnotation = " :angular.I" + name[1].toUpperCase() + name.substr(2) + "Service";
                            context.newInsert(parent.name.end, typeAnnotation);
                        }
                    }
                }
            }
        };
        return AngularServiceRewriter;
    })();
    exports.AngularServiceRewriter = AngularServiceRewriter;
});
//# sourceMappingURL=angularServiceRewriter.js.map