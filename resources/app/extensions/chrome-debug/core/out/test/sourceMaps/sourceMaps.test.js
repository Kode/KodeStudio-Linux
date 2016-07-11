/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
var assert = require('assert');
var mockery = require('mockery');
var testUtils = require('../testUtils');
var path = require('path');
var utils_1 = require('../../src/utils');
var sourceMaps_1 = require('../../src/sourceMaps/sourceMaps');
suite('SourceMaps', function () {
    // VSCode expects lowercase windows drive names
    var DIRNAME = utils_1.fixDriveLetterAndSlashes(__dirname);
    var GENERATED_PATH = path.resolve(DIRNAME, 'testData/app.js');
    var AUTHORED_PATH = path.resolve(DIRNAME, 'testData/source1.ts');
    var ALL_SOURCES = [AUTHORED_PATH, path.resolve(DIRNAME, 'testData/source2.ts')];
    var WEBROOT = 'http://localhost';
    var SOURCEMAP_URL = 'app.js.map';
    var sourceMaps = new sourceMaps_1.SourceMaps(WEBROOT);
    setup(function (done) {
        testUtils.setupUnhandledRejectionListener();
        mockery.enable({ warnOnReplace: false, useCleanCache: true, warnOnUnregistered: false });
        testUtils.registerWin32Mocks();
        sourceMaps.processNewSourceMap(GENERATED_PATH, SOURCEMAP_URL).then(done);
    });
    teardown(function () {
        testUtils.removeUnhandledRejectionListener();
        mockery.deregisterAll();
        mockery.disable();
    });
    test('allMappedSources is case insensitive', function () {
        assert.deepEqual(sourceMaps.allMappedSources(GENERATED_PATH.toUpperCase()), ALL_SOURCES);
        assert.deepEqual(sourceMaps.allMappedSources(GENERATED_PATH.toLowerCase()), ALL_SOURCES);
    });
    test('getGeneratedPathFromAuthoredPath is case insensitive', function () {
        assert.equal(sourceMaps.getGeneratedPathFromAuthoredPath(AUTHORED_PATH.toUpperCase()), GENERATED_PATH);
        assert.equal(sourceMaps.getGeneratedPathFromAuthoredPath(AUTHORED_PATH.toLowerCase()), GENERATED_PATH);
    });
    test('mapToGenerated is case insensitive', function () {
        var position = { line: 0, column: 0, source: GENERATED_PATH };
        assert.deepEqual(sourceMaps.mapToGenerated(AUTHORED_PATH.toUpperCase(), 0, 0), position);
        assert.deepEqual(sourceMaps.mapToGenerated(AUTHORED_PATH.toLowerCase(), 0, 0), position);
    });
    test('mapToAuthored is case insensitive', function () {
        var position = { line: 0, column: 0, name: null, source: AUTHORED_PATH };
        assert.deepEqual(sourceMaps.mapToAuthored(GENERATED_PATH.toUpperCase(), 0, 0), position);
        assert.deepEqual(sourceMaps.mapToAuthored(GENERATED_PATH.toLowerCase(), 0, 0), position);
    });
});

//# sourceMappingURL=sourceMaps.test.js.map
