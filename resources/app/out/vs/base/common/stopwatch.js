/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/base/common/platform'], function (require, exports, platform_1) {
    var hasPerformanceNow = (platform_1.globals.performance && typeof platform_1.globals.performance.now === 'function');
    var StopWatch = (function () {
        function StopWatch(startTime) {
            this._startTime = startTime;
            this._stopTime = -1;
        }
        StopWatch.create = function () {
            return new StopWatch(hasPerformanceNow ? platform_1.globals.performance.now() : new Date().getTime());
        };
        StopWatch.prototype.stop = function () {
            this._stopTime = (hasPerformanceNow ? platform_1.globals.performance.now() : new Date().getTime());
        };
        StopWatch.prototype.elapsed = function () {
            if (this._stopTime !== -1) {
                return this._stopTime - this._startTime;
            }
            var now = (hasPerformanceNow ? platform_1.globals.performance.now() : new Date().getTime());
            return now - this._startTime;
        };
        return StopWatch;
    })();
    exports.StopWatch = StopWatch;
});
//# sourceMappingURL=stopwatch.js.map