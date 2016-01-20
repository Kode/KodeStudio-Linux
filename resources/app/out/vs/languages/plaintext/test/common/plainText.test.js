/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/editor/test/common/modesUtil', 'vs/languages/plaintext/common/plaintext.contribution'], function (require, exports, modesUtil) {
    suite('Syntax Highlighting - Plain Text', function () {
        var tokenizationSupport;
        setup(function (done) {
            modesUtil.load('plaintext').then(function (mode) {
                tokenizationSupport = mode.tokenizationSupport;
                done();
            });
        });
        test('', function () {
            modesUtil.executeTests(tokenizationSupport, [
                // One line text file
                [{
                        line: 'a simple text file',
                        tokens: [
                            { startIndex: 0, type: '' }
                        ] }],
                // Multiple line text file
                [{
                        line: 'text file line #1',
                        tokens: [
                            { startIndex: 0, type: '' }
                        ] }, {
                        line: 'text file line #2',
                        tokens: [
                            { startIndex: 0, type: '' }
                        ] }, {
                        line: 'text file line #3',
                        tokens: [
                            { startIndex: 0, type: '' }
                        ] }, {
                        line: 'text file line #4',
                        tokens: [
                            { startIndex: 0, type: '' }
                        ] }]
            ]);
        });
    });
});
//# sourceMappingURL=plainText.test.js.map