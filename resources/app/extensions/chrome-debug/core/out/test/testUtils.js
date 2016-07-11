/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
var typemoq_1 = require('typemoq');
var path = require('path');
var mockery = require('mockery');
var fs = require('fs');
function setupUnhandledRejectionListener() {
    process.addListener('unhandledRejection', unhandledRejectionListener);
}
exports.setupUnhandledRejectionListener = setupUnhandledRejectionListener;
function removeUnhandledRejectionListener() {
    process.removeListener('unhandledRejection', unhandledRejectionListener);
}
exports.removeUnhandledRejectionListener = removeUnhandledRejectionListener;
function unhandledRejectionListener(reason, p) {
    console.log('*');
    console.log('**');
    console.log('***');
    console.log('****');
    console.log('*****');
    console.log("ERROR!! Unhandled promise rejection, a previous test may have failed but reported success.");
    console.log(reason.toString());
    console.log('*****');
    console.log('****');
    console.log('***');
    console.log('**');
    console.log('*');
}
var MockEvent = (function () {
    function MockEvent(event, body) {
        this.event = event;
        this.body = body;
        this.seq = 0;
        this.type = 'event';
    }
    return MockEvent;
}());
exports.MockEvent = MockEvent;
function registerEmptyMocks() {
    var moduleNames = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        moduleNames[_i - 0] = arguments[_i];
    }
    moduleNames.forEach(function (name) {
        mockery.registerMock(name, {});
    });
}
exports.registerEmptyMocks = registerEmptyMocks;
function getStackTraceResponseBody(aPath, lines, sourceReferences) {
    if (sourceReferences === void 0) { sourceReferences = []; }
    return {
        stackFrames: lines.map(function (line, i) { return ({
            id: i,
            name: 'line ' + i,
            line: line,
            column: 0,
            source: {
                path: aPath,
                name: path.basename(aPath),
                sourceReference: sourceReferences[i] || 0
            }
        }); })
    };
}
exports.getStackTraceResponseBody = getStackTraceResponseBody;
/**
 * Some tests use this to override 'os' and 'path' with the windows versions for consistency when running on different
 * platforms. For other tests, it either doesn't matter, or they have platform-specific test code.
 */
function registerWin32Mocks() {
    mockery.registerMock('os', { platform: function () { return 'win32'; } });
    mockery.registerMock('path', path.win32);
}
exports.registerWin32Mocks = registerWin32Mocks;
function registerOSXMocks() {
    mockery.registerMock('os', { platform: function () { return 'darwin'; } });
    mockery.registerMock('path', path.posix);
}
exports.registerOSXMocks = registerOSXMocks;
/**
 * path.resolve + fixing the drive letter to match what VS Code does. Basically tests can use this when they
 * want to force a path to native slashes and the correct letter case, but maybe can't use un-mocked utils.
 */
function pathResolve() {
    var segments = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        segments[_i - 0] = arguments[_i];
    }
    var aPath = path.resolve.apply(null, segments);
    if (aPath.match(/^[A-Za-z]:/)) {
        aPath = aPath[0].toLowerCase() + aPath.substr(1);
    }
    return aPath;
}
exports.pathResolve = pathResolve;
function registerMockReadFile() {
    var entries = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        entries[_i - 0] = arguments[_i];
    }
    var fsMock = typemoq_1.Mock.ofInstance(fs, typemoq_1.MockBehavior.Strict);
    mockery.registerMock('fs', fsMock.object);
    entries.forEach(function (entry) {
        fsMock
            .setup(function (x) { return x.readFile(typemoq_1.It.isValue(entry.absPath), typemoq_1.It.isAny()); })
            .callback(function (path, callback) { return callback(null, entry.data); });
    });
}
exports.registerMockReadFile = registerMockReadFile;

//# sourceMappingURL=testUtils.js.map
