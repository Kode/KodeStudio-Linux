/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'assert', 'fs', 'vs/base/node/stream'], function (require, exports, assert, fs, stream) {
    var utf8Buffer = new Buffer([0xEF, 0xBB, 0xBF]);
    suite('Stream', function () {
        test('readExactlyByFile - ANSI', function (done) {
            var file = require.toUrl('./fixtures/file.css');
            stream.readExactlyByFile(file, 10, function (error, buffer, count) {
                assert.equal(error, null);
                assert.equal(count, 10);
                assert.equal(buffer.toString(), '/*--------');
                done();
            });
        });
        test('readExactlyByFile - empty', function (done) {
            var file = require.toUrl('./fixtures/empty.txt');
            stream.readExactlyByFile(file, 10, function (error, buffer, count) {
                assert.equal(error, null);
                assert.equal(count, 0);
                done();
            });
        });
        test('readExactlyByStream - ANSI', function (done) {
            var file = require.toUrl('./fixtures/file.css');
            stream.readExactlyByStream(fs.createReadStream(file), 10, function (error, buffer, count) {
                assert.equal(error, null);
                assert.equal(count, 10);
                assert.equal(buffer.toString(), '/*--------');
                done();
            });
        });
        test('readExactlyByStream - empty', function (done) {
            var file = require.toUrl('./fixtures/empty.txt');
            stream.readExactlyByStream(fs.createReadStream(file), 10, function (error, buffer, count) {
                assert.equal(error, null);
                assert.equal(count, 0);
                done();
            });
        });
    });
});
//# sourceMappingURL=stream.test.js.map