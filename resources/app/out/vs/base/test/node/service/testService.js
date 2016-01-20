/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/base/common/winjs.base'], function (require, exports, winjs) {
    var TestService = (function () {
        function TestService() {
        }
        TestService.prototype.pong = function (ping) {
            return winjs.TPromise.as({
                incoming: ping,
                outgoing: 'pong'
            });
        };
        TestService.prototype.cancelMe = function () {
            return winjs.Promise.timeout(100).then(function () {
                return true;
            });
        };
        return TestService;
    })();
    exports.TestService = TestService;
});
//# sourceMappingURL=testService.js.map