/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
var chromeConnection_1 = require('../../src/chrome/chromeConnection');
var mockery = require('mockery');
var events_1 = require('events');
var assert = require('assert');
var typemoq_1 = require('typemoq');
var testUtils = require('../testUtils');
var utils = require('../../src/utils');
var MODULE_UNDER_TEST = '../../src/chrome/chromeDebugAdapter';
suite('ChromeDebugAdapter', function () {
    var ATTACH_ARGS = { port: 9222 };
    var mockChromeConnection;
    var mockEventEmitter;
    var chromeDebugAdapter;
    setup(function () {
        testUtils.setupUnhandledRejectionListener();
        mockery.enable({ useCleanCache: true, warnOnReplace: false, warnOnUnregistered: false });
        testUtils.registerWin32Mocks();
        testUtils.registerEmptyMocks('child_process', 'url', 'path', 'net', 'fs', 'http');
        // Create a ChromeConnection mock with .on and .attach. Tests can fire events via mockEventEmitter
        mockEventEmitter = new events_1.EventEmitter();
        mockChromeConnection = typemoq_1.Mock.ofType(chromeConnection_1.ChromeConnection, typemoq_1.MockBehavior.Strict);
        mockChromeConnection
            .setup(function (x) { return x.on(typemoq_1.It.isAnyString(), typemoq_1.It.isAny()); })
            .callback(function (eventName, handler) { return mockEventEmitter.on(eventName, handler); });
        mockChromeConnection
            .setup(function (x) { return x.attach(typemoq_1.It.isAnyNumber(), typemoq_1.It.isValue(undefined), typemoq_1.It.isValue(undefined)); })
            .returns(function () { return Promise.resolve(); });
        mockChromeConnection
            .setup(function (x) { return x.isAttached; })
            .returns(function () { return false; });
        // Instantiate the ChromeDebugAdapter, injecting the mock ChromeConnection
        chromeDebugAdapter = new (require(MODULE_UNDER_TEST).ChromeDebugAdapter)(mockChromeConnection.object);
    });
    teardown(function () {
        testUtils.removeUnhandledRejectionListener();
        mockery.deregisterAll();
        mockery.disable();
        mockChromeConnection.verifyAll();
    });
    suite('attach()', function () {
        test('if successful, an initialized event is fired', function () {
            var initializedFired = false;
            chromeDebugAdapter.registerEventHandler(function (event) {
                if (event.event === 'initialized') {
                    initializedFired = true;
                }
                else {
                    assert.fail('An unexpected event was fired');
                }
            });
            return chromeDebugAdapter.attach(ATTACH_ARGS).then(function () {
                assert(initializedFired, 'Attach completed without firing the initialized event');
            });
        });
        test('if unsuccessful, the promise is rejected and an initialized event is not fired', function () {
            mockChromeConnection
                .setup(function (x) { return x.attach(typemoq_1.It.isAnyNumber()); })
                .returns(function () { return utils.errP('Testing attach failed'); });
            chromeDebugAdapter.registerEventHandler(function (event) {
                assert.fail('Not expecting any event in this scenario');
            });
            return chromeDebugAdapter.attach(ATTACH_ARGS).then(function () { return assert.fail('Expecting promise to be rejected'); }, function (e) { });
        });
    });
    suite('setBreakpoints()', function () {
        var BP_ID = 'bpId';
        var FILE_NAME = 'file:///a.js';
        var SCRIPT_ID = '1';
        function expectSetBreakpoint(lines, cols, url, scriptId) {
            if (scriptId === void 0) { scriptId = SCRIPT_ID; }
            lines.forEach(function (lineNumber, i) {
                var columnNumber = cols[i];
                if (url) {
                    mockChromeConnection
                        .setup(function (x) { return x.debugger_setBreakpointByUrl(url, lineNumber, columnNumber); })
                        .returns(function (location) { return Promise.resolve({ id: 0, result: { breakpointId: BP_ID + i, locations: [{ scriptId: scriptId, lineNumber: lineNumber, columnNumber: columnNumber }] } }); })
                        .verifiable();
                }
                else {
                    mockChromeConnection
                        .setup(function (x) { return x.debugger_setBreakpoint(typemoq_1.It.isAny()); })
                        .returns(function (location) { return Promise.resolve({ id: 0, result: { breakpointId: BP_ID + i, actualLocation: { scriptId: scriptId, lineNumber: lineNumber, columnNumber: columnNumber } } }); })
                        .verifiable();
                }
            });
        }
        function expectRemoveBreakpoint(indicies) {
            indicies.forEach(function (i) {
                mockChromeConnection
                    .setup(function (x) { return x.debugger_removeBreakpoint(typemoq_1.It.isValue(BP_ID + i)); })
                    .returns(function () { return Promise.resolve({ id: 0 }); })
                    .verifiable();
            });
        }
        function makeExpectedResponse(lines, cols) {
            var breakpoints = lines.map(function (line, i) { return ({
                line: line,
                column: cols ? cols[i] : 0,
                verified: true
            }); });
            return { breakpoints: breakpoints };
        }
        function emitScriptParsed(url, scriptId) {
            if (url === void 0) { url = FILE_NAME; }
            if (scriptId === void 0) { scriptId = SCRIPT_ID; }
            mockEventEmitter.emit('Debugger.scriptParsed', { scriptId: scriptId, url: url });
        }
        test('When setting one breakpoint, returns the correct result', function () {
            var lines = [5];
            var cols = [6];
            expectSetBreakpoint(lines, cols, FILE_NAME);
            return chromeDebugAdapter.attach(ATTACH_ARGS)
                .then(function () { return emitScriptParsed(); })
                .then(function () { return chromeDebugAdapter.setBreakpoints({ source: { path: FILE_NAME }, lines: lines, cols: cols }); })
                .then(function (response) { return assert.deepEqual(response, makeExpectedResponse(lines, cols)); });
        });
        test('When setting multiple breakpoints, returns the correct result', function () {
            var lines = [14, 200, 151];
            var cols = [33, 16, 1];
            expectSetBreakpoint(lines, cols, FILE_NAME);
            return chromeDebugAdapter.attach(ATTACH_ARGS)
                .then(function () { return emitScriptParsed(); })
                .then(function () { return chromeDebugAdapter.setBreakpoints({ source: { path: FILE_NAME }, lines: lines, cols: cols }); })
                .then(function (response) { return assert.deepEqual(response, makeExpectedResponse(lines, cols)); });
        });
        test('The adapter clears all previous breakpoints in a script before setting the new ones', function () {
            var lines = [14, 200];
            var cols = [33, 16];
            expectSetBreakpoint(lines, cols, FILE_NAME);
            return chromeDebugAdapter.attach(ATTACH_ARGS)
                .then(function () { return emitScriptParsed(); })
                .then(function () { return chromeDebugAdapter.setBreakpoints({ source: { path: FILE_NAME }, lines: lines, cols: cols }); })
                .then(function (response) {
                lines.push(321);
                cols.push(123);
                expectRemoveBreakpoint([0, 1]);
                expectSetBreakpoint(lines, cols, FILE_NAME);
                return chromeDebugAdapter.setBreakpoints({ source: { path: FILE_NAME }, lines: lines, cols: cols });
            })
                .then(function (response) { return assert.deepEqual(response, makeExpectedResponse(lines, cols)); });
        });
        test('The adapter handles removing a breakpoint', function () {
            var lines = [14, 200];
            var cols = [33, 16];
            expectSetBreakpoint(lines, cols, FILE_NAME);
            return chromeDebugAdapter.attach(ATTACH_ARGS)
                .then(function () { return emitScriptParsed(); })
                .then(function () { return chromeDebugAdapter.setBreakpoints({ source: { path: FILE_NAME }, lines: lines, cols: cols }); })
                .then(function (response) {
                lines.shift();
                cols.shift();
                expectRemoveBreakpoint([0, 1]);
                expectSetBreakpoint(lines, cols, FILE_NAME);
                return chromeDebugAdapter.setBreakpoints({ source: { path: FILE_NAME }, lines: lines, cols: cols });
            })
                .then(function (response) { return assert.deepEqual(response, makeExpectedResponse(lines, cols)); });
        });
        test('After a page refresh, clears the newly resolved breakpoints before adding new ones', function () {
            var lines = [14, 200];
            var cols = [33, 16];
            expectSetBreakpoint(lines, cols, FILE_NAME);
            return chromeDebugAdapter.attach(ATTACH_ARGS)
                .then(function () { return emitScriptParsed(); })
                .then(function () { return chromeDebugAdapter.setBreakpoints({ source: { path: FILE_NAME }, lines: lines, cols: cols }); })
                .then(function (response) {
                expectRemoveBreakpoint([2, 3]);
                mockEventEmitter.emit('Debugger.globalObjectCleared');
                mockEventEmitter.emit('Debugger.scriptParsed', { scriptId: 'afterRefreshScriptId', url: FILE_NAME });
                mockEventEmitter.emit('Debugger.breakpointResolved', { breakpointId: BP_ID + 2, location: { scriptId: 'afterRefreshScriptId' } });
                mockEventEmitter.emit('Debugger.breakpointResolved', { breakpointId: BP_ID + 3, location: { scriptId: 'afterRefreshScriptId' } });
                lines.push(321);
                cols.push(123);
                expectSetBreakpoint(lines, cols, FILE_NAME, 'afterRefreshScriptId');
                return chromeDebugAdapter.setBreakpoints({ source: { path: FILE_NAME }, lines: lines, cols: cols });
            })
                .then(function (response) { return assert.deepEqual(response, makeExpectedResponse(lines, cols)); });
        });
        test('returns the actual location specified by the runtime', function () {
            var lines = [5];
            var cols = [6];
            // Set up the mock to return a different location
            var location = {
                scriptId: SCRIPT_ID, lineNumber: lines[0] + 10, columnNumber: cols[0] + 10 };
            var expectedResponse = {
                breakpoints: [{ line: location.lineNumber, column: location.columnNumber, verified: true }] };
            mockChromeConnection
                .setup(function (x) { return x.debugger_setBreakpointByUrl(FILE_NAME, lines[0], cols[0]); })
                .returns(function () { return Promise.resolve({ id: 0, result: { breakpointId: BP_ID, locations: [location] } }); })
                .verifiable();
            return chromeDebugAdapter.attach(ATTACH_ARGS)
                .then(function () { return emitScriptParsed(); })
                .then(function () { return chromeDebugAdapter.setBreakpoints({ source: { path: FILE_NAME }, lines: lines, cols: cols }); })
                .then(function (response) { return assert.deepEqual(response, expectedResponse); });
        });
        test('setting breakpoints in a sourcemapped eval script handles the placeholder url', function () {
            var lines = [5];
            var cols = [6];
            expectSetBreakpoint(lines, cols, '');
            return chromeDebugAdapter.attach(ATTACH_ARGS)
                .then(function () { return emitScriptParsed(/*url=*/ '', SCRIPT_ID); })
                .then(function () { return chromeDebugAdapter.setBreakpoints({ source: { path: 'debugadapter://' + SCRIPT_ID }, lines: lines, cols: cols }); })
                .then(function (response) { return assert.deepEqual(response, makeExpectedResponse(lines, cols)); });
        });
    });
    suite('launch()', function () {
        test('launches with minimal correct args', function () {
            var spawnCalled = false;
            function spawn(chromePath, args) {
                // Just assert that the chrome path is some string with 'chrome' in the path, and there are >0 args
                assert(chromePath.toLowerCase().indexOf('chrome') >= 0);
                assert(args.indexOf('--remote-debugging-port=9222') >= 0);
                assert(args.indexOf('file:///c:/path%20with%20space/index.html') >= 0);
                assert(args.indexOf('abc') >= 0);
                assert(args.indexOf('def') >= 0);
                spawnCalled = true;
                return { on: function () { }, unref: function () { } };
            }
            // Mock spawn for chrome process, and 'fs' for finding chrome.exe.
            // These are mocked as empty above - note that it's too late for mockery here.
            require('child_process').spawn = spawn;
            require('fs').statSync = function () { return true; };
            mockChromeConnection
                .setup(function (x) { return x.attach(typemoq_1.It.isAnyNumber(), typemoq_1.It.isAnyString(), typemoq_1.It.isValue(undefined)); })
                .returns(function () { return Promise.resolve(); })
                .verifiable();
            return chromeDebugAdapter.launch({ file: 'c:\\path with space\\index.html', runtimeArgs: ['abc', 'def'] })
                .then(function () { return assert(spawnCalled); });
        });
    });
    suite('Console.messageAdded', function () {
        test('Fires an output event when a console message is added', function () {
            var testLog = 'Hello, world!';
            var outputEventFired = false;
            chromeDebugAdapter.registerEventHandler(function (event) {
                if (event.event === 'output') {
                    outputEventFired = true;
                    assert.equal(event.body.text, testLog);
                }
                else {
                    assert.fail('An unexpected event was fired');
                }
            });
            mockEventEmitter.emit('Console.onMessageAdded', {
                message: {
                    source: 'console-api',
                    level: 'log',
                    type: 'log',
                    text: testLog,
                    timestamp: Date.now(),
                    line: 2,
                    column: 13,
                    url: 'file:///c:/page/script.js',
                    executionContextId: 2,
                    parameters: [
                        { type: 'string', value: testLog }
                    ]
                }
            });
        });
    });
    suite('Debugger.scriptParsed', function () {
        var FILE_NAME = 'file:///a.js';
        var SCRIPT_ID = '1';
        function emitScriptParsed(url, scriptId, otherArgs) {
            if (url === void 0) { url = FILE_NAME; }
            if (scriptId === void 0) { scriptId = SCRIPT_ID; }
            if (otherArgs === void 0) { otherArgs = {}; }
            otherArgs.url = url;
            otherArgs.scriptId = scriptId;
            mockEventEmitter.emit('Debugger.scriptParsed', otherArgs);
        }
        test('adds default url when missing', function () {
            var scriptParsedFired = false;
            return chromeDebugAdapter.attach(ATTACH_ARGS).then(function () {
                chromeDebugAdapter.registerEventHandler(function (event) {
                    if (event.event === 'scriptParsed') {
                        // Assert that the event is fired with some scriptUrl
                        scriptParsedFired = true;
                        assert(event.body.scriptUrl);
                    }
                    else {
                        assert.fail('An unexpected event was fired: ' + event.event);
                    }
                });
                emitScriptParsed(/*url=*/ '');
                assert(scriptParsedFired);
            });
        });
        test('ignores internal scripts', function () {
            return chromeDebugAdapter.attach(ATTACH_ARGS).then(function () {
                chromeDebugAdapter.registerEventHandler(function (event) {
                    assert.fail('No event should be fired: ' + event.event);
                });
                emitScriptParsed(/*url=*/ '', undefined, { isInternalScript: true });
            });
        });
    });
    suite('setExceptionBreakpoints()', function () { });
    suite('stepping', function () { });
    suite('stackTrace()', function () { });
    suite('scopes()', function () { });
    suite('variables()', function () { });
    suite('source()', function () { });
    suite('threads()', function () { });
    suite('evaluate()', function () { });
    suite('Debugger.resume', function () { });
    suite('Debugger.pause', function () { });
    suite('target close/error/detach', function () { });
});

//# sourceMappingURL=chromeDebugAdapter.test.js.map
