/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
var mockery = require('mockery');
var assert = require('assert');
var testUtils = require('../testUtils');
var path;
var MODULE_UNDER_TEST = '../../src/chrome/chromeUtils';
suite('ChromeUtils', function () {
    function getChromeUtils() {
        return require(MODULE_UNDER_TEST);
    }
    setup(function () {
        testUtils.setupUnhandledRejectionListener();
        mockery.enable({ useCleanCache: true, warnOnReplace: false, warnOnUnregistered: false });
        testUtils.registerWin32Mocks();
        mockery.registerMock('fs', { statSync: function () { } });
        testUtils.registerEmptyMocks('http');
        // Get path with win32 mocks
        path = require('path');
    });
    teardown(function () {
        testUtils.removeUnhandledRejectionListener();
        mockery.deregisterAll();
        mockery.disable();
    });
    suite('targetUrlToClientPath()', function () {
        var TEST_CLIENT_PATH = 'c:\\site\\scripts\\a.js';
        var TEST_TARGET_LOCAL_URL = 'file:///' + TEST_CLIENT_PATH;
        var TEST_TARGET_HTTP_URL = 'http://site.com/page/scripts/a.js';
        var TEST_WEB_ROOT = 'c:\\site';
        test('an empty string is returned for a missing url', function () {
            assert.equal(getChromeUtils().targetUrlToClientPath('', ''), '');
        });
        test('an empty string is returned when the webRoot is missing', function () {
            assert.equal(getChromeUtils().targetUrlToClientPath(null, TEST_TARGET_HTTP_URL), '');
        });
        test('a url without a path returns an empty string', function () {
            assert.equal(getChromeUtils().targetUrlToClientPath(TEST_WEB_ROOT, 'http://site.com'), '');
        });
        test('it searches the disk for a path that exists, built from the url', function () {
            var statSync = function (aPath) {
                if (aPath !== TEST_CLIENT_PATH)
                    throw new Error('Not found');
            };
            mockery.registerMock('fs', { statSync: statSync });
            assert.equal(getChromeUtils().targetUrlToClientPath(TEST_WEB_ROOT, TEST_TARGET_HTTP_URL), TEST_CLIENT_PATH);
        });
        test("returns an empty string when it can't resolve a url", function () {
            var statSync = function (aPath) {
                throw new Error('Not found');
            };
            mockery.registerMock('fs', { statSync: statSync });
            assert.equal(getChromeUtils().targetUrlToClientPath(TEST_WEB_ROOT, TEST_TARGET_HTTP_URL), '');
        });
        test('file:/// urls are returned canonicalized', function () {
            assert.equal(getChromeUtils().targetUrlToClientPath('', TEST_TARGET_LOCAL_URL), TEST_CLIENT_PATH);
        });
        test('uri encodings are fixed for file:/// paths', function () {
            var clientPath = 'c:\\project\\path with spaces\\script.js';
            assert.equal(getChromeUtils().targetUrlToClientPath(TEST_WEB_ROOT, 'file:///' + encodeURI(clientPath)), clientPath);
        });
        test('uri encodings are fixed in URLs', function () {
            var pathSegment = 'path with spaces\\script.js';
            var url = 'http:\\' + encodeURIComponent(pathSegment);
            assert.equal(getChromeUtils().targetUrlToClientPath(TEST_WEB_ROOT, url), path.join(TEST_WEB_ROOT, pathSegment));
        });
    });
    suite('remoteObjectToValue()', function () {
        var TEST_OBJ_ID = 'objectId';
        function testRemoteObjectToValue(obj, value, variableHandleRef, stringify) {
            var Utilities = getChromeUtils();
            assert.deepEqual(Utilities.remoteObjectToValue(obj, stringify), { value: value, variableHandleRef: variableHandleRef });
        }
        test('bool', function () {
            testRemoteObjectToValue({ type: 'boolean', value: true }, 'true');
        });
        test('string', function () {
            var value = 'test string';
            testRemoteObjectToValue({ type: 'string', value: value }, "\"" + value + "\"");
            testRemoteObjectToValue({ type: 'string', value: value }, "" + value, undefined, /*stringify=*/ false);
            value = 'test string\r\nwith\nnewlines\n\n';
            var expValue = 'test string\\r\\nwith\\nnewlines\\n\\n';
            testRemoteObjectToValue({ type: 'string', value: value }, "\"" + expValue + "\"");
        });
        test('number', function () {
            testRemoteObjectToValue({ type: 'number', value: 1, description: '1' }, '1');
        });
        test('array', function () {
            var description = 'Array[2]';
            testRemoteObjectToValue({ type: 'object', description: description, objectId: TEST_OBJ_ID }, description, TEST_OBJ_ID);
        });
        test('regexp', function () {
            var description = '/^asdf/g';
            testRemoteObjectToValue({ type: 'object', description: description, objectId: TEST_OBJ_ID }, description, TEST_OBJ_ID);
        });
        test('symbol', function () {
            var description = 'Symbol(s)';
            testRemoteObjectToValue({ type: 'symbol', description: description, objectId: TEST_OBJ_ID }, description);
        });
        test('function', function () {
            // ES6 arrow fn
            testRemoteObjectToValue({ type: 'function', description: '() => {\n  var x = 1;\n  var y = 1;\n}', objectId: TEST_OBJ_ID }, '() => { … }');
            // named fn
            testRemoteObjectToValue({ type: 'function', description: 'function asdf() {\n  var z = 5;\n}' }, 'function asdf() { … }');
            // anonymous fn
            testRemoteObjectToValue({ type: 'function', description: 'function () {\n  var z = 5;\n}' }, 'function () { … }');
        });
        test('undefined', function () {
            testRemoteObjectToValue({ type: 'undefined' }, 'undefined');
        });
        test('null', function () {
            testRemoteObjectToValue({ type: 'object', subtype: 'null' }, 'null');
        });
    });
    suite('getMatchingTargets()', function () {
        var chromeUtils = getChromeUtils();
        function makeTargets() {
            var urls = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                urls[_i - 0] = arguments[_i];
            }
            // Only the url prop is used
            return urls.map(function (url) { return ({ url: url }); });
        }
        test('tries exact match before fuzzy match', function () {
            var targets = makeTargets('http://localhost/site/page', 'http://localhost/site');
            assert.deepEqual(chromeUtils.getMatchingTargets(targets, 'http://localhost/site'), [targets[1]]);
        });
        test('returns fuzzy matches if exact match fails', function () {
            var targets = makeTargets('http://localhost:8080/site/app/page1?something=3', 'http://cnn.com', 'http://localhost/site');
            assert.deepEqual(chromeUtils.getMatchingTargets(targets, 'http://localhost'), [targets[0], targets[2]]);
        });
        test('ignores the url protocol', function () {
            var targets = makeTargets('https://outlook.com', 'http://localhost');
            assert.deepEqual(chromeUtils.getMatchingTargets(targets, 'https://localhost'), [targets[1]]);
        });
        test('"exact match" is case-insensitive', function () {
            var targets = makeTargets('http://localhost/site', 'http://localhost');
            assert.deepEqual(chromeUtils.getMatchingTargets(targets, 'http://Localhost'), [targets[1]]);
        });
        test('ignores query params', function () {
            var targets = makeTargets('http://testsite.com?q=5');
            assert.deepEqual(chromeUtils.getMatchingTargets(targets, 'testsite.com?q=1'), targets);
        });
    });
});

//# sourceMappingURL=chromeUtils.test.js.map
