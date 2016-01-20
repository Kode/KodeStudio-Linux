/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/base/common/platform', 'vs/base/common/winjs.base', 'child_process'], function (require, exports, platform, winjs_base_1, cp) {
    function getUserEnvironment() {
        if (platform.isWindows) {
            return winjs_base_1.TPromise.as({});
        }
        return new winjs_base_1.TPromise(function (c, e) {
            var child = cp.spawn(process.env.SHELL, ['-ilc', 'env'], {
                detached: true,
                stdio: ['ignore', 'pipe', process.stderr],
            });
            child.stdout.setEncoding('utf8');
            child.on('error', function () { return c({}); });
            var buffer = '';
            child.stdout.on('data', function (d) { buffer += d; });
            child.on('close', function (code, signal) {
                if (code !== 0) {
                    return c({});
                }
                var result = Object.create(null);
                buffer.split('\n').forEach(function (line) {
                    var pos = line.indexOf('=');
                    if (pos > 0) {
                        var key = line.substring(0, pos);
                        var value = line.substring(pos + 1);
                        if (!key || typeof result[key] === 'string') {
                            return;
                        }
                        result[key] = value;
                    }
                });
                c(result);
            });
        });
    }
    exports.getUserEnvironment = getUserEnvironment;
});
//# sourceMappingURL=env.js.map