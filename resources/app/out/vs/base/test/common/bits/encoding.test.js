/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'assert', 'vs/base/common/bits/encoding'], function (require, exports, assert, encoding_1) {
    function eq(actual, expected) {
        var view = new Uint8Array(actual);
        var actualArray = [];
        for (var i = 0; i < view.byteLength; i++) {
            actualArray.push(view[i]);
        }
        assert.deepEqual(actualArray, expected);
    }
    suite('Encoding', function () {
        test('encodeToUTF8', function () {
            eq(encoding_1.encodeToUTF8(''), []);
            eq(encoding_1.encodeToUTF8('a'), [0x61]);
            eq(encoding_1.encodeToUTF8('aa'), [0x61, 0x61]);
            eq(encoding_1.encodeToUTF8('aaa'), [0x61, 0x61, 0x61]);
            eq(encoding_1.encodeToUTF8('aaaa'), [0x61, 0x61, 0x61, 0x61]);
            eq(encoding_1.encodeToUTF8('The quick brown fox jumps over the lazy dog.'), [0x54, 0x68, 0x65, 0x20, 0x71, 0x75, 0x69, 0x63, 0x6B, 0x20, 0x62, 0x72, 0x6F, 0x77, 0x6E, 0x20, 0x66, 0x6F, 0x78, 0x20, 0x6A, 0x75, 0x6D, 0x70, 0x73, 0x20, 0x6F, 0x76, 0x65, 0x72, 0x20, 0x74, 0x68, 0x65, 0x20, 0x6C, 0x61, 0x7A, 0x79, 0x20, 0x64, 0x6F, 0x67, 0x2E]);
            eq(encoding_1.encodeToUTF8('$'), [0x24]);
            eq(encoding_1.encodeToUTF8('¢'), [0xc2, 0xa2]);
            eq(encoding_1.encodeToUTF8('€'), [0xe2, 0x82, 0xac]);
            eq(encoding_1.encodeToUTF8('𤭢'), [0xf0, 0xa4, 0xad, 0xa2]);
            eq(encoding_1.encodeToUTF8('$¢€𤭢'), [0x24, 0xc2, 0xa2, 0xe2, 0x82, 0xac, 0xf0, 0xa4, 0xad, 0xa2]);
            eq(encoding_1.encodeToUTF8('𤭢€¢$'), [0xf0, 0xa4, 0xad, 0xa2, 0xe2, 0x82, 0xac, 0xc2, 0xa2, 0x24]);
            eq(encoding_1.encodeToUTF8('z水𐀀𝄞􏿽'), [0x7A, 0xE6, 0xB0, 0xB4, 0xF0, 0x90, 0x80, 0x80, 0xF0, 0x9D, 0x84, 0x9E, 0xF4, 0x8F, 0xBF, 0xBD]);
        });
    });
});
//# sourceMappingURL=encoding.test.js.map