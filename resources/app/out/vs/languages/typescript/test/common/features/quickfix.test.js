/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'assert', 'vs/base/common/uri', 'vs/languages/typescript/common/features/quickFix', 'vs/languages/typescript/common/features/diagnostics', 'vs/languages/typescript/common/lib/typescriptServices', 'vs/languages/typescript/test/common/features/utils', 'vs/languages/typescript/common/options'], function (require, exports, assert, uri_1, quickfix, diagnostics, ts, utils, Options) {
    suite('TS - quick fix', function () {
        function assertQuickFix(code, fileName, callback) {
            var filePath = 'file://test/' + fileName;
            var fileURL = uri_1.default.parse(filePath);
            var host = new utils.LanguageServiceHost().add(filePath, code);
            var service = ts.createLanguageService(host, ts.createDocumentRegistry());
            var markers = diagnostics.getSemanticDiagnostics(service, fileURL, Options.typeScriptOptions).markers;
            assert.equal(markers.length, 1);
            var marker = markers[0];
            var elements = quickfix.compute(service, fileURL, marker);
            callback(elements);
        }
        test('quickfix', function () {
            assertQuickFix('class C { private hello = 0; private world = this.hell0; }', 'a.ts', function (elements) {
                assert.equal(elements.length, 1);
                assert.equal(elements[0].command.title, "Rename to 'hello'");
            });
            assertQuickFix('_.foo();', 'a.ts', function (elements) {
                assert.equal(elements.length, 2);
                assert.equal(elements[0].command.title, "Download type definition underscore.d.ts");
                assert.equal(elements[1].command.title, "Download type definition lodash.d.ts");
            });
            assertQuickFix('describe("x");', 'a.js', function (elements) {
                assert.equal(elements.length, 3);
                assert.equal(elements[0].command.title, "Download type definition mocha.d.ts");
                assert.equal(elements[1].command.title, "Download type definition jasmine.d.ts");
                assert.equal(elements[2].command.title, "Mark 'describe' as global");
            });
            assertQuickFix('angular.foo = 1;', 'a.ts', function (elements) {
                assert.equal(elements.length, 1);
                assert.equal(elements[0].command.title, "Download type definition angular.d.ts");
            });
            assertQuickFix('var x = __dirname;', 'a.ts', function (elements) {
                assert.equal(elements.length, 1);
                assert.equal(elements[0].command.title, "Download type definition node.d.ts");
            });
            assertQuickFix('ko.observable(null);', 'a.ts', function (elements) {
                assert.equal(elements.length, 1);
                assert.equal(elements[0].command.title, "Download type definition knockout.d.ts");
            });
            for (var id in quickfix.typingsMap) {
                assertQuickFix(id + '.foo();', 'a.ts', function (elements) {
                    var value = quickfix.typingsMap[id];
                    var length = Array.isArray(value) ? value.length : 1;
                    assert.equal(elements.length, length);
                });
            }
            assertQuickFix('foo.observable(null);', 'a.js', function (elements) {
                assert.equal(elements.length, 1);
                assert.equal(elements[0].command.title, "Mark 'foo' as global");
            });
            assertQuickFix('toString();', 'a.js', function (elements) {
                assert.equal(elements.length, 1);
                assert.equal(elements[0].command.title, "Mark 'toString' as global");
            });
        });
    });
});
//# sourceMappingURL=quickfix.test.js.map