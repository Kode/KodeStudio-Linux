/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/base/common/winjs.base', 'vs/base/common/objects', 'vs/base/node/request', 'vs/base/node/proxy'], function (require, exports, winjs_base_1, objects_1, request_1, proxy_1) {
    var proxyUrl = null;
    var strictSSL = true;
    function configure(_proxyUrl, _strictSSL) {
        proxyUrl = _proxyUrl;
        strictSSL = _strictSSL;
    }
    exports.configure = configure;
    function xhr(options) {
        var agent = proxy_1.getProxyAgent(options.url, { proxyUrl: proxyUrl, strictSSL: strictSSL });
        options = objects_1.assign({}, options);
        options = objects_1.assign(options, { agent: agent, strictSSL: strictSSL });
        return request_1.request(options).then(function (result) { return new winjs_base_1.TPromise(function (c, e, p) {
            var res = result.res;
            var data = [];
            res.on('data', function (c) { return data.push(c); });
            res.on('end', function () {
                if (options.followRedirects > 0 && (res.statusCode >= 300 && res.statusCode <= 303 || res.statusCode === 307)) {
                    var location_1 = res.headers['location'];
                    if (location_1) {
                        var newOptions = {
                            type: options.type, url: location_1, user: options.user, password: options.password, responseType: options.responseType, headers: options.headers,
                            timeout: options.timeout, followRedirects: options.followRedirects - 1, data: options.data
                        };
                        xhr(newOptions).done(c, e, p);
                        return;
                    }
                }
                var response = {
                    responseText: data.join(''),
                    status: res.statusCode
                };
                if ((res.statusCode >= 200 && res.statusCode < 300) || res.statusCode === 1223) {
                    c(response);
                }
                else {
                    e(response);
                }
            });
        }, function (err) {
            var message;
            if (agent) {
                message = 'Unable to to connect to ' + options.url + ' through a proxy . Error: ' + err.message;
            }
            else {
                message = 'Unable to to connect to ' + options.url + '. Error: ' + err.message;
            }
            return winjs_base_1.TPromise.wrapError({
                responseText: message,
                status: 404
            });
        }); });
    }
    exports.xhr = xhr;
});
//# sourceMappingURL=rawHttpService.js.map