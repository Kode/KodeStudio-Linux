/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports"], function (require, exports) {
    var PrefixSumComputer = (function () {
        function PrefixSumComputer(values) {
            this.values = values;
            this.prefixSum = [];
            for (var i = 0, len = this.values.length; i < len; i++) {
                this.prefixSum[i] = 0;
            }
            this.prefixSumValidIndex = -1;
        }
        PrefixSumComputer.prototype.getCount = function () {
            return this.values.length;
        };
        PrefixSumComputer.prototype.insertValue = function (insertIndex, value) {
            this.values.splice(insertIndex, 0, value);
            this.prefixSum.splice(insertIndex, 0, 0);
            if (insertIndex - 1 < this.prefixSumValidIndex) {
                this.prefixSumValidIndex = insertIndex - 1;
            }
        };
        PrefixSumComputer.prototype.insertValues = function (insertIndex, values) {
            if (values.length === 0) {
                return;
            }
            this.values = this.values.slice(0, insertIndex).concat(values).concat(this.values.slice(insertIndex));
            this.prefixSum = this.prefixSum.slice(0, insertIndex).concat(PrefixSumComputer._zeroArray(values.length)).concat(this.prefixSum.slice(insertIndex));
            if (insertIndex - 1 < this.prefixSumValidIndex) {
                this.prefixSumValidIndex = insertIndex - 1;
            }
        };
        PrefixSumComputer._zeroArray = function (count) {
            var r = new Array(count);
            for (var i = 0; i < count; i++) {
                r[i] = 0;
            }
            return r;
        };
        PrefixSumComputer.prototype.changeValue = function (index, value) {
            if (this.values[index] === value) {
                return;
            }
            this.values[index] = value;
            if (index - 1 < this.prefixSumValidIndex) {
                this.prefixSumValidIndex = index - 1;
            }
        };
        PrefixSumComputer.prototype.removeValues = function (startIndex, cnt) {
            this.values.splice(startIndex, cnt);
            this.prefixSum.splice(startIndex, cnt);
            if (startIndex - 1 < this.prefixSumValidIndex) {
                this.prefixSumValidIndex = startIndex - 1;
            }
        };
        PrefixSumComputer.prototype.getTotalValue = function () {
            if (this.values.length === 0) {
                return 0;
            }
            return this.getAccumulatedValue(this.values.length - 1);
        };
        PrefixSumComputer.prototype.getAccumulatedValue = function (index) {
            if (index < 0) {
                return 0;
            }
            if (index <= this.prefixSumValidIndex) {
                return this.prefixSum[index];
            }
            var startIndex = this.prefixSumValidIndex + 1;
            if (startIndex === 0) {
                this.prefixSum[0] = this.values[0];
                startIndex++;
            }
            if (index >= this.values.length) {
                index = this.values.length - 1;
            }
            for (var i = startIndex; i <= index; i++) {
                this.prefixSum[i] = this.prefixSum[i - 1] + this.values[i];
            }
            this.prefixSumValidIndex = Math.max(this.prefixSumValidIndex, index);
            return this.prefixSum[index];
        };
        PrefixSumComputer.prototype.getIndexOf = function (accumulatedValue, result) {
            var low = 0, high = this.values.length - 1, mid, midStart, midStop;
            while (low <= high) {
                mid = low + ((high - low) / 2) | 0;
                midStop = this.getAccumulatedValue(mid);
                midStart = midStop - this.values[mid];
                if (accumulatedValue < midStart) {
                    high = mid - 1;
                }
                else if (accumulatedValue >= midStop) {
                    low = mid + 1;
                }
                else {
                    break;
                }
            }
            result.index = mid;
            result.remainder = accumulatedValue - midStart;
        };
        return PrefixSumComputer;
    })();
    exports.PrefixSumComputer = PrefixSumComputer;
});
//# sourceMappingURL=prefixSumComputer.js.map