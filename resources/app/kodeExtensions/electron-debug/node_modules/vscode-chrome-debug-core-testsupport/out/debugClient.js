"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const vscode_debugadapter_testsupport_1 = require("vscode-debugadapter-testsupport");
exports.THREAD_ID = 1;
function setBreakpointOnStart(dc, bps, program, expLine, expCol, expVerified) {
    return dc.waitForEvent('initialized')
        .then(event => setBreakpoint(dc, bps, program, expLine, expCol, expVerified))
        .then(() => dc.configurationDoneRequest())
        .then(() => { });
}
exports.setBreakpointOnStart = setBreakpointOnStart;
function setBreakpoint(dc, bps, program, expLine, expCol, expVerified) {
    return dc.setBreakpointsRequest({
        breakpoints: bps,
        source: { path: program }
    }).then(response => {
        const bp = response.body.breakpoints[0];
        if (typeof expVerified === 'boolean')
            assert.equal(bp.verified, expVerified, 'breakpoint verification mismatch: verified');
        if (typeof expLine === 'number')
            assert.equal(bp.line, expLine, 'breakpoint verification mismatch: line');
        if (typeof expCol === 'number')
            assert.equal(bp.column, expCol, 'breakpoint verification mismatch: column');
    });
}
exports.setBreakpoint = setBreakpoint;
class ExtendedDebugClient extends vscode_debugadapter_testsupport_1.DebugClient {
    toggleSkipFileStatus(aPath) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield Promise.all([
                this.send('toggleSkipFileStatus', { path: aPath }),
                this.waitForEvent('stopped')
            ]);
            return results[0];
        });
    }
    loadedSources(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.send('loadedSources');
            return response.body;
        });
    }
    continueRequest() {
        return super.continueRequest({ threadId: exports.THREAD_ID });
    }
    nextRequest() {
        return super.nextRequest({ threadId: exports.THREAD_ID });
    }
    stepOutRequest() {
        return super.stepOutRequest({ threadId: exports.THREAD_ID });
    }
    stepInRequest() {
        return super.stepInRequest({ threadId: exports.THREAD_ID });
    }
    stackTraceRequest() {
        return super.stackTraceRequest({ threadId: exports.THREAD_ID });
    }
    continueAndStop() {
        return Promise.all([
            super.continueRequest({ threadId: exports.THREAD_ID }),
            this.waitForEvent('stopped')
        ]);
    }
    nextAndStop() {
        return Promise.all([
            super.nextRequest({ threadId: exports.THREAD_ID }),
            this.waitForEvent('stopped')
        ]);
    }
    stepOutAndStop() {
        return Promise.all([
            super.stepOutRequest({ threadId: exports.THREAD_ID }),
            this.waitForEvent('stopped')
        ]);
    }
    stepInAndStop() {
        return Promise.all([
            super.stepInRequest({ threadId: exports.THREAD_ID }),
            this.waitForEvent('stopped')
        ]);
    }
    continueTo(reason, expected) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield Promise.all([
                this.continueRequest(),
                this.assertStoppedLocation(reason, expected)
            ]);
            return results[1];
        });
    }
    nextTo(reason, expected) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield Promise.all([
                this.nextRequest(),
                this.assertStoppedLocation(reason, expected)
            ]);
            return results[1];
        });
    }
    stepOutTo(reason, expected) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield Promise.all([
                this.stepOutRequest(),
                this.assertStoppedLocation(reason, expected)
            ]);
            return results[1];
        });
    }
    stepInTo(reason, expected) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield Promise.all([
                this.stepInRequest(),
                this.assertStoppedLocation(reason, expected)
            ]);
            return results[1];
        });
    }
    waitForEvent(eventType) {
        return super.waitForEvent(eventType);
    }
    /**
     * This is a copy of DebugClient's hitBreakpoint, except that it doesn't assert 'verified' by default. In the Chrome debugger, a bp may be verified or unverified at launch,
     * depending on whether it's randomly received before or after the 'scriptParsed' event for its script. So we can't always check this prop.
     */
    hitBreakpointUnverified(launchArgs, location, expected) {
        return Promise.all([
            this.waitForEvent('initialized').then(event => {
                return this.setBreakpointsRequest({
                    lines: [location.line],
                    breakpoints: [{ line: location.line, column: location.column }],
                    source: { path: location.path }
                });
            }).then(response => {
                if (response.body.breakpoints.length > 0) {
                    const bp = response.body.breakpoints[0];
                    if (typeof location.verified === 'boolean') {
                        assert.equal(bp.verified, location.verified, 'breakpoint verification mismatch: verified');
                    }
                    if (bp.source && bp.source.path) {
                        this.assertPath(bp.source.path, location.path, 'breakpoint verification mismatch: path');
                    }
                    if (typeof bp.line === 'number') {
                        assert.equal(bp.line, location.line, 'breakpoint verification mismatch: line');
                    }
                    if (typeof location.column === 'number' && typeof bp.column === 'number') {
                        assert.equal(bp.column, location.column, 'breakpoint verification mismatch: column');
                    }
                }
                return this.configurationDoneRequest();
            }),
            this.launch(launchArgs),
            this.assertStoppedLocation('breakpoint', expected || location)
        ]);
    }
}
exports.ExtendedDebugClient = ExtendedDebugClient;
//# sourceMappingURL=debugClient.js.map