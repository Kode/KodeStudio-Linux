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
define(["require", "exports", 'vs/editor/common/modes/abstractModeWorker'], function (require, exports, abstractModeWorker_1) {
    /// <summary>
    /// This is a special worker that does nothing
    /// </summary>
    var NullWorker = (function (_super) {
        __extends(NullWorker, _super);
        function NullWorker() {
            _super.apply(this, arguments);
        }
        return NullWorker;
    })(abstractModeWorker_1.AbstractModeWorker);
    exports.NullWorker = NullWorker;
});
//# sourceMappingURL=nullWorker.js.map