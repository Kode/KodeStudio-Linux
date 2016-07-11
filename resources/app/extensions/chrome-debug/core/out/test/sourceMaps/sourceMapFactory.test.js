/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
var assert = require('assert');
var mockery = require('mockery');
var typemoq_1 = require('typemoq');
var path = require('path');
var testUtils = require('../testUtils');
var utils = require('../../src/utils');
var MODULE_UNDER_TEST = '../../src/sourceMaps/sourceMapFactory';
/**
 * Unit tests for SourceMap + source-map (the mozilla lib). source-map is included in the test and not mocked
 */
suite('SourceMapFactory', function () {
    var getMapForGeneratedPath;
    setup(function () {
        testUtils.setupUnhandledRejectionListener();
        // Set up mockery
        mockery.enable({ warnOnReplace: false, useCleanCache: true, warnOnUnregistered: false });
    });
    teardown(function () {
        testUtils.removeUnhandledRejectionListener();
        mockery.deregisterAll();
        mockery.disable();
    });
    /**
     * Register a SourceMap mock that asserts that it was called with the correct args. The exception
     * should be caught by the factory, but then it should return null.
     * Should take the same args as the SourceMap constructor, but you can't enforce that with TS.
     * Mocks need to be registered before calling this.
     */
    function setExpectedConstructorArgs(generatedPath, json, webRoot) {
        var expectedArgs = arguments;
        function mockSourceMapConstructor() {
            assert.deepEqual(arguments, expectedArgs);
        }
        mockery.registerMock('./sourceMap', { SourceMap: mockSourceMapConstructor });
        getMapForGeneratedPath = require(MODULE_UNDER_TEST).getMapForGeneratedPath;
    }
    function registerMockGetURL(url, contents) {
        var utilsMock = typemoq_1.Mock.ofInstance(utils, typemoq_1.MockBehavior.Strict);
        mockery.registerMock('../utils', utilsMock.object);
        utilsMock
            .setup(function (x) { return x.getURL(typemoq_1.It.isValue(url)); })
            .returns(function () { return Promise.resolve(contents); });
        utilsMock
            .setup(function (x) { return x.isURL(typemoq_1.It.isValue(url)); })
            .returns(function () { return true; });
    }
    // How these tests basically work - The factory function should call the mocked SourceMap constructor
    // which asserts that it's called with the correct args. Also assert that it returned some object (ie nothing threw or failed);
    suite('getMapForGeneratedPath', function () {
        var GENERATED_SCRIPT_DIRNAME = path.resolve('/project/app/out/');
        var GENERATED_SCRIPT_PATH = path.join(GENERATED_SCRIPT_DIRNAME, 'script.js');
        var GENERATED_SCRIPT_URL = 'http://localhost:8080/app/script.js';
        var WEBROOT = path.resolve('/project/app');
        var FILEDATA = 'data';
        test('resolves inlined sourcemap', function () {
            var sourceMapData = JSON.stringify({ sources: ['a.ts', 'b.ts'] });
            var encodedData = 'data:application/json;base64,' + new Buffer(sourceMapData).toString('base64');
            setExpectedConstructorArgs(GENERATED_SCRIPT_PATH, sourceMapData, WEBROOT);
            return getMapForGeneratedPath(GENERATED_SCRIPT_PATH, encodedData, WEBROOT).then(function (sourceMap) {
                assert(sourceMap);
            });
        });
        test('returns null on malformed inline sourcemap', function () {
            var encodedData = 'data:application/json;base64,this is not base64-encoded data';
            return getMapForGeneratedPath(GENERATED_SCRIPT_PATH, encodedData, WEBROOT).then(function (sourceMap) {
                assert(!sourceMap);
            });
        });
        test('handles an absolute path to the sourcemap', function () {
            var absMapPath = path.resolve('/files/app.js.map');
            testUtils.registerMockReadFile({ absPath: absMapPath, data: FILEDATA });
            setExpectedConstructorArgs(GENERATED_SCRIPT_PATH, FILEDATA, WEBROOT);
            return getMapForGeneratedPath(GENERATED_SCRIPT_PATH, absMapPath, WEBROOT).then(function (sourceMap) {
                assert(sourceMap);
            });
        });
        test('handles a relative path next to the script', function () {
            testUtils.registerMockReadFile({ absPath: GENERATED_SCRIPT_PATH + '.map', data: FILEDATA });
            setExpectedConstructorArgs(GENERATED_SCRIPT_PATH, FILEDATA, WEBROOT);
            return getMapForGeneratedPath(GENERATED_SCRIPT_PATH, 'script.js.map', WEBROOT).then(function (sourceMap) {
                assert(sourceMap);
            });
        });
        test('handles a relative path with a generated script url', function () {
            registerMockGetURL(GENERATED_SCRIPT_URL + '.map', FILEDATA);
            setExpectedConstructorArgs(GENERATED_SCRIPT_URL, FILEDATA, WEBROOT);
            return getMapForGeneratedPath(GENERATED_SCRIPT_URL, 'script.js.map', WEBROOT).then(function (sourceMap) {
                assert(sourceMap);
            });
        });
        test('looks for a map file next to the script', function () {
            var badMapPath = path.resolve('/files/app.js.map');
            testUtils.registerMockReadFile({ absPath: badMapPath, data: null }, { absPath: GENERATED_SCRIPT_PATH + '.map', data: FILEDATA });
            setExpectedConstructorArgs(GENERATED_SCRIPT_PATH, FILEDATA, WEBROOT);
            return getMapForGeneratedPath(GENERATED_SCRIPT_PATH, badMapPath, WEBROOT).then(function (sourceMap) {
                assert(sourceMap);
            });
        });
    });
});

//# sourceMappingURL=sourceMapFactory.test.js.map
