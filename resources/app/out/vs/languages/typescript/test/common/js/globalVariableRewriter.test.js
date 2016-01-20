/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'assert', 'vs/languages/typescript/common/js/textEdits', 'vs/languages/typescript/common/js/rewriting', 'vs/languages/typescript/common/js/globalVariableRewriter', 'vs/languages/typescript/common/lib/typescriptServices'], function (require, exports, assert, textEdits, rewriter, globalVariableRewriter, ts) {
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
    suite('JS* - global variable collector', function () {
        test('GlobalVariableCollector - simple', function () {
            _assertEdits(new globalVariableRewriter.GlobalVariableCollector(), [
                '/*global foo*/',
                'function foo() {}'
            ].join('\n'), new textEdits.Edit(32, 0, 'declare var foo:any;\n'));
            _assertEdits(new globalVariableRewriter.GlobalVariableCollector(), [
                '/*global foo, bar*/',
                'function foo() {}'
            ].join('\n'), new textEdits.Edit(37, 0, 'declare var foo:any;\ndeclare var bar:any;\n'));
            _assertEdits(new globalVariableRewriter.GlobalVariableCollector(), [
                '/*global foo,',
                'bar*/',
                'function foo() {}'
            ].join('\n'), new textEdits.Edit(37, 0, 'declare var foo:any;\ndeclare var bar:any;\n'));
        });
        test('GlobalVariableCollector - complex', function () {
            _assertEdits(new globalVariableRewriter.GlobalVariableCollector(), [
                '/*global foo:true*/',
                'function foo() {}'
            ].join('\n'), new textEdits.Edit(37, 0, 'declare var foo:any;\n'));
            _assertEdits(new globalVariableRewriter.GlobalVariableCollector(), [
                '/*global foo: true, bar: false*/',
                'function foo() {}'
            ].join('\n'), new textEdits.Edit(50, 0, 'declare var foo:any;\ndeclare var bar:any;\n'));
        });
        test('GlobalVariableCollector - scoped', function () {
            _assertEdits(new globalVariableRewriter.GlobalVariableCollector(), [
                'function foo() {\n',
                '/*global foo:true*/',
                '}'
            ].join('\n'), new textEdits.Edit(39, 0, 'declare var foo:any;\n'));
            _assertEdits(new globalVariableRewriter.GlobalVariableCollector(), [
                'function foo() {\n',
                '\t/*global foo:true*/',
                '}'
            ].join('\n'), new textEdits.Edit(40, 0, 'declare var foo:any;\n'));
        });
    });
});
//# sourceMappingURL=globalVariableRewriter.test.js.map