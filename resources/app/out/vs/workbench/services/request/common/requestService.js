/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(["require", "exports", 'vs/base/common/winjs.base', 'vs/base/common/timer', 'vs/base/common/async', 'vs/base/common/strings', 'vs/nls', 'vs/platform/request/common/baseRequestService', 'vs/platform/telemetry/common/telemetry', 'vs/platform/thread/common/thread', 'vs/platform/workspace/common/workspace'], function (require, exports, winjs_base_1, timer_1, async, strings, nls, baseRequestService_1, telemetry_1, thread_1, workspace_1) {
    var WorkerRequestService = (function (_super) {
        __extends(WorkerRequestService, _super);
        function WorkerRequestService(threadService, contextService, telemetryService) {
            _super.call(this, contextService, telemetryService);
            this._threadService = threadService;
            threadService.registerInstance(this);
        }
        /**
         * IThreadSynchronizableObject Id. Must match id in NativeRequestService.
         */
        WorkerRequestService.prototype.getId = function () {
            return 'NativeRequestService';
        };
        WorkerRequestService.prototype.makeRequest = function (options) {
            var url = options.url;
            if (!url) {
                throw new Error('IRequestService.makeRequest: Url is required.');
            }
            // Support file:// in worker environment through XHR
            if (strings.startsWith(url, 'file://')) {
                return winjs_base_1.xhr(options).then(null, function (xhr) {
                    if (xhr.status === 0 && xhr.responseText) {
                        return xhr; // loading resources locally returns a status of 0 which in WinJS is an error so we need to handle it here
                    }
                    return winjs_base_1.Promise.wrapError({ status: 404, responseText: nls.localize('localFileNotFound', "File not found.") });
                });
            }
            return _super.prototype.makeRequest.call(this, options);
        };
        WorkerRequestService.prototype.makeCrossOriginRequest = function (options) {
            if (this._nodeJSXHRFunctionPromise) {
                // use nodejs to make the call
                var timer = timer_1.nullEvent;
                return this._nodeJSXHRFunctionPromise.then(function (xhrFunction) {
                    return async.always(xhrFunction(options), (function (xhr) {
                        if (timer.data) {
                            timer.data.status = xhr.status;
                        }
                        timer.stop();
                    }));
                });
            }
            else {
                // use the main thread to make the call
                return this._threadService.MainThread(this, 'makeCrossOriginRequest', null, [options]);
            }
        };
        WorkerRequestService = __decorate([
            __param(0, thread_1.IThreadService),
            __param(1, workspace_1.IWorkspaceContextService),
            __param(2, telemetry_1.ITelemetryService)
        ], WorkerRequestService);
        return WorkerRequestService;
    })(baseRequestService_1.BaseRequestService);
    exports.WorkerRequestService = WorkerRequestService;
});
//# sourceMappingURL=requestService.js.map