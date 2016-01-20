/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/base/common/uri', 'vs/base/common/strings', 'vs/base/common/timer', 'vs/base/common/async', 'vs/base/common/http', 'vs/base/common/winjs.base', 'vs/base/common/objects', 'vs/platform/request/common/request'], function (require, exports, uri_1, strings, Timer, Async, http, winjs, objects, request_1) {
    /**
     * Simple IRequestService implementation to allow sharing of this service implementation
     * between different layers of the platform.
     */
    var BaseRequestService = (function () {
        function BaseRequestService(contextService, telemetryService) {
            this.serviceId = request_1.IRequestService;
            var workspaceUri = null;
            var contextService = contextService;
            var workspace = contextService.getWorkspace();
            this._serviceMap = workspace || Object.create(null);
            this._telemetryService = telemetryService;
            if (workspace) {
                workspaceUri = strings.rtrim(workspace.resource.toString(), '/') + '/';
            }
            this.computeOrigin(workspaceUri);
        }
        BaseRequestService.prototype.computeOrigin = function (workspaceUri) {
            if (workspaceUri) {
                // Find root server URL from configuration
                this._origin = workspaceUri;
                var urlPath = uri_1.default.parse(this._origin).path;
                if (urlPath && urlPath.length > 0) {
                    this._origin = this._origin.substring(0, this._origin.length - urlPath.length + 1);
                }
                if (!strings.endsWith(this._origin, '/')) {
                    this._origin += '/';
                }
            }
            else {
                this._origin = '/'; // Configuration not provided, fallback to default
            }
        };
        BaseRequestService.prototype.makeCrossOriginRequest = function (options) {
            return null;
        };
        BaseRequestService.prototype.makeRequest = function (options) {
            var timer = Timer.nullEvent;
            var isXhrRequestCORS = false;
            var url = options.url;
            if (!url) {
                throw new Error('IRequestService.makeRequest: Url is required');
            }
            if ((strings.startsWith(url, 'http://') || strings.startsWith(url, 'https://')) && this._origin && !strings.startsWith(url, this._origin)) {
                var coPromise = this.makeCrossOriginRequest(options);
                if (coPromise) {
                    return coPromise;
                }
                isXhrRequestCORS = true;
            }
            var xhrOptions = options;
            if (!isXhrRequestCORS) {
                var additionalHeaders = {};
                if (this._telemetryService) {
                    additionalHeaders['X-TelemetrySession'] = this._telemetryService.getSessionId();
                }
                ;
                additionalHeaders['X-Requested-With'] = 'XMLHttpRequest';
                xhrOptions.headers = objects.mixin(xhrOptions.headers, additionalHeaders);
            }
            if (options.timeout) {
                xhrOptions.customRequestInitializer = function (xhrRequest) {
                    xhrRequest.timeout = options.timeout;
                };
            }
            return Async.always(winjs.xhr(xhrOptions), (function (xhr) {
                if (timer.data) {
                    timer.data.status = xhr.status;
                }
                timer.stop();
            }));
        };
        BaseRequestService.prototype.makeChunkedRequest = function (options) {
            var _this = this;
            var from = 0, c, e, p, canceled = false;
            return new winjs.TPromise(function (_c, _e, _p) {
                c = _c;
                e = _e;
                p = _p;
                _this.makeRequest(options).done(function (request) {
                    var ret = {
                        request: request,
                        chunks: []
                    };
                    from = http.parseChunkedData(request, ret.chunks, from);
                    c(ret);
                }, function (err) {
                    e(err);
                }, function (request) {
                    // This might fail in IE10 for b i g request. Leave it enabled
                    // for now to see if and when it fails
                    // if(request.readyState === 3) {
                    //	from = http.parseChunkedData(request, ret.chunks, from);
                    // }
                });
            }, function () {
                canceled = true;
            });
        };
        return BaseRequestService;
    })();
    exports.BaseRequestService = BaseRequestService;
});
//# sourceMappingURL=baseRequestService.js.map