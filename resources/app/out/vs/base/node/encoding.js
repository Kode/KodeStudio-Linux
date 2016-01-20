/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/base/node/stream'], function (require, exports, stream) {
    exports.UTF8 = 'utf8';
    exports.UTF16be = 'utf16be';
    exports.UTF16le = 'utf16le';
    function detectEncodingByBOMFromBuffer(buffer, bytesRead) {
        if (!buffer || bytesRead < 2) {
            return null;
        }
        var b0 = buffer.readUInt8(0);
        var b1 = buffer.readUInt8(1);
        // UTF-16 BE
        if (b0 === 0xFE && b1 === 0xFF) {
            return exports.UTF16be;
        }
        // UTF-16 LE
        if (b0 === 0xFF && b1 === 0xFE) {
            return exports.UTF16le;
        }
        if (bytesRead < 3) {
            return null;
        }
        var b2 = buffer.readUInt8(2);
        // UTF-8
        if (b0 === 0xEF && b1 === 0xBB && b2 === 0xBF) {
            return exports.UTF8;
        }
        return null;
    }
    exports.detectEncodingByBOMFromBuffer = detectEncodingByBOMFromBuffer;
    ;
    /**
     * Detects the Byte Order Mark in a given file.
     * If no BOM is detected, `encoding` will be null.
     */
    function detectEncodingByBOM(file, callback) {
        stream.readExactlyByFile(file, 3, function (err, buffer, bytesRead) {
            if (err) {
                return callback(err, null);
            }
            return callback(null, detectEncodingByBOMFromBuffer(buffer, bytesRead));
        });
    }
    exports.detectEncodingByBOM = detectEncodingByBOM;
});
//# sourceMappingURL=encoding.js.map