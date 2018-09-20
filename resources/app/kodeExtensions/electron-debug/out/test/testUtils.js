"use strict";
/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const mockery = require("mockery");
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
    console.log(`ERROR!! Unhandled promise rejection, a previous test may have failed but reported success.`);
    console.log(reason.toString());
    console.log('*****');
    console.log('****');
    console.log('***');
    console.log('**');
    console.log('*');
}
/**
 * path.resolve + fixing the drive letter to match what VS Code does. Basically tests can use this when they
 * want to force a path to native slashes and the correct letter case, but maybe can't use un-mocked utils.
 */
function pathResolve(...segments) {
    let aPath = path.resolve.apply(null, segments);
    if (aPath.match(/^[A-Za-z]:/)) {
        aPath = aPath[0].toLowerCase() + aPath.substr(1);
    }
    return aPath;
}
exports.pathResolve = pathResolve;
function registerLocMocks() {
    mockery.registerMock('vscode-nls', {
        config: () => () => dummyLocalize,
        loadMessageBundle: () => dummyLocalize
    });
}
exports.registerLocMocks = registerLocMocks;
function dummyLocalize(id, englishString) {
    return englishString;
}

//# sourceMappingURL=testUtils.js.map
