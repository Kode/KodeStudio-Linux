/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
var mockery = require('mockery');
var assert = require('assert');
var testUtils = require('../testUtils');
var path;
var MODULE_UNDER_TEST = '../../webkit/utilities';
suite('Utilities', function () {
    function getUtilities() {
        return require(MODULE_UNDER_TEST);
    }
    setup(function () {
        testUtils.setupUnhandledRejectionListener();
        mockery.enable({ useCleanCache: true, warnOnReplace: false });
        testUtils.win32Mocks();
        mockery.registerMock('fs', { statSync: function () { } });
        mockery.registerMock('http', {});
        path = require('path');
        mockery.registerAllowables([
            'url', MODULE_UNDER_TEST]);
    });
    teardown(function () {
        testUtils.removeUnhandledRejectionListener();
        mockery.deregisterAll();
        mockery.disable();
    });
    suite('getPlatform()/getBrowserPath()', function () {
        test('osx', function () {
            mockery.registerMock('os', { platform: function () { return 'darwin'; } });
            var Utilities = getUtilities();
            assert.equal(Utilities.getPlatform(), 1 /* OSX */);
            assert.equal(Utilities.getBrowserPath(), '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome');
        });
        test('win', function () {
            // Overwrite the statSync mock to say the x86 path doesn't exist
            var statSync = function (aPath) {
                if (aPath.indexOf('(x86)') >= 0)
                    throw new Error('Not found');
            };
            mockery.registerMock('fs', { statSync: statSync });
            var Utilities = getUtilities();
            assert.equal(Utilities.getPlatform(), 0 /* Windows */);
            assert.equal(Utilities.getBrowserPath(), 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe');
        });
        test('winx86', function () {
            var Utilities = getUtilities();
            assert.equal(Utilities.getPlatform(), 0 /* Windows */);
            assert.equal(Utilities.getBrowserPath(), 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe');
        });
        test('linux', function () {
            mockery.registerMock('os', { platform: function () { return 'linux'; } });
            var Utilities = getUtilities();
            assert.equal(Utilities.getPlatform(), 2 /* Linux */);
            assert.equal(Utilities.getBrowserPath(), '/usr/bin/google-chrome');
        });
        test('freebsd (default to Linux for anything unknown)', function () {
            mockery.registerMock('os', { platform: function () { return 'freebsd'; } });
            var Utilities = getUtilities();
            assert.equal(Utilities.getPlatform(), 2 /* Linux */);
            assert.equal(Utilities.getBrowserPath(), '/usr/bin/google-chrome');
        });
    });
    suite('existsSync()', function () {
        test('it returns false when statSync throws', function () {
            var statSync = function (aPath) {
                if (aPath.indexOf('notfound') >= 0)
                    throw new Error('Not found');
            };
            mockery.registerMock('fs', { statSync: statSync });
            var Utilities = getUtilities();
            assert.equal(Utilities.existsSync('exists'), true);
            assert.equal(Utilities.existsSync('thisfilenotfound'), false);
        });
    });
    suite('reversedArr()', function () {
        test('it does not modify the input array', function () {
            var arr = [2, 4, 6];
            getUtilities().reversedArr(arr);
            assert.deepEqual(arr, [2, 4, 6]);
            arr = [1];
            getUtilities().reversedArr(arr);
            assert.deepEqual(arr, [1]);
        });
        test('it reverses the array', function () {
            assert.deepEqual(getUtilities().reversedArr([1, 3, 5, 7]), [7, 5, 3, 1]);
            assert.deepEqual(getUtilities().reversedArr([-1, 'hello', null, undefined, [1, 2]]), [[1, 2], undefined, null, 'hello', -1]);
        });
    });
    suite('promiseTimeout()', function () {
        test('when given a promise it fails if the promise never resolves', function () {
            return getUtilities().promiseTimeout(new Promise(function () { }), 5).then(function () { return assert.fail('This promise should fail'); }, function (e) { });
        });
        test('when given a promise it succeeds if the promise resolves', function () {
            return getUtilities().promiseTimeout(Promise.resolve('test'), 5).then(function (result) {
                assert.equal(result, 'test');
            }, function (e) { return assert.fail('This promise should pass'); });
        });
        test('when not given a promise it resolves', function () {
            return getUtilities().promiseTimeout(null, 5).then(null, function () { return assert.fail('This promise should pass'); });
        });
    });
    suite('retryAsync()', function () {
        test('when the function passes, it resolves with the value', function () {
            return getUtilities().retryAsync(function () { return Promise.resolve('pass'); }, /*timeoutMs=*/ 5).then(function (result) {
                assert.equal(result, 'pass');
            }, function (e) {
                assert.fail('This should have passed');
            });
        });
        test('when the function fails, it rejects', function () {
            return getUtilities().retryAsync(function () { return getUtilities().errP('fail'); }, /*timeoutMs=*/ 5)
                .then(function () { return assert.fail('This promise should fail'); }, function (e) { return assert.equal(e.message, 'fail'); });
        });
    });
    suite('webkitUrlToClientPath()', function () {
        var TEST_CLIENT_PATH = 'c:\\site\\scripts\\a.js';
        var TEST_WEBKIT_LOCAL_URL = 'file:///' + TEST_CLIENT_PATH;
        var TEST_WEBKIT_HTTP_URL = 'http://site.com/page/scripts/a.js';
        var TEST_WEB_ROOT = 'c:\\site';
        test('an empty string is returned for a missing url', function () {
            assert.equal(getUtilities().webkitUrlToClientPath('', ''), '');
        });
        test('an empty string is returned when the webRoot is missing', function () {
            assert.equal(getUtilities().webkitUrlToClientPath(null, TEST_WEBKIT_HTTP_URL), '');
        });
        test('a url without a path returns an empty string', function () {
            assert.equal(getUtilities().webkitUrlToClientPath(TEST_WEB_ROOT, 'http://site.com'), '');
        });
        test('it searches the disk for a path that exists, built from the url', function () {
            var statSync = function (aPath) {
                if (aPath !== TEST_CLIENT_PATH)
                    throw new Error('Not found');
            };
            mockery.registerMock('fs', { statSync: statSync });
            assert.equal(getUtilities().webkitUrlToClientPath(TEST_WEB_ROOT, TEST_WEBKIT_HTTP_URL), TEST_CLIENT_PATH);
        });
        test("returns an empty string when it can't resolve a url", function () {
            var statSync = function (aPath) {
                throw new Error('Not found');
            };
            mockery.registerMock('fs', { statSync: statSync });
            assert.equal(getUtilities().webkitUrlToClientPath(TEST_WEB_ROOT, TEST_WEBKIT_HTTP_URL), '');
        });
        test('file:/// urls are returned canonicalized', function () {
            assert.equal(getUtilities().webkitUrlToClientPath('', TEST_WEBKIT_LOCAL_URL), TEST_CLIENT_PATH);
        });
        test('uri encodings are fixed for file:/// paths', function () {
            var clientPath = 'c:\\project\\path with spaces\\script.js';
            assert.equal(getUtilities().webkitUrlToClientPath(TEST_WEB_ROOT, 'file:///' + encodeURI(clientPath)), clientPath);
        });
        test('uri encodings are fixed in URLs', function () {
            var pathSegment = 'path with spaces\\script.js';
            var url = 'http:\\' + encodeURIComponent(pathSegment);
            assert.equal(getUtilities().webkitUrlToClientPath(TEST_WEB_ROOT, url), path.join(TEST_WEB_ROOT, pathSegment));
        });
    });
    suite('canonicalizeUrl()', function () {
        function testCanUrl(inUrl, expectedUrl) {
            var Utilities = getUtilities();
            assert.equal(Utilities.canonicalizeUrl(inUrl), expectedUrl);
        }
        test('enforces path.sep slash', function () {
            testCanUrl('c:\\thing\\file.js', 'c:\\thing\\file.js');
            testCanUrl('c:/thing/file.js', 'c:\\thing\\file.js');
        });
        test('removes file:///', function () {
            testCanUrl('file:///c:/file.js', 'c:\\file.js');
        });
        test('ensures local path starts with / on OSX', function () {
            mockery.registerMock('os', { platform: function () { return 'darwin'; } });
            testCanUrl('file:///Users/scripts/app.js', '/Users/scripts/app.js');
        });
        test('force lowercase drive letter on Win to match VS Code', function () {
            // note default 'os' mock is win32
            testCanUrl('file:///D:/FILE.js', 'd:\\FILE.js');
        });
        test('http:// url - no change', function () {
            var url = 'http://site.com/My/Cool/Site/script.js?stuff';
            testCanUrl(url, url);
        });
        test('strips trailing slash', function () {
            testCanUrl('http://site.com/', 'http://site.com');
        });
    });
    suite('fixDriveLetterAndSlashes', function () {
        test('works for c:/... cases', function () {
            assert.equal(getUtilities().fixDriveLetterAndSlashes('C:/path/stuff'), 'c:\\path\\stuff');
            assert.equal(getUtilities().fixDriveLetterAndSlashes('c:/path\\stuff'), 'c:\\path\\stuff');
            assert.equal(getUtilities().fixDriveLetterAndSlashes('C:\\path'), 'c:\\path');
            assert.equal(getUtilities().fixDriveLetterAndSlashes('C:\\'), 'c:\\');
        });
        test('works for file:/// cases', function () {
            assert.equal(getUtilities().fixDriveLetterAndSlashes('file:///C:/path/stuff'), 'file:///c:\\path\\stuff');
            assert.equal(getUtilities().fixDriveLetterAndSlashes('file:///c:/path\\stuff'), 'file:///c:\\path\\stuff');
            assert.equal(getUtilities().fixDriveLetterAndSlashes('file:///C:\\path'), 'file:///c:\\path');
            assert.equal(getUtilities().fixDriveLetterAndSlashes('file:///C:\\'), 'file:///c:\\');
        });
    });
    suite('remoteObjectToValue()', function () {
        var TEST_OBJ_ID = 'objectId';
        function testRemoteObjectToValue(obj, value, variableHandleRef, stringify) {
            var Utilities = getUtilities();
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
    suite('getWebRoot()', function () {
        test('takes absolute webRoot as is', function () {
            assert.equal(getUtilities().getWebRoot({ webRoot: 'c:\\project\\webRoot', cwd: 'c:\\project\\cwd' }), 'c:\\project\\webRoot');
        });
        test('resolves relative webroot against cwd', function () {
            assert.equal(getUtilities().getWebRoot({ webRoot: '..\\webRoot', cwd: 'c:\\project\\cwd' }), 'c:\\project\\webRoot');
        });
        test('uses cwd when webRoot is missing', function () {
            assert.equal(getUtilities().getWebRoot({ webRoot: '', cwd: 'c:\\project\\cwd' }), 'c:\\project\\cwd');
        });
    });
    suite('getUrl', function () {
        var URL = 'http://testsite.com/testfile';
        var RESPONSE = 'response';
        function registerMockHTTP(dataResponses, error) {
            mockery.registerMock('http', { get: function (url, callback) {
                    assert.equal(url, URL);
                    if (error) {
                        return { on: function (eventName, eventCallback) {
                                if (eventName === 'error') {
                                    eventCallback(error);
                                }
                            } };
                    }
                    else {
                        callback({
                            statusCode: 200,
                            on: function (eventName, eventCallback) {
                                if (eventName === 'data') {
                                    dataResponses.forEach(eventCallback);
                                }
                                else if (eventName === 'end') {
                                    setTimeout(eventCallback, 0);
                                }
                            } });
                        return { on: function () { } };
                    }
                } });
        }
        test('combines chunks', function () {
            // Create a mock http.get that provides data in two chunks
            registerMockHTTP(['res', 'ponse']);
            return getUtilities().getURL(URL).then(function (response) {
                assert.equal(response, RESPONSE);
            });
        });
        test('rejects the promise on an error', function () {
            registerMockHTTP(undefined, 'fail');
            return getUtilities().getURL(URL).then(function (response) {
                assert.fail('Should not be resolved');
            }, function (e) {
                assert.equal(e, 'fail');
            });
        });
    });
    suite('isURL', function () {
        function assertIsURL(url) {
            assert(getUtilities().isURL(url));
        }
        function assertNotURL(url) {
            assert(!getUtilities().isURL(url));
        }
        test('returns true for URLs', function () {
            assertIsURL('http://localhost');
            assertIsURL('http://mysite.com');
            assertIsURL('file:///c:/project/code.js');
            assertIsURL('webpack:///webpack/webpackthing');
            assertIsURL('https://a.b.c:123/asdf?fsda');
        });
        test('returns false for not-URLs', function () {
            assertNotURL('a');
            assertNotURL('/project/code.js');
            assertNotURL('c:/project/code.js');
            assertNotURL('abc123!@#');
            assertNotURL('');
            assertNotURL(null);
        });
    });
    suite('lstrip', function () {
        test('does what it says', function () {
            assert.equal(getUtilities().lstrip('test', 'te'), 'st');
            assert.equal(getUtilities().lstrip('asdf', ''), 'asdf');
            assert.equal(getUtilities().lstrip('asdf', null), 'asdf');
            assert.equal(getUtilities().lstrip('asdf', 'asdf'), '');
            assert.equal(getUtilities().lstrip('asdf', '123'), 'asdf');
            assert.equal(getUtilities().lstrip('asdf', 'sdf'), 'asdf');
        });
    });
    suite('pathToFileURL', function () {
        test('converts windows-style paths', function () {
            assert.equal(getUtilities().pathToFileURL('c:/code/app.js'), 'file:///c:/code/app.js');
        });
        test('converts unix-style paths', function () {
            assert.equal(getUtilities().pathToFileURL('/code/app.js'), 'file:///code/app.js');
        });
    });
});

//# sourceMappingURL=utilities.test.js.map
