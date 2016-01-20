/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'assert', 'vs/base/common/mime'], function (require, exports, assert, mime_1) {
    suite('Mime', function () {
        test('Dynamically Register Text Mime', function () {
            var guess = mime_1.guessMimeTypes('foo.monaco');
            assert.deepEqual(guess, ['application/unknown']);
            mime_1.registerTextMimeByFilename('.monaco', 'text/monaco');
            guess = mime_1.guessMimeTypes('foo.monaco');
            assert.deepEqual(guess, ['text/monaco', 'text/plain']);
            guess = mime_1.guessMimeTypes('.monaco');
            assert.deepEqual(guess, ['text/monaco', 'text/plain']);
            mime_1.registerTextMimeByFilename('Codefile', 'text/code');
            guess = mime_1.guessMimeTypes('Codefile');
            assert.deepEqual(guess, ['text/code', 'text/plain']);
            guess = mime_1.guessMimeTypes('foo.Codefile');
            assert.deepEqual(guess, ['application/unknown']);
            mime_1.registerTextMimeByFirstLine(/RegexesAreNice/, 'text/nice-regex');
            guess = mime_1.guessMimeTypes('Randomfile.noregistration', 'RegexesAreNice');
            assert.deepEqual(guess, ['text/nice-regex', 'text/plain']);
            guess = mime_1.guessMimeTypes('Randomfile.noregistration', 'RegexesAreNiceee');
            assert.deepEqual(guess, ['application/unknown']);
            guess = mime_1.guessMimeTypes('Codefile', 'RegexesAreNice');
            assert.deepEqual(guess, ['text/nice-regex', 'text/plain']);
        });
        test('Mimes Priority', function () {
            mime_1.registerTextMimeByFilename('.monaco', 'text/monaco');
            mime_1.registerTextMimeByFirstLine(/foobar/, 'text/foobar');
            var guess = mime_1.guessMimeTypes('foo.monaco');
            assert.deepEqual(guess, ['text/monaco', 'text/plain']);
            guess = mime_1.guessMimeTypes('foo.monaco', 'foobar');
            assert.deepEqual(guess, ['text/foobar', 'text/plain']);
        });
        test('Specificity priority 1', function () {
            mime_1.registerTextMimeByFilename('.monaco2', 'text/monaco2');
            mime_1.registerTextMimeByFilename('specific.monaco2', 'text/specific-monaco2');
            assert.deepEqual(mime_1.guessMimeTypes('specific.monaco2'), ['text/specific-monaco2', 'text/plain']);
            assert.deepEqual(mime_1.guessMimeTypes('foo.monaco2'), ['text/monaco2', 'text/plain']);
        });
        test('Specificity priority 2', function () {
            mime_1.registerTextMimeByFilename('specific.monaco3', 'text/specific-monaco3');
            mime_1.registerTextMimeByFilename('.monaco3', 'text/monaco3');
            assert.deepEqual(mime_1.guessMimeTypes('specific.monaco3'), ['text/specific-monaco3', 'text/plain']);
            assert.deepEqual(mime_1.guessMimeTypes('foo.monaco3'), ['text/monaco3', 'text/plain']);
        });
        test('Mimes Priority - Longest Extension wins', function () {
            mime_1.registerTextMimeByFilename('.monaco', 'text/monaco');
            mime_1.registerTextMimeByFilename('.monaco.xml', 'text/monaco-xml');
            mime_1.registerTextMimeByFilename('.monaco.xml.build', 'text/monaco-xml-build');
            var guess = mime_1.guessMimeTypes('foo.monaco');
            assert.deepEqual(guess, ['text/monaco', 'text/plain']);
            guess = mime_1.guessMimeTypes('foo.monaco.xml');
            assert.deepEqual(guess, ['text/monaco-xml', 'text/plain']);
            guess = mime_1.guessMimeTypes('foo.monaco.xml.build');
            assert.deepEqual(guess, ['text/monaco-xml-build', 'text/plain']);
        });
    });
});
//# sourceMappingURL=mime.test.js.map