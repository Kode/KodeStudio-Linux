/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
const vscode_chrome_debug_core_1 = require('vscode-chrome-debug-core');
const path = require('path');
const chromeDebugAdapter_1 = require('./chromeDebugAdapter');
const EXTENSION_NAME = 'debugger-for-chrome';
const targetFilter = target => target && (!target.type || target.type === 'page');
let versionWithDefault = typeof VERSION === 'undefined' ? 'unspecified' : VERSION; // Not built with webpack for tests
// non-.txt file types can't be uploaded to github
// also note that __dirname here is ...out/
const logFilePath = path.resolve(__dirname, '../vscode-chrome-debug.txt');
// Start a ChromeDebugSession configured to only match 'page' targets, which are Chrome tabs.
// Cast because DebugSession is declared twice - in this repo's vscode-debugadapter, and that of -core... TODO
vscode_chrome_debug_core_1.ChromeDebugSession.run(vscode_chrome_debug_core_1.ChromeDebugSession.getSession({
    adapter: chromeDebugAdapter_1.ChromeDebugAdapter,
    extensionName: EXTENSION_NAME,
    logFilePath,
    targetFilter,
    pathTransformer: vscode_chrome_debug_core_1.UrlPathTransformer,
    sourceMapTransformer: vscode_chrome_debug_core_1.BaseSourceMapTransformer,
}));
// logger.log(EXTENSION_NAME + ': ' + versionWithDefault); // This would crash because we do not use webpack
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/ebff2335d0f58a5b01ac50cb66737f4694ec73f3/extensions/chrome-debug/out/chromeDebug.js.map
