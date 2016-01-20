/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/base/common/strings'], function (require, exports, strings) {
    var GlobalVariableCollector = (function () {
        function GlobalVariableCollector() {
            this._pattern = /(\/\* ?globals? )([\s\S]+?)\*\//gm;
        }
        Object.defineProperty(GlobalVariableCollector.prototype, "name", {
            get: function () {
                return 'rewriter.globalVariables';
            },
            enumerable: true,
            configurable: true
        });
        GlobalVariableCollector.prototype.computeEdits = function (context) {
            this._pattern.lastIndex = 0;
            var text = context.sourceFile.getFullText(), match, declares = [];
            while ((match = this._pattern.exec(text))) {
                match[2].split(',').forEach(function (part) {
                    part = part.trim();
                    var colonIdx = part.indexOf(':');
                    part = part.substring(0, ~colonIdx ? colonIdx : undefined);
                    declares.push(strings.format('declare var {0}:any;\n', part));
                });
                context.newAppend(declares.join(strings.empty));
            }
        };
        return GlobalVariableCollector;
    })();
    exports.GlobalVariableCollector = GlobalVariableCollector;
});
//# sourceMappingURL=globalVariableRewriter.js.map