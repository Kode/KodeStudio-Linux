"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const tmp = require("tmp");
const ts = require("vscode-chrome-debug-core-testsupport");
const DEBUG_ADAPTER = './out/src/chromeDebug.js';
let testLaunchProps;
function formLaunchArgs(launchArgs) {
    launchArgs.trace = 'verbose';
    launchArgs.disableNetworkCache = true;
    // Start with a clean userDataDir for each test run
    const tmpDir = tmp.dirSync({ prefix: 'chrome2-' });
    launchArgs.userDataDir = tmpDir.name;
    if (testLaunchProps) {
        for (let key in testLaunchProps) {
            launchArgs[key] = testLaunchProps[key];
        }
        testLaunchProps = undefined;
    }
}
function patchLaunchArgs(launchArgs) {
    formLaunchArgs(launchArgs);
}
exports.lowercaseDriveLetterDirname = __dirname.charAt(0).toLowerCase() + __dirname.substr(1);
exports.PROJECT_ROOT = path.join(exports.lowercaseDriveLetterDirname, '../../../');
exports.DATA_ROOT = path.join(exports.PROJECT_ROOT, 'testdata/');
function setup(port, launchProps) {
    if (launchProps) {
        testLaunchProps = launchProps;
    }
    return ts.setup(DEBUG_ADAPTER, 'chrome', patchLaunchArgs, port);
}
exports.setup = setup;
function teardown() {
    return ts.teardown();
}
exports.teardown = teardown;

//# sourceMappingURL=testSetup.js.map
