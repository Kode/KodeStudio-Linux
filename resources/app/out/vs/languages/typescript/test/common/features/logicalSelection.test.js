/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'assert', 'vs/base/common/uri', 'vs/languages/typescript/common/features/logicalSelection', 'vs/languages/typescript/common/lib/typescriptServices', 'vs/languages/typescript/test/common/features/utils'], function (require, exports, assert, uri_1, logicalSelection, ts, utils) {
    suite('TS - logical selection', function () {
        function assertSelection(code, line, position, callback) {
            var host = new utils.LanguageServiceHost().add('a', code), languageService = ts.createLanguageService(host, ts.createDocumentRegistry());
            var elements = logicalSelection.compute(languageService, uri_1.default.parse('a'), { lineNumber: line, column: position });
            try {
                callback(elements);
            }
            catch (e) {
                assert.ok(false, e);
            }
        }
        test('statement', function () {
            assertSelection('var farboo = 123', 1, 8, function (entry) {
                assert.equal(entry.length, 3);
                assert.equal(entry[0].range.startColumn, 1);
                assert.equal(entry[0].range.endColumn, 17);
                assert.equal(entry[1].range.startColumn, 5);
                assert.equal(entry[1].range.endColumn, 17);
                assert.equal(entry[2].range.startColumn, 5);
                assert.equal(entry[2].range.endColumn, 11);
            });
        });
    });
});
//# sourceMappingURL=logicalSelection.test.js.map