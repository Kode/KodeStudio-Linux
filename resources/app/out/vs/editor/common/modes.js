/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports"], function (require, exports) {
    (function (Bracket) {
        Bracket[Bracket["None"] = 0] = "None";
        Bracket[Bracket["Open"] = 1] = "Open";
        Bracket[Bracket["Close"] = -1] = "Close";
    })(exports.Bracket || (exports.Bracket = {}));
    var Bracket = exports.Bracket;
    (function (IndentAction) {
        IndentAction[IndentAction["None"] = 0] = "None";
        IndentAction[IndentAction["Indent"] = 1] = "Indent";
        IndentAction[IndentAction["IndentOutdent"] = 2] = "IndentOutdent";
        IndentAction[IndentAction["Outdent"] = 3] = "Outdent";
    })(exports.IndentAction || (exports.IndentAction = {}));
    var IndentAction = exports.IndentAction;
});
//# sourceMappingURL=modes.js.map