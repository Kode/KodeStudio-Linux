/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'assert', 'vs/languages/typescript/common/js/rewriting', 'vs/languages/typescript/common/lib/typescriptServices', 'vs/languages/typescript/common/js/importAndExportRewriter'], function (require, exports, assert, rewriter, ts, importAndExportRewriter) {
    suite('JS* - importAndExportRewriter', function () {
        function assertNode(node, offset, length) {
            assert.equal(node.offset, offset);
            assert.equal(node.length, length);
        }
        function _assertNodes(_rewriter, value, test, numbers) {
            var sourceFile = ts.createSourceFile('a.ts', value, 1 /* ES5 */, true);
            _rewriter.computeEdits(new rewriter.AnalyzerContext(function () { return sourceFile; }));
            assert.equal(_rewriter.nodes.length * 2, numbers.length);
            for (var i = 0, len = _rewriter.nodes.length; i < len; i += 1) {
                var node = _rewriter.nodes[i];
                if (test) {
                    test(node);
                }
                assertNode(node, numbers[i * 2], numbers[(i * 2) + 1]);
            }
        }
        function assertNodes(value) {
            var numbers = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                numbers[_i - 1] = arguments[_i];
            }
            var test;
            if (typeof numbers[0] === 'function') {
                test = numbers.shift();
            }
            _assertNodes(new importAndExportRewriter.ImportsAndExportsCollector(), value, test, numbers);
        }
        test('ImportsAndExportsCollector - invalid', function () {
            assertNodes('Define({})');
            assertNodes('define(true, [], function(){})');
        });
        test('ImportsAndExportsCollector - objectLiteral', function () {
            assertNodes('define({})', function (node) {
                assertNode(node.objectLiteral, 7, 2);
            }, 0, 10);
        });
        test('ImportsAndExportsCollector - callback params', function () {
            assertNodes('define(function(a, b) {})', function (node) {
                assert.equal(node.callbackParameters.items.length, 2);
                assertNode(node.callbackParameters, 16, 4);
            }, 0, 25);
            assertNodes('define(function() {})', 0, 21);
        });
        test('ImportsAndExportsRewriter - callback body', function () {
            assertNodes('define(function(a, b) { var c = 1s })', function (node) {
                assertNode(node.callbackBody, 23, 12);
                assert.ok(!node.dependencyArray);
            }, 0, 37);
            assertNodes('define(function() {})', 0, 21);
        });
        test('ImportsAndExportsRewriter - dependencies', function () {
            assertNodes('define(["a", "b"], function() {})', function (node) {
                assert.ok(!node.objectLiteral);
                assert.equal(node.dependencyArray.items.length, 2);
                assert.equal(node.callbackParameters.items.length, 0);
            }, 0, 33);
            assertNodes('define("id", ["a", "b"], function() {})', function (node) {
                assert.ok(!node.objectLiteral);
                assert.equal(node.identifier, 'id');
                assert.equal(node.dependencyArray.items.length, 2);
                assert.equal(node.callbackParameters.items.length, 0);
            }, 0, 39);
            assertNodes('define([], function() {})', function (node) {
                assert.ok(!node.objectLiteral);
                assert.equal(node.scope, 0);
                assert.equal(node.dependencyArray.items.length, 0);
                assert.equal(node.callbackParameters.items.length, 0);
            }, 0, 25);
            assertNodes('function test() { define([], function() {})}', function (node) {
                assert.equal(node.scope, 1);
            }, 18, 25);
            assertNodes('var a = function () {define([], function() {})}', function (node) {
                assert.equal(node.scope, 1);
            }, 21, 25);
        });
        test('ImportsAndExportsRewriter - \'exports.<more>\'-statements', function () {
            assertNodes('define(function(a, b) { exports.a = b; })', function (node) {
                assert.equal(node.exportsDotExpressions.length, 1);
                assert.equal(node.exportsDotExpressions[0].offset, 24);
                assert.equal(node.exportsDotExpressions[0].length, 9);
            }, 0, 41);
        });
        test('ImportsAndExportsRewriter - exports.', function () {
            assertNodes([
                'exports.a = 0;'
            ].join('\n'), 0, 9);
            assertNodes([
                'exports.a = function(){};'
            ].join('\n'), 0, 9);
            assertNodes([
                '/*foo*/exports.a = function(){};'
            ].join('\n'), 7, 9);
            assertNodes([
                '/*foo*/exports/*_*/.a = function(){};'
            ].join('\n'), 7, 14);
            assertNodes([
                '/*foo*/exports./*_*/a = function(){};'
            ].join('\n'), 7, 14);
            // things we cannot do
            assertNodes([
                'var a = exports.a = function() {};'
            ].join('\n'));
            assertNodes([
                'var a = exports.a = 0;'
            ].join('\n'));
        });
        test('ImportsAndExportsRewriter - module.exports.', function () {
            assertNodes([
                'module.exports.a = 0;'
            ].join('\n'), 0, 16);
            assertNodes([
                'module.exports.a = function(){};'
            ].join('\n'), 0, 16);
            assertNodes([
                '/*foo*/module.exports.a = function(){};'
            ].join('\n'), 7, 16);
            assertNodes([
                '/*foo*/module.exports/*_*/.a = function(){};'
            ].join('\n'), 7, 21);
            assertNodes([
                '/*foo*/module.exports./*_*/a = function(){};'
            ].join('\n'), 7, 21);
            // things we cannot do
            assertNodes([
                'var a = module.exports.a = function() {};'
            ].join('\n'));
            assertNodes([
                'var a = module.exports.a = 0;'
            ].join('\n'));
        });
        test('ImportsAndExportsRewriter - (module.)?exports =', function () {
            assertNodes([
                'exports = 0;'
            ].join('\n'), 0, 7);
            assertNodes([
                'module.exports = 0;'
            ].join('\n'), 0, 14);
            assertNodes([
                'module.exports = function(){};'
            ].join('\n'), 0, 14);
            assertNodes([
                '/*foo*/module.exports = function(){};'
            ].join('\n'), 7, 14);
        });
    });
});
//# sourceMappingURL=importsAndExportsRewriter.test.js.map