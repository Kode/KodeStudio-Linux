"use strict";
/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const mockery = require("mockery");
const assert = require("assert");
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
    suite('getTargetFilter()', () => {
        test('defaultTargetFilter', () => {
            const { defaultTargetFilter } = getUtils();
            const targets = [{ type: 'page' }, { type: 'webview' }];
            assert.deepEqual(targets.filter(defaultTargetFilter), [{ type: 'page' }]);
        });
        test('getTargetFilter', () => {
            const { getTargetFilter } = getUtils();
            const targets = [{ type: 'page' }, { type: 'webview' }];
            assert.deepEqual(targets.filter(getTargetFilter(['page'])), [{ type: 'page' }]);
            assert.deepEqual(targets.filter(getTargetFilter(['webview'])), [{ type: 'webview' }]);
            assert.deepEqual(targets.filter(getTargetFilter(['page', 'webview'])), targets);
            // Falsy targetTypes should effectively disable filtering.
            assert.deepEqual(targets.filter(getTargetFilter()), targets);
        });
    });
});

//# sourceMappingURL=utils.test.js.map
