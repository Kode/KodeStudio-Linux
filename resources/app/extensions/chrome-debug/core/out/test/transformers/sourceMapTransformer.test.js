/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
var assert = require('assert');
var mockery = require('mockery');
var typemoq_1 = require('typemoq');
var testUtils = require('../testUtils');
var sourceMaps_1 = require('../../src/sourceMaps/sourceMaps');
var utils = require('../../src/utils');
var MODULE_UNDER_TEST = '../../src/transformers/sourceMapTransformer';
var AUTHORED_PATH = testUtils.pathResolve('/project/authored.ts');
var RUNTIME_PATH = testUtils.pathResolve('/project/runtime.js');
var AUTHORED_LINES = [1, 2, 3];
var RUNTIME_LINES = [2, 5, 8];
var RUNTIME_COLS = [3, 7, 11];
var AUTHORED_PATH2 = testUtils.pathResolve('/project/authored2.ts');
var AUTHORED_LINES2 = [90, 105];
var RUNTIME_LINES2 = [78, 81];
var RUNTIME_COLS2 = [0, 1];
suite('SourceMapTransformer', function () {
    var utilsMock;
    setup(function () {
        testUtils.setupUnhandledRejectionListener();
        // Mock the utils module
        utilsMock = typemoq_1.Mock.ofInstance(utils);
        utilsMock.callBase = true;
        mockery.registerMock('../utils', utilsMock.object);
        // Set up mockery
        mockery.enable({ warnOnReplace: false, useCleanCache: true, warnOnUnregistered: false });
    });
    teardown(function () {
        testUtils.removeUnhandledRejectionListener();
        mockery.deregisterAll();
        mockery.disable();
    });
    function getTransformer(sourceMaps, suppressDefaultMock) {
        if (sourceMaps === void 0) { sourceMaps = true; }
        if (suppressDefaultMock === void 0) { suppressDefaultMock = false; }
        if (!suppressDefaultMock) {
            mockery.registerMock('../sourceMaps/sourceMaps', { SourceMaps: StubSourceMaps });
        }
        var SourceMapTransformer = require(MODULE_UNDER_TEST).SourceMapTransformer;
        var transformer = new SourceMapTransformer();
        transformer.launch({
            sourceMaps: sourceMaps,
            generatedCodeDirectory: 'test'
        });
        return transformer;
    }
    suite('setBreakpoints()', function () {
        function createArgs(path, lines, cols) {
            return {
                source: { path: path },
                lines: lines,
                cols: cols
            };
        }
        function createExpectedArgs(authoredPath, path, lines, cols) {
            var args = createArgs(path, lines, cols);
            args.authoredPath = authoredPath;
            return args;
        }
        function createMergedSourcesMock(args, args2) {
            var mock = typemoq_1.Mock.ofType(sourceMaps_1.SourceMaps, typemoq_1.MockBehavior.Strict);
            mockery.registerMock('../sourceMaps/sourceMaps', { SourceMaps: function () { return mock.object; } });
            mock
                .setup(function (x) { return x.getGeneratedPathFromAuthoredPath(typemoq_1.It.isValue(AUTHORED_PATH)); })
                .returns(function () { return RUNTIME_PATH; }).verifiable();
            mock
                .setup(function (x) { return x.getGeneratedPathFromAuthoredPath(typemoq_1.It.isValue(AUTHORED_PATH2)); })
                .returns(function () { return RUNTIME_PATH; }).verifiable();
            mock
                .setup(function (x) { return x.allMappedSources(typemoq_1.It.isValue(RUNTIME_PATH)); })
                .returns(function () { return [AUTHORED_PATH, AUTHORED_PATH2]; }).verifiable();
            args.lines.forEach(function (line, i) {
                mock
                    .setup(function (x) { return x.mapToGenerated(typemoq_1.It.isValue(AUTHORED_PATH), typemoq_1.It.isValue(line), typemoq_1.It.isValue(0)); })
                    .returns(function () { return ({ source: RUNTIME_PATH, line: RUNTIME_LINES[i], column: RUNTIME_COLS[i] }); }).verifiable();
            });
            args2.lines.forEach(function (line, i) {
                mock
                    .setup(function (x) { return x.mapToGenerated(typemoq_1.It.isValue(AUTHORED_PATH2), typemoq_1.It.isValue(line), typemoq_1.It.isValue(0)); })
                    .returns(function () { return ({ source: RUNTIME_PATH, line: RUNTIME_LINES2[i], column: RUNTIME_COLS2[i] }); }).verifiable();
            });
            return mock;
        }
        test('modifies the source and lines', function () {
            var args = createArgs(AUTHORED_PATH, AUTHORED_LINES);
            var expected = createExpectedArgs(AUTHORED_PATH, RUNTIME_PATH, RUNTIME_LINES, RUNTIME_COLS);
            return getTransformer().setBreakpoints(args, 0).then(function () {
                assert.deepEqual(args, expected);
            });
        });
        test("doesn't do anything when sourcemaps are disabled", function () {
            var args = createArgs(RUNTIME_PATH, RUNTIME_LINES);
            var expected = createArgs(RUNTIME_PATH, RUNTIME_LINES);
            return getTransformer(/*sourceMaps=*/ false).setBreakpoints(args, 0).then(function () {
                assert.deepEqual(args, expected);
            });
        });
        test("if the source can't be mapped, waits until the runtime script is loaded", function () {
            var args = createArgs(AUTHORED_PATH, AUTHORED_LINES);
            var expected = createExpectedArgs(AUTHORED_PATH, RUNTIME_PATH, RUNTIME_LINES, RUNTIME_COLS);
            var sourceMapURL = 'script.js.map';
            var mock = typemoq_1.Mock.ofType(sourceMaps_1.SourceMaps, typemoq_1.MockBehavior.Strict);
            mockery.registerMock('../sourceMaps/sourceMaps', { SourceMaps: function () { return mock.object; } });
            mock
                .setup(function (x) { return x.getGeneratedPathFromAuthoredPath(typemoq_1.It.isValue(AUTHORED_PATH)); })
                .returns(function () { return null; }).verifiable();
            mock
                .setup(function (x) { return x.getGeneratedPathFromAuthoredPath(typemoq_1.It.isValue(AUTHORED_PATH)); })
                .returns(function () { return RUNTIME_PATH; }).verifiable();
            mock
                .setup(function (x) { return x.allMappedSources(typemoq_1.It.isValue(RUNTIME_PATH)); })
                .returns(function () { return [AUTHORED_PATH]; }).verifiable();
            mock
                .setup(function (x) { return x.processNewSourceMap(typemoq_1.It.isValue(RUNTIME_PATH), typemoq_1.It.isValue(sourceMapURL)); })
                .returns(function () { return Promise.resolve(); }).verifiable();
            args.lines.forEach(function (line, i) {
                mock
                    .setup(function (x) { return x.mapToGenerated(typemoq_1.It.isValue(AUTHORED_PATH), typemoq_1.It.isValue(line), typemoq_1.It.isValue(0)); })
                    .returns(function () { return ({ source: RUNTIME_PATH, line: RUNTIME_LINES[i], column: RUNTIME_COLS[i] }); }).verifiable();
            });
            var transformer = getTransformer(/*sourceMaps=*/ true, /*suppressDefaultMock=*/ true);
            var setBreakpointsP = transformer.setBreakpoints(args, /*requestSeq=*/ 0).then(function () {
                assert.deepEqual(args, expected);
                mock.verifyAll();
            });
            transformer.scriptParsed(new testUtils.MockEvent('scriptParsed', { scriptUrl: RUNTIME_PATH, sourceMapURL: sourceMapURL }));
            return setBreakpointsP;
        });
        test('if the source maps to a merged file, includes the breakpoints in other files that map to the same file', function () {
            var args = createArgs(AUTHORED_PATH, AUTHORED_LINES);
            var args2 = createArgs(AUTHORED_PATH2, AUTHORED_LINES2);
            var expected = createExpectedArgs(AUTHORED_PATH2, RUNTIME_PATH, RUNTIME_LINES2.concat(RUNTIME_LINES), RUNTIME_COLS2.concat(RUNTIME_COLS));
            var mock = createMergedSourcesMock(args, args2);
            var transformer = getTransformer(/*sourceMaps=*/ true, /*suppressDefaultMock=*/ true);
            return transformer.setBreakpoints(args, 0).then(function () {
                return transformer.setBreakpoints(args2, 1);
            }).then(function () {
                assert.deepEqual(args2, expected);
                mock.verifyAll();
            });
        });
        suite('setBreakpointsResponse()', function () {
            function getResponseBody(lines, column) {
                return {
                    breakpoints: lines.map(function (line) {
                        var bp = { line: line, verified: true };
                        if (column !== undefined) {
                            bp.column = column;
                        }
                        return bp;
                    })
                };
            }
            test('modifies the response source and lines', function () {
                var response = getResponseBody(RUNTIME_LINES, /*column=*/ 0);
                var expected = getResponseBody(AUTHORED_LINES);
                var transformer = getTransformer();
                transformer.setBreakpoints({
                    source: { path: AUTHORED_PATH },
                    lines: AUTHORED_LINES
                }, 0);
                transformer.setBreakpointsResponse(response, 0);
                assert.deepEqual(response, expected);
            });
            test("doesn't do anything when sourcemaps are disabled except remove the column", function () {
                var response = getResponseBody(RUNTIME_LINES, /*column=*/ 0);
                var expected = getResponseBody(RUNTIME_LINES);
                var transformer = getTransformer(/*sourceMaps=*/ false);
                transformer.setBreakpoints({
                    source: { path: RUNTIME_PATH },
                    lines: RUNTIME_LINES
                }, 0);
                transformer.setBreakpointsResponse(response, 0);
                assert.deepEqual(response, expected);
            });
            test("if the source maps to a merged file, filters breakpoint results from other files", function () {
                var setBPArgs = createArgs(AUTHORED_PATH, AUTHORED_LINES);
                var setBPArgs2 = createArgs(AUTHORED_PATH2, AUTHORED_LINES2);
                var response = getResponseBody(RUNTIME_LINES2.concat(RUNTIME_LINES), /*column=*/ 0);
                var expected = getResponseBody(AUTHORED_LINES2);
                var mock = createMergedSourcesMock(setBPArgs, setBPArgs2);
                RUNTIME_LINES2.forEach(function (line, i) {
                    mock
                        .setup(function (x) { return x.mapToAuthored(typemoq_1.It.isValue(RUNTIME_PATH), typemoq_1.It.isValue(line), typemoq_1.It.isValue(0)); })
                        .returns(function () { return ({ source: AUTHORED_PATH2, line: AUTHORED_LINES2[i], column: 0 }); }).verifiable();
                });
                var transformer = getTransformer(/*sourceMaps=*/ true, /*suppressDefaultMock=*/ true);
                return transformer.setBreakpoints(setBPArgs, /*requestSeq=*/ 0)
                    .then(function () { return transformer.setBreakpoints(setBPArgs2, /*requestSeq=*/ 1); })
                    .then(function () {
                    transformer.setBreakpointsResponse(response, /*requestSeq=*/ 1);
                    assert.deepEqual(response, expected);
                    mock.verifyAll();
                });
            });
        });
    });
    suite('stackTraceResponse()', function () {
        test('modifies the response stackFrames', function () {
            utilsMock
                .setup(function (x) { return x.existsSync(typemoq_1.It.isValue(AUTHORED_PATH)); })
                .returns(function () { return true; });
            var response = testUtils.getStackTraceResponseBody(RUNTIME_PATH, RUNTIME_LINES, [1, 2, 3]);
            var expected = testUtils.getStackTraceResponseBody(AUTHORED_PATH, AUTHORED_LINES);
            getTransformer().stackTraceResponse(response);
            assert.deepEqual(response, expected);
        });
        test('clears the path when there are no sourcemaps', function () {
            var response = testUtils.getStackTraceResponseBody(RUNTIME_PATH, RUNTIME_LINES, [1, 2, 3]);
            var expected = testUtils.getStackTraceResponseBody(RUNTIME_PATH, RUNTIME_LINES, [1, 2, 3]);
            expected.stackFrames.forEach(function (stackFrame) { return stackFrame.source.path = undefined; }); // leave name intact
            getTransformer(/*sourceMaps=*/ false).stackTraceResponse(response);
            assert.deepEqual(response, expected);
        });
        test("keeps the path when the file can't be sourcemapped if it's on disk", function () {
            var mock = typemoq_1.Mock.ofType(sourceMaps_1.SourceMaps, typemoq_1.MockBehavior.Strict);
            mockery.registerMock('../sourceMaps/sourceMaps', { SourceMaps: function () { return mock.object; } });
            RUNTIME_LINES.forEach(function (line) {
                mock
                    .setup(function (x) { return x.mapToAuthored(typemoq_1.It.isValue(RUNTIME_PATH), typemoq_1.It.isValue(line), typemoq_1.It.isValue(0)); })
                    .returns(function () { return null; }).verifiable();
            });
            utilsMock
                .setup(function (x) { return x.existsSync(typemoq_1.It.isValue(RUNTIME_PATH)); })
                .returns(function () { return true; });
            var response = testUtils.getStackTraceResponseBody(RUNTIME_PATH, RUNTIME_LINES, [1, 2, 3]);
            var expected = testUtils.getStackTraceResponseBody(RUNTIME_PATH, RUNTIME_LINES);
            getTransformer(/*sourceMaps=*/ true, /*suppressDefaultMock=*/ true).stackTraceResponse(response);
            assert.deepEqual(response, expected);
            mock.verifyAll();
        });
        test("clears the path and name when it can't be sourcemapped and doesn't exist on disk", function () {
            var mock = typemoq_1.Mock.ofType(sourceMaps_1.SourceMaps, typemoq_1.MockBehavior.Strict);
            mockery.registerMock('../sourceMaps/sourceMaps', { SourceMaps: function () { return mock.object; } });
            RUNTIME_LINES.forEach(function (line) {
                mock
                    .setup(function (x) { return x.mapToAuthored(typemoq_1.It.isValue(RUNTIME_PATH), typemoq_1.It.isValue(line), typemoq_1.It.isValue(0)); })
                    .returns(function () { return null; }).verifiable();
            });
            utilsMock
                .setup(function (x) { return x.existsSync(typemoq_1.It.isValue(RUNTIME_PATH)); })
                .returns(function () { return false; });
            var response = testUtils.getStackTraceResponseBody(RUNTIME_PATH, RUNTIME_LINES, [1, 2, 3]);
            var expected = testUtils.getStackTraceResponseBody(RUNTIME_PATH, RUNTIME_LINES, [1, 2, 3]);
            expected.stackFrames.forEach(function (stackFrame) {
                stackFrame.source.name = 'eval: ' + stackFrame.source.sourceReference;
                stackFrame.source.path = undefined;
            });
            getTransformer(/*sourceMaps=*/ true, /*suppressDefaultMock=*/ true).stackTraceResponse(response);
            assert.deepEqual(response, expected);
            mock.verifyAll();
        });
    });
});
var StubSourceMaps = (function () {
    function StubSourceMaps(generatedCodeDirectory) {
        this.generatedCodeDirectory = generatedCodeDirectory;
    }
    StubSourceMaps.prototype.getGeneratedPathFromAuthoredPath = function (path) {
        return RUNTIME_PATH;
    };
    /*
     * Map location in source language to location in generated code.
     * line and column are 0 based.
     */
    StubSourceMaps.prototype.mapToGenerated = function (path, line, column) {
        var index = AUTHORED_LINES.indexOf(line);
        var mappedLine = RUNTIME_LINES[index];
        var mappedCol = RUNTIME_COLS[index];
        return { source: RUNTIME_PATH, line: mappedLine, column: mappedCol };
    };
    /*
     * Map location in generated code to location in source language.
     * line and column are 0 based.
     */
    StubSourceMaps.prototype.mapToAuthored = function (path, line, column) {
        var mappedLine = AUTHORED_LINES[RUNTIME_LINES.indexOf(line)];
        return { source: AUTHORED_PATH, line: mappedLine, column: 0 };
    };
    StubSourceMaps.prototype.allMappedSources = function (pathToGenerated) {
        return [AUTHORED_PATH];
    };
    StubSourceMaps.prototype.processNewSourceMap = function (pathToGenerated, sourceMapURL) {
        return Promise.resolve();
    };
    return StubSourceMaps;
}());

//# sourceMappingURL=sourceMapTransformer.test.js.map
