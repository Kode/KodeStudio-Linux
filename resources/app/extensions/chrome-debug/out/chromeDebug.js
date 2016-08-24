/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
var core = require('../core');
var path = require('path');
// Start a ChromeDebugSession configured to only match 'page' targets, which are Chrome tabs
core.ChromeDebugSession.run(core.ChromeDebugSession.getSession({
    targetFilter: function (target) { return target && (!target.type || target.type === 'page'); },
    logFilePath: path.resolve(__dirname, '../vscode-chrome-debug.txt') // non-.txt file types can't be uploaded to github
}));
/* tslint:disable:no-var-requires */
core.logger.log('debugger-for-chrome: ' + require('../package.json').version);
//# sourceMappingURL=chromeDebug.js.map