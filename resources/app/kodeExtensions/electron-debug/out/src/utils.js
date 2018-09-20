"use strict";
/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
class DebounceHelper {
    constructor(timeoutMs) {
        this.timeoutMs = timeoutMs;
    }
    /**
     * If not waiting already, call fn after the timeout
     */
    wait(fn) {
        if (!this.waitToken) {
            this.waitToken = setTimeout(() => {
                this.waitToken = null;
                fn();
            }, this.timeoutMs);
        }
    }
    /**
     * If waiting for something, cancel it and call fn immediately
     */
    doAndCancel(fn) {
        if (this.waitToken) {
            clearTimeout(this.waitToken);
            this.waitToken = null;
        }
        fn();
    }
}
exports.DebounceHelper = DebounceHelper;
exports.targetFilter = target => target && (!target.type || target.type === 'page');

//# sourceMappingURL=utils.js.map
