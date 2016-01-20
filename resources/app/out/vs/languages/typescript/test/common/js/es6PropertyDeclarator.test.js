/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'assert', 'vs/languages/typescript/common/js/textEdits', 'vs/languages/typescript/common/js/rewriting', 'vs/languages/typescript/common/js/es6PropertyDeclarator', 'vs/languages/typescript/common/lib/typescriptServices'], function (require, exports, assert, textEdits, rewriter, ES6PropertyDeclarator, ts) {
    function _assertEdits(a, value) {
        var edits = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            edits[_i - 2] = arguments[_i];
        }
        var sourceFile = ts.createSourceFile('a', value, 1 /* ES5 */, true);
        var ctx = new rewriter.AnalyzerContext(function () { return sourceFile; });
        a.computeEdits(ctx);
        assert.equal(edits.length, ctx.edits.length);
        for (var i = 0, len = Math.min(edits.length, ctx.edits.length); i < len; i++) {
            assert.ok(edits[i].equals(ctx.edits[i]), edits[i] + ' <> ' + ctx.edits[i]);
        }
    }
    suite('JS* - es6 property declarator', function () {
        test('ES6PropertyDeclarator - simple', function () {
            _assertEdits(new ES6PropertyDeclarator(), [
                'class View {',
                'constructor() {',
                'this.far = 234;',
                '}',
                '}',
            ].join('\n'), new textEdits.Edit(46, 0, '\n;far'));
        });
        test('ES6PropertyDeclarator - repeated names', function () {
            _assertEdits(new ES6PropertyDeclarator(), [
                'class View {',
                'constructor() {',
                'this.far = 234;',
                'this.far = 567;',
                '}',
                '}',
            ].join('\n'), new textEdits.Edit(62, 0, '\n;far'));
        });
    });
});
//# sourceMappingURL=es6PropertyDeclarator.test.js.map