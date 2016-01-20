/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports"], function (require, exports) {
    function fromValue(value) {
        var len = value.length;
        if (len > 1500000) {
            // everything except newline characters will be replaced
            // with whitespace. this ensures a small syntax tree and
            // no symbol information overkill. keeping the newline
            // characters makes further processing (based on line and
            // column) easy for us
            value = value.replace(/[^\r\n]/g, ' ');
        }
        return {
            getLength: function () { return len; },
            getText: value.substring.bind(value),
            getChangeRange: function () { return null; }
        };
    }
    exports.fromValue = fromValue;
});
//# sourceMappingURL=snapshots.js.map