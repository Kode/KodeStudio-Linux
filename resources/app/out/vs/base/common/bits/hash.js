/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/base/common/bits/bits', 'vs/base/common/bits/encoding', 'vs/base/common/types'], function (require, exports, bits, encoding, types) {
    function copy(dest, destIndex, src, srcIndex, count) {
        for (var i = 0, len = Math.min(dest.byteLength - destIndex, src.byteLength - srcIndex, count); i < len; i++) {
            dest[destIndex + i] = src[srcIndex + i];
        }
        return len;
    }
    function fill(dest, index, count, value) {
        if (index === void 0) { index = 0; }
        if (count === void 0) { count = dest.byteLength; }
        if (value === void 0) { value = 0; }
        for (var i = 0; i < count; i++) {
            dest[index + i] = value;
        }
    }
    var SHA1 = (function () {
        function SHA1() {
            this.h0 = 0x67452301;
            this.h1 = 0xEFCDAB89;
            this.h2 = 0x98BADCFE;
            this.h3 = 0x10325476;
            this.h4 = 0xC3D2E1F0;
            this.length = 0;
            this.buffer = new Uint8Array(SHA1.BLOCK_SIZE);
            this.bufferDV = new DataView(this.buffer.buffer);
            this.bufferLength = 0;
            this.bigBlock32 = new DataView(new ArrayBuffer(320)); // 80 * 4 = 320;
        }
        SHA1.digest = function (data) {
            var sha = new SHA1();
            sha.update(data);
            return sha.digest();
        };
        SHA1.prototype.update = function (arg) {
            if (!this.buffer) {
                throw new Error('Digest already computed.');
            }
            var data;
            if (types.isString(arg)) {
                data = new Uint8Array(encoding.encodeToUTF8(arg));
            }
            else if (arg instanceof ArrayBuffer) {
                data = new Uint8Array(arg);
            }
            else if (arg instanceof DataView) {
                data = new Uint8Array(arg.buffer);
            }
            else {
                data = arg;
            }
            var bytesRead = 0, totalBytesRead = 0;
            while (totalBytesRead < data.byteLength) {
                bytesRead = copy(this.buffer, this.bufferLength, data, totalBytesRead, data.byteLength);
                this.bufferLength += bytesRead;
                totalBytesRead += bytesRead;
                if (this.bufferLength === SHA1.BLOCK_SIZE) {
                    this.step(this.bufferDV);
                    this.bufferLength = 0;
                }
            }
            this.length += totalBytesRead;
        };
        SHA1.prototype.digest = function () {
            if (this.buffer) {
                this.wrapUp();
            }
            return bits.toHexString(this.h0) + bits.toHexString(this.h1) + bits.toHexString(this.h2) + bits.toHexString(this.h3) + bits.toHexString(this.h4);
        };
        SHA1.prototype.wrapUp = function () {
            this.buffer[this.bufferLength++] = 0x80;
            fill(this.buffer, this.bufferLength);
            if (this.bufferLength > 56) {
                this.step(this.bufferDV);
                fill(this.buffer);
            }
            var ml = bits.multiply64(8, this.length);
            this.bufferDV.setUint32(56, ml[0], false);
            this.bufferDV.setUint32(60, ml[1], false);
            this.step(this.bufferDV);
            this.buffer = null;
            this.bufferDV = null;
            this.bufferLength = -1;
        };
        SHA1.prototype.step = function (data) {
            for (var j = 0; j < 64 /* 16*4 */; j += 4) {
                this.bigBlock32.setUint32(j, data.getUint32(j, false), false);
            }
            for (j = 64; j < 320 /* 80*4 */; j += 4) {
                this.bigBlock32.setUint32(j, bits.leftRotate((this.bigBlock32.getUint32(j - 12, false) ^ this.bigBlock32.getUint32(j - 32, false) ^ this.bigBlock32.getUint32(j - 56, false) ^ this.bigBlock32.getUint32(j - 64, false)), 1), false);
            }
            var a = this.h0;
            var b = this.h1;
            var c = this.h2;
            var d = this.h3;
            var e = this.h4;
            var f, k;
            var temp;
            for (j = 0; j < 80; j++) {
                if (j < 20) {
                    f = (b & c) | ((~b) & d);
                    k = 0x5A827999;
                }
                else if (j < 40) {
                    f = b ^ c ^ d;
                    k = 0x6ED9EBA1;
                }
                else if (j < 60) {
                    f = (b & c) | (b & d) | (c & d);
                    k = 0x8F1BBCDC;
                }
                else {
                    f = b ^ c ^ d;
                    k = 0xCA62C1D6;
                }
                temp = (bits.leftRotate(a, 5) + f + e + k + this.bigBlock32.getUint32(j * 4, false)) & 0xffffffff;
                e = d;
                d = c;
                c = bits.leftRotate(b, 30);
                b = a;
                a = temp;
            }
            this.h0 = (this.h0 + a) & 0xffffffff;
            this.h1 = (this.h1 + b) & 0xffffffff;
            this.h2 = (this.h2 + c) & 0xffffffff;
            this.h3 = (this.h3 + d) & 0xffffffff;
            this.h4 = (this.h4 + e) & 0xffffffff;
        };
        // Reference: http://en.wikipedia.org/wiki/SHA-1
        SHA1.BLOCK_SIZE = 64; // 512 / 8
        return SHA1;
    })();
    exports.SHA1 = SHA1;
    function computeSHA1Hash(value, hasBOM, headerFn) {
        if (typeof (ArrayBuffer) === 'undefined') {
            return null; // IE9 does not know ArrayBuffer
        }
        var data = types.isString(value) ? encoding.encodeToUTF8(value, hasBOM) : value;
        var hash = new SHA1();
        if (headerFn) {
            hash.update(headerFn(data.byteLength));
        }
        if (data.byteLength) {
            hash.update(data);
        }
        return hash.digest();
    }
    exports.computeSHA1Hash = computeSHA1Hash;
});
//# sourceMappingURL=hash.js.map