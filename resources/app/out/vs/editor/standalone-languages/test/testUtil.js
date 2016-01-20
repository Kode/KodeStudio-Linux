/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/editor/test/common/modesUtil', 'vs/editor/common/modes/monarch/monarchCompile', 'vs/editor/common/modes/monarch/monarchDefinition', 'vs/editor/common/modes/supports/onEnter'], function (require, exports, modesUtil, monarchCompile, MonarchDefinition, onEnter_1) {
    (function (Bracket) {
        Bracket[Bracket["None"] = 0] = "None";
        Bracket[Bracket["Open"] = 1] = "Open";
        Bracket[Bracket["Close"] = -1] = "Close";
    })(exports.Bracket || (exports.Bracket = {}));
    var Bracket = exports.Bracket;
    function testTokenization(name, language, tests) {
        suite(language.displayName || name, function () {
            test('Tokenization', function () {
                modesUtil.executeMonarchTokenizationTests(name, language, tests);
            });
        });
    }
    exports.testTokenization = testTokenization;
    function testOnEnter(name, language, callback) {
        suite(language.displayName || name, function () {
            test('onEnter', function () {
                var lexer = monarchCompile.compile(language);
                var onEnterSupport = new onEnter_1.OnEnterSupport('test', MonarchDefinition.createOnEnterSupportOptions(lexer));
                callback(modesUtil.createOnEnterAsserter('test', onEnterSupport));
            });
        });
    }
    exports.testOnEnter = testOnEnter;
});
//# sourceMappingURL=testUtil.js.map