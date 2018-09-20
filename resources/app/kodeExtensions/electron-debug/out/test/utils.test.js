"use strict";
/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const mockery = require("mockery");
const testUtils = require("./testUtils");
const MODULE_UNDER_TEST = '../src/utils';
suite('Utils', () => {
    function getUtils() {
        return require(MODULE_UNDER_TEST);
    }
    setup(() => {
        testUtils.setupUnhandledRejectionListener();
        testUtils.registerLocMocks();
        mockery.enable({ useCleanCache: true, warnOnReplace: false, warnOnUnregistered: false });
        mockery.registerMock('fs', { statSync: () => { }, existsSync: () => false });
    });
    teardown(() => {
        testUtils.removeUnhandledRejectionListener();
        mockery.deregisterAll();
        mockery.disable();
    });
});

//# sourceMappingURL=utils.test.js.map
