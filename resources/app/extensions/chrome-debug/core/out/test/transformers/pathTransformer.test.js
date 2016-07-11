/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
var assert = require('assert');
var mockery = require('mockery');
var testUtils = require('../testUtils');
var chromeUtils = require('../../src/chrome/chromeUtils');
// As of 0.1.0, the included .d.ts is not in the right format to use the import syntax here
// https://github.com/florinn/typemoq/issues/4
// const typemoq: ITypeMoqStatic = require('typemoq');
var typemoq_1 = require('typemoq');
var MODULE_UNDER_TEST = '../../src/transformers/pathTransformer';
function createTransformer() {
    return new (require(MODULE_UNDER_TEST).PathTransformer)();
}
suite('PathTransformer', function () {
    var TARGET_URL = 'http://mysite.com/scripts/script1.js';
    var CLIENT_PATH = testUtils.pathResolve('/projects/mysite/scripts/script1.js');
    var chromeUtilsMock;
    var transformer;
    setup(function () {
        testUtils.setupUnhandledRejectionListener();
        mockery.enable({ useCleanCache: true, warnOnReplace: false, warnOnUnregistered: false });
        chromeUtilsMock = typemoq_1.Mock.ofInstance(chromeUtils, typemoq_1.MockBehavior.Strict);
        mockery.registerMock('../chrome/chromeUtils', chromeUtilsMock.object);
        transformer = createTransformer();
    });
    teardown(function () {
        testUtils.removeUnhandledRejectionListener();
        mockery.deregisterAll();
        mockery.disable();
        chromeUtilsMock.verifyAll();
    });
    suite('setBreakpoints()', function () {
        var SET_BP_ARGS;
        var EXPECTED_SET_BP_ARGS = { source: { path: TARGET_URL } };
        setup(function () {
            // This will be modified by the test, so restore it before each
            SET_BP_ARGS = { source: { path: CLIENT_PATH } };
        });
        test('resolves correctly when it can map the client script to the target script', function () {
            chromeUtilsMock
                .setup(function (x) { return x.targetUrlToClientPath(typemoq_1.It.isValue(undefined), typemoq_1.It.isValue(TARGET_URL)); })
                .returns(function () { return CLIENT_PATH; }).verifiable();
            transformer.scriptParsed({ body: { scriptUrl: TARGET_URL } });
            return transformer.setBreakpoints(SET_BP_ARGS).then(function () {
                assert.deepEqual(SET_BP_ARGS, EXPECTED_SET_BP_ARGS);
            });
        });
        test("doesn't resolve until it can map the client script to the target script", function () {
            chromeUtilsMock
                .setup(function (x) { return x.targetUrlToClientPath(typemoq_1.It.isValue(undefined), typemoq_1.It.isValue(TARGET_URL)); })
                .returns(function () { return CLIENT_PATH; }).verifiable();
            var setBreakpointsP = transformer.setBreakpoints(SET_BP_ARGS).then(function () {
                // If this assert doesn't fail, we know that it resolved at the right time because otherwise it would have no
                // way to produce args with the right url
                assert.deepEqual(SET_BP_ARGS, EXPECTED_SET_BP_ARGS);
            });
            transformer.scriptParsed({ body: { scriptUrl: TARGET_URL } });
            return setBreakpointsP;
        });
        test("uses path as-is when it's a URL", function () {
            var args = { source: { path: TARGET_URL } };
            return transformer.setBreakpoints(args).then(function () {
                assert.deepEqual(args, EXPECTED_SET_BP_ARGS);
            });
        });
    });
    suite('scriptParsed', function () {
        test('modifies args.source.path of the script parsed event when the file can be mapped', function () {
            chromeUtilsMock
                .setup(function (x) { return x.targetUrlToClientPath(typemoq_1.It.isValue(undefined), typemoq_1.It.isValue(TARGET_URL)); })
                .returns(function () { return CLIENT_PATH; }).verifiable();
            var scriptParsedArgs = { body: { scriptUrl: TARGET_URL } };
            var expectedScriptParsedArgs = { body: { scriptUrl: CLIENT_PATH } };
            transformer.scriptParsed(scriptParsedArgs);
            assert.deepEqual(scriptParsedArgs, expectedScriptParsedArgs);
        });
        test("doesn't modify args.source.path when the file can't be mapped", function () {
            chromeUtilsMock
                .setup(function (x) { return x.targetUrlToClientPath(typemoq_1.It.isValue(undefined), typemoq_1.It.isValue(TARGET_URL)); })
                .returns(function () { return ''; }).verifiable();
            var scriptParsedArgs = { body: { scriptUrl: TARGET_URL } };
            var expectedScriptParsedArgs = { body: { scriptUrl: TARGET_URL } };
            transformer.scriptParsed(scriptParsedArgs);
            assert.deepEqual(scriptParsedArgs, expectedScriptParsedArgs);
        });
    });
    suite('stackTraceResponse()', function () {
        var RUNTIME_LINES = [2, 5, 8];
        test('modifies the source path and clears sourceReference when the file can be mapped', function () {
            chromeUtilsMock
                .setup(function (x) { return x.targetUrlToClientPath(typemoq_1.It.isValue(undefined), typemoq_1.It.isValue(TARGET_URL)); })
                .returns(function () { return CLIENT_PATH; }).verifiable();
            var response = testUtils.getStackTraceResponseBody(TARGET_URL, RUNTIME_LINES, [1, 2, 3]);
            var expectedResponse = testUtils.getStackTraceResponseBody(CLIENT_PATH, RUNTIME_LINES);
            transformer.stackTraceResponse(response);
            assert.deepEqual(response, expectedResponse);
        });
        test("doesn't modify the source path or clear the sourceReference when the file can't be mapped", function () {
            chromeUtilsMock
                .setup(function (x) { return x.targetUrlToClientPath(typemoq_1.It.isValue(undefined), typemoq_1.It.isValue(TARGET_URL)); })
                .returns(function () { return ''; }).verifiable();
            var response = testUtils.getStackTraceResponseBody(TARGET_URL, RUNTIME_LINES, [1, 2, 3]);
            var expectedResponse = testUtils.getStackTraceResponseBody(TARGET_URL, RUNTIME_LINES, [1, 2, 3]);
            transformer.stackTraceResponse(response);
            assert.deepEqual(response, expectedResponse);
        });
    });
});

//# sourceMappingURL=pathTransformer.test.js.map
