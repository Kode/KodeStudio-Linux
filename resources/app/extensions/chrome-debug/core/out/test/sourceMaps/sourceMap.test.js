/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
var assert = require('assert');
var path = require('path');
var fs = require('fs');
var testUtils = require('../testUtils');
var sourceMap_1 = require('../../src/sourceMaps/sourceMap');
/**
 * Unit tests for SourceMap + source-map (the mozilla lib). source-map is included in the test and not mocked
 */
suite('SourceMap', function () {
    var GENERATED_PATH = testUtils.pathResolve('/project/src/app.js');
    var WEBROOT = testUtils.pathResolve('/project');
    var SOURCEROOT = '/src';
    var SOURCES = [
        'source1.ts',
        'source2.ts'
    ];
    var ABSOLUTE_SOURCES = SOURCES.map(function (source) {
        // Join the path segments, then resolve to force proper slashes
        return testUtils.pathResolve(path.join(WEBROOT, SOURCEROOT, source));
    });
    // Load out.js.map, which should be copied to this folder under 'out' by the build process
    var SOURCEMAP_MAPPINGS_JSON = fs.readFileSync(path.resolve(__dirname, 'testData/app.js.map')).toString();
    setup(function () {
        testUtils.setupUnhandledRejectionListener();
    });
    teardown(function () {
        testUtils.removeUnhandledRejectionListener();
    });
    suite('constructor', function () {
        test('does not crash when sourceRoot is undefined', function () {
            // Rare and possibly invalid, but I saw it
            var sourceMapJSON = getMockSourceMapJSON(SOURCES, undefined);
            var sm = new sourceMap_1.SourceMap(GENERATED_PATH, sourceMapJSON, WEBROOT);
            assert(sm);
        });
    });
    suite('.sources', function () {
        test('relative sources are made absolute', function () {
            var sourceMapJSON = getMockSourceMapJSON(SOURCES, SOURCEROOT);
            var sm = new sourceMap_1.SourceMap(GENERATED_PATH, sourceMapJSON, WEBROOT);
            assert.deepEqual(sm.authoredSources, ABSOLUTE_SOURCES);
        });
        test('sources with absolute paths are used as-is', function () {
            var sourceMapJSON = getMockSourceMapJSON(ABSOLUTE_SOURCES, SOURCEROOT);
            var sm = new sourceMap_1.SourceMap(GENERATED_PATH, sourceMapJSON, WEBROOT);
            assert.deepEqual(sm.authoredSources, ABSOLUTE_SOURCES);
        });
        test('file:/// sources are exposed as absolute paths', function () {
            var fileSources = ABSOLUTE_SOURCES.map(function (source) { return 'file:///' + source; });
            var sourceMapJSON = getMockSourceMapJSON(fileSources, SOURCEROOT);
            var sm = new sourceMap_1.SourceMap(GENERATED_PATH, sourceMapJSON, WEBROOT);
            assert.deepEqual(sm.authoredSources, ABSOLUTE_SOURCES);
        });
    });
    suite('doesOriginateFrom', function () {
        test('returns true for a source that it contains', function () {
            var sourceMapJSON = getMockSourceMapJSON(ABSOLUTE_SOURCES, SOURCEROOT);
            var sm = new sourceMap_1.SourceMap(GENERATED_PATH, sourceMapJSON, WEBROOT);
            assert(sm.doesOriginateFrom(ABSOLUTE_SOURCES[0]));
        });
        test('returns false for a source that it does not contain', function () {
            var sourceMapJSON = getMockSourceMapJSON(ABSOLUTE_SOURCES, SOURCEROOT);
            var sm = new sourceMap_1.SourceMap(GENERATED_PATH, sourceMapJSON, WEBROOT);
            assert(!sm.doesOriginateFrom('c:\\fake\\file.js'));
        });
    });
    suite('originalPositionFor', function () {
        var sm;
        setup(function () {
            sm = new sourceMap_1.SourceMap(GENERATED_PATH, SOURCEMAP_MAPPINGS_JSON, WEBROOT);
        });
        function getExpectedResult(line, column, source) {
            if (source === void 0) { source = ABSOLUTE_SOURCES[0]; }
            return {
                line: line,
                column: column,
                name: null,
                source: source
            };
        }
        test('return statement', function () {
            assert.deepEqual(sm.authoredPositionFor(/*line=*/ 11, /*column=*/ 0), getExpectedResult(/*line=*/ 13, /*column=*/ 8));
            assert.deepEqual(sm.authoredPositionFor(/*line=*/ 11, /*column=*/ 8), getExpectedResult(/*line=*/ 13, /*column=*/ 8));
            assert.deepEqual(sm.authoredPositionFor(/*line=*/ 11, /*column=*/ 17), getExpectedResult(/*line=*/ 13, /*column=*/ 17));
        });
        test('first line of a method', function () {
            // 'let x = ...'
            assert.deepEqual(sm.authoredPositionFor(/*line=*/ 9, /*column=*/ 0), getExpectedResult(/*line=*/ 11, /*column=*/ 8));
            assert.deepEqual(sm.authoredPositionFor(/*line=*/ 9, /*column=*/ 8), getExpectedResult(/*line=*/ 11, /*column=*/ 8));
            assert.deepEqual(sm.authoredPositionFor(/*line=*/ 9, /*column=*/ 9), getExpectedResult(/*line=*/ 11, /*column=*/ 12));
        });
        test('private field initializer', function () {
            // 'private _x = ...'
            assert.deepEqual(sm.authoredPositionFor(/*line=*/ 5, /*column=*/ 0), getExpectedResult(/*line=*/ 4, /*column=*/ 12));
            assert.deepEqual(sm.authoredPositionFor(/*line=*/ 5, /*column=*/ 4), getExpectedResult(/*line=*/ 4, /*column=*/ 12));
            assert.deepEqual(sm.authoredPositionFor(/*line=*/ 5, /*column=*/ 17), getExpectedResult(/*line=*/ 4, /*column=*/ 25));
        });
        test('first line of file', function () {
            var expected = getExpectedResult(/*line=*/ 0, /*column=*/ 0, ABSOLUTE_SOURCES[1]);
            // 'function f() { ...'
            assert.deepEqual(sm.authoredPositionFor(/*line=*/ 18, /*column=*/ 0), expected);
            assert.deepEqual(sm.authoredPositionFor(/*line=*/ 18, /*column=*/ 9), expected);
            assert.deepEqual(sm.authoredPositionFor(/*line=*/ 18, /*column=*/ 14), expected);
        });
        test('last line of file', function () {
            // 'f();'
            assert.deepEqual(sm.authoredPositionFor(/*line=*/ 22, /*column=*/ 0), getExpectedResult(/*line=*/ 5, /*column=*/ 0, ABSOLUTE_SOURCES[1]));
            assert.deepEqual(sm.authoredPositionFor(/*line=*/ 22, /*column=*/ 1), getExpectedResult(/*line=*/ 5, /*column=*/ 1, ABSOLUTE_SOURCES[1]));
            assert.deepEqual(sm.authoredPositionFor(/*line=*/ 22, /*column=*/ 5), getExpectedResult(/*line=*/ 5, /*column=*/ 4, ABSOLUTE_SOURCES[1]));
        });
        test('return null when there is no matching mapping', function () {
            assert.deepEqual(sm.authoredPositionFor(/*line=*/ 1000, /*column=*/ 0), null);
        });
    });
    suite('generatedPositionFor', function () {
        var sm;
        setup(function () {
            sm = new sourceMap_1.SourceMap(GENERATED_PATH, SOURCEMAP_MAPPINGS_JSON, WEBROOT);
        });
        function getExpectedResult(line, column) {
            return {
                line: line,
                column: column,
                source: GENERATED_PATH
            };
        }
        test('return statement', function () {
            assert.deepEqual(sm.generatedPositionFor(ABSOLUTE_SOURCES[0], /*line=*/ 13, /*column=*/ 0), getExpectedResult(/*line=*/ 11, /*column=*/ 8));
            assert.deepEqual(sm.generatedPositionFor(ABSOLUTE_SOURCES[0], /*line=*/ 13, /*column=*/ 8), getExpectedResult(/*line=*/ 11, /*column=*/ 8));
            assert.deepEqual(sm.generatedPositionFor(ABSOLUTE_SOURCES[0], /*line=*/ 13, /*column=*/ 17), getExpectedResult(/*line=*/ 11, /*column=*/ 17));
        });
        test('first line of a method', function () {
            // 'let x = ...'
            assert.deepEqual(sm.generatedPositionFor(ABSOLUTE_SOURCES[0], /*line=*/ 11, /*column=*/ 0), getExpectedResult(/*line=*/ 9, /*column=*/ 8));
            assert.deepEqual(sm.generatedPositionFor(ABSOLUTE_SOURCES[0], /*line=*/ 11, /*column=*/ 8), getExpectedResult(/*line=*/ 9, /*column=*/ 8));
            assert.deepEqual(sm.generatedPositionFor(ABSOLUTE_SOURCES[0], /*line=*/ 11, /*column=*/ 19), getExpectedResult(/*line=*/ 9, /*column=*/ 20));
        });
        test('private field initializer', function () {
            // 'private _x = ...'
            assert.deepEqual(sm.generatedPositionFor(ABSOLUTE_SOURCES[0], /*line=*/ 4, /*column=*/ 0), getExpectedResult(/*line=*/ 5, /*column=*/ 8));
            assert.deepEqual(sm.generatedPositionFor(ABSOLUTE_SOURCES[0], /*line=*/ 4, /*column=*/ 4), getExpectedResult(/*line=*/ 5, /*column=*/ 8));
            assert.deepEqual(sm.generatedPositionFor(ABSOLUTE_SOURCES[0], /*line=*/ 4, /*column=*/ 20), getExpectedResult(/*line=*/ 5, /*column=*/ 18));
        });
        test('first line of file', function () {
            // 'function f() { ...'
            assert.deepEqual(sm.generatedPositionFor(ABSOLUTE_SOURCES[1], /*line=*/ 0, /*column=*/ 0), getExpectedResult(/*line=*/ 18, /*column=*/ 0));
            // This line only has one mapping, so a non-0 column ends up mapped to the next line.
            // I think this needs a fix but at the moment there is no scenario where this is called with
            // a non-0 column.
            assert.deepEqual(sm.generatedPositionFor(ABSOLUTE_SOURCES[1], /*line=*/ 0, /*column=*/ 1), getExpectedResult(/*line=*/ 19, /*column=*/ 4));
            assert.deepEqual(sm.generatedPositionFor(ABSOLUTE_SOURCES[1], /*line=*/ 0, /*column=*/ 14), getExpectedResult(/*line=*/ 19, /*column=*/ 4));
        });
        test('last line of file', function () {
            // 'f();'
            assert.deepEqual(sm.generatedPositionFor(ABSOLUTE_SOURCES[1], /*line=*/ 5, /*column=*/ 0), getExpectedResult(/*line=*/ 22, /*column=*/ 0));
            assert.deepEqual(sm.generatedPositionFor(ABSOLUTE_SOURCES[1], /*line=*/ 5, /*column=*/ 1), getExpectedResult(/*line=*/ 22, /*column=*/ 1));
            assert.deepEqual(sm.generatedPositionFor(ABSOLUTE_SOURCES[1], /*line=*/ 5, /*column=*/ 5), getExpectedResult(/*line=*/ 22, /*column=*/ 4));
        });
        // Discrepency with originalPositionFor bc that's the way the source-map lib works.
        // Not sure whether there's a good reason for that.
        test('returns the last mapping when there is no matching mapping', function () {
            assert.deepEqual(sm.generatedPositionFor(ABSOLUTE_SOURCES[0], /*line=*/ 1000, /*column=*/ 0), getExpectedResult(/*line=*/ 17, /*column=*/ 1));
        });
    });
});
function getMockSourceMapJSON(sources, sourceRoot) {
    return JSON.stringify({
        sources: sources,
        sourceRoot: sourceRoot,
        version: 3,
        mappings: []
    });
}

//# sourceMappingURL=sourceMap.test.js.map
