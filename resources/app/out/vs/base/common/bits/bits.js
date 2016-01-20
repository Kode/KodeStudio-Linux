/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports"], function (require, exports) {
    function leftPad(value, length, char) {
        if (char === void 0) { char = '0'; }
        return new Array(length - value.length + 1).join(char) + value;
    }
    exports.leftPad = leftPad;
    function toHexString(value, bitsize) {
        if (bitsize === void 0) { bitsize = 32; }
        return leftPad((value >>> 0).toString(16), bitsize / 4);
    }
    exports.toHexString = toHexString;
    function leftRotate(value, bits, totalBits) {
        if (totalBits === void 0) { totalBits = 32; }
        // delta + bits = totalBits
        var delta = totalBits - bits;
        // All ones, expect `delta` zeros aligned to the right
        var mask = ~((1 << delta) - 1);
        // Join (value left-shifted `bits` bits) with (masked value right-shifted `delta` bits)
        return ((value << bits) | ((mask & value) >>> delta)) >>> 0;
    }
    exports.leftRotate = leftRotate;
    function multiply64(a, b) {
        /*                      A1        A0   => A
         *                      B1        B0   => B
         *	               B0 * A1   B0 * A0
         *         B1 * A1   B1 * A0
         *	C3        C2        C1        C0   => C
        */
        var a0 = a & 0xffff, a1 = a >>> 16;
        var b0 = b & 0xffff, b1 = b >>> 16;
        var c0 = 0, c1 = 0, c2 = 0, c3 = 0;
        var x = b0 * a0;
        c0 += x & 0xffff;
        c1 += x >>> 16;
        x = b0 * a1;
        c1 += x & 0xffff;
        c2 += x >>> 16;
        x = b1 * a0;
        c1 += x & 0xffff;
        c2 += x >>> 16;
        c2 += c1 >>> 16;
        c1 = c1 & 0xffff;
        x = b1 * a1;
        c2 += x & 0xffff;
        c3 += x >>> 16;
        c3 += c2 >>> 16;
        c2 = c2 & 0xffff;
        return [(c3 << 16 | c2) >>> 0, (c1 << 16 | c0) >>> 0];
    }
    exports.multiply64 = multiply64;
});
//# sourceMappingURL=bits.js.map