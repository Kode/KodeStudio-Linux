/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports"], function (require, exports) {
    var ShebangRewriter = (function () {
        function ShebangRewriter() {
        }
        Object.defineProperty(ShebangRewriter.prototype, "name", {
            get: function () {
                return 'rewriter.shebang';
            },
            enumerable: true,
            configurable: true
        });
        ShebangRewriter.prototype.computeEdits = function (context) {
            var text = context.sourceFile.getFullText();
            if (text.charCodeAt(0) !== ShebangRewriter._hash || text.charCodeAt(1) !== ShebangRewriter._bang) {
                return;
            }
            var end = ~text.indexOf('\n') || ~text.indexOf('\r');
            end = !end ? text.length : ~end;
            context.newDelete(0, end);
        };
        ShebangRewriter._hash = '#'.charCodeAt(0);
        ShebangRewriter._bang = '!'.charCodeAt(0);
        return ShebangRewriter;
    })();
    return ShebangRewriter;
});
//# sourceMappingURL=shebangRewriter.js.map