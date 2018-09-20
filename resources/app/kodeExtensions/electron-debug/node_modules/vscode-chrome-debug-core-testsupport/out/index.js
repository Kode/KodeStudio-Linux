"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const debugClient_1 = require("./debugClient");
exports.ExtendedDebugClient = debugClient_1.ExtendedDebugClient;
exports.THREAD_ID = debugClient_1.THREAD_ID;
const debugClient = require("./debugClient");
exports.debugClient = debugClient;
const testSetup_1 = require("./testSetup");
exports.setup = testSetup_1.setup;
exports.teardown = testSetup_1.teardown;
//# sourceMappingURL=index.js.map