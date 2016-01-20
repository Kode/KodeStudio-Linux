/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'assert', 'vs/editor/common/modes', 'vs/editor/test/common/modesUtil', 'vs/editor/common/model/model', 'vs/languages/html/common/htmlTokenTypes', 'vs/languages/html/common/html.contribution', 'vs/languages/javascript/common/javascript.contribution'], function (require, exports, assert, Modes, modesUtil, model_1, htmlTokenTypes_1) {
    suite('Colorizing - HTML', function () {
        var onEnter;
        var tokenizationSupport;
        var _mode;
        suiteSetup(function (done) {
            modesUtil.load('html').then(function (mode) {
                tokenizationSupport = mode.tokenizationSupport;
                onEnter = modesUtil.createOnEnter(mode);
                _mode = mode;
                done();
            });
        });
        test('Open Start Tag #1', function () {
            modesUtil.assertTokenization(tokenizationSupport, [{
                    line: '<abc',
                    tokens: [
                        { startIndex: 0, type: htmlTokenTypes_1.DELIM_START, bracket: Modes.Bracket.Open },
                        { startIndex: 1, type: htmlTokenTypes_1.getTag('abc') }
                    ] }
            ]);
        });
        test('Open Start Tag #2', function () {
            modesUtil.assertTokenization(tokenizationSupport, [{
                    line: '<input',
                    tokens: [
                        { startIndex: 0, type: htmlTokenTypes_1.DELIM_START },
                        { startIndex: 1, type: htmlTokenTypes_1.getTag('input') }
                    ] }
            ]);
        });
        test('Open Start Tag with Invalid Tag', function () {
            modesUtil.assertTokenization(tokenizationSupport, [{
                    line: '< abc',
                    tokens: [
                        { startIndex: 0, type: htmlTokenTypes_1.DELIM_START, bracket: Modes.Bracket.Open },
                        { startIndex: 1, type: '' }
                    ] }
            ]);
        });
        test('Open Start Tag #3', function () {
            modesUtil.assertTokenization(tokenizationSupport, [{
                    line: '< abc>',
                    tokens: [
                        { startIndex: 0, type: htmlTokenTypes_1.DELIM_START, bracket: Modes.Bracket.Open },
                        { startIndex: 1, type: '' }
                    ] }
            ]);
        });
        test('Open Start Tag #4', function () {
            modesUtil.assertTokenization(tokenizationSupport, [{
                    line: 'i <len;',
                    tokens: [
                        { startIndex: 0, type: '' },
                        { startIndex: 2, type: htmlTokenTypes_1.DELIM_START, bracket: Modes.Bracket.Open },
                        { startIndex: 3, type: htmlTokenTypes_1.getTag('len') },
                        { startIndex: 6, type: '' }
                    ] }
            ]);
        });
        test('Open Start Tag #5', function () {
            modesUtil.assertTokenization(tokenizationSupport, [{
                    line: '<',
                    tokens: [
                        { startIndex: 0, type: htmlTokenTypes_1.DELIM_START, bracket: Modes.Bracket.Open }
                    ] }
            ]);
        });
        test('Open End Tag', function () {
            modesUtil.assertTokenization(tokenizationSupport, [{
                    line: '</a',
                    tokens: [
                        { startIndex: 0, type: htmlTokenTypes_1.DELIM_END, bracket: Modes.Bracket.Open },
                        { startIndex: 2, type: htmlTokenTypes_1.getTag('a') }
                    ] }
            ]);
        });
        test('Complete Start Tag', function () {
            modesUtil.assertTokenization(tokenizationSupport, [{
                    line: '<abc>',
                    tokens: [
                        { startIndex: 0, type: htmlTokenTypes_1.DELIM_START, bracket: Modes.Bracket.Open },
                        { startIndex: 1, type: htmlTokenTypes_1.getTag('abc') },
                        { startIndex: 4, type: htmlTokenTypes_1.DELIM_START, bracket: Modes.Bracket.Close }
                    ] }
            ]);
        });
        test('Complete Start Tag with Whitespace', function () {
            modesUtil.assertTokenization(tokenizationSupport, [{
                    line: '<abc >',
                    tokens: [
                        { startIndex: 0, type: htmlTokenTypes_1.DELIM_START, bracket: Modes.Bracket.Open },
                        { startIndex: 1, type: htmlTokenTypes_1.getTag('abc') },
                        { startIndex: 4, type: '' },
                        { startIndex: 5, type: htmlTokenTypes_1.DELIM_START, bracket: Modes.Bracket.Close }
                    ] }
            ]);
        });
        test('bug 9809 - Complete Start Tag with Namespaceprefix', function () {
            modesUtil.assertTokenization(tokenizationSupport, [{
                    line: '<foo:bar>',
                    tokens: [
                        { startIndex: 0, type: htmlTokenTypes_1.DELIM_START, bracket: Modes.Bracket.Open },
                        { startIndex: 1, type: htmlTokenTypes_1.getTag('foo-bar') },
                        { startIndex: 8, type: htmlTokenTypes_1.DELIM_START, bracket: Modes.Bracket.Close }
                    ] }
            ]);
        });
        test('Complete End Tag', function () {
            modesUtil.assertTokenization(tokenizationSupport, [{
                    line: '</abc>',
                    tokens: [
                        { startIndex: 0, type: htmlTokenTypes_1.DELIM_END, bracket: Modes.Bracket.Open },
                        { startIndex: 2, type: htmlTokenTypes_1.getTag('abc') },
                        { startIndex: 5, type: htmlTokenTypes_1.DELIM_END, bracket: Modes.Bracket.Close }
                    ] }
            ]);
        });
        test('Complete End Tag with Whitespace', function () {
            modesUtil.assertTokenization(tokenizationSupport, [{
                    line: '</abc  >',
                    tokens: [
                        { startIndex: 0, type: htmlTokenTypes_1.DELIM_END, bracket: Modes.Bracket.Open },
                        { startIndex: 2, type: htmlTokenTypes_1.getTag('abc') },
                        { startIndex: 5, type: '' },
                        { startIndex: 7, type: htmlTokenTypes_1.DELIM_END, bracket: Modes.Bracket.Close }
                    ] }
            ]);
        });
        test('Empty Tag', function () {
            modesUtil.assertTokenization(tokenizationSupport, [{
                    line: '<abc />',
                    tokens: [
                        { startIndex: 0, type: htmlTokenTypes_1.DELIM_START, bracket: Modes.Bracket.Open },
                        { startIndex: 1, type: htmlTokenTypes_1.getTag('abc') },
                        { startIndex: 4, type: '' },
                        { startIndex: 5, type: htmlTokenTypes_1.DELIM_START, bracket: Modes.Bracket.Close }
                    ] }
            ]);
        });
        test('Embedded Content #1', function () {
            modesUtil.assertTokenization(tokenizationSupport, [{
                    line: '<script type="text/javascript">var i= 10;</script>',
                    tokens: [
                        { startIndex: 0, type: htmlTokenTypes_1.DELIM_START, bracket: Modes.Bracket.Open },
                        { startIndex: 1, type: htmlTokenTypes_1.getTag('script') },
                        { startIndex: 7, type: '' },
                        { startIndex: 8, type: htmlTokenTypes_1.ATTRIB_NAME },
                        { startIndex: 12, type: htmlTokenTypes_1.DELIM_ASSIGN },
                        { startIndex: 13, type: htmlTokenTypes_1.ATTRIB_VALUE },
                        { startIndex: 30, type: htmlTokenTypes_1.DELIM_START, bracket: Modes.Bracket.Close },
                        { startIndex: 31, type: 'keyword.js' },
                        { startIndex: 34, type: '' },
                        { startIndex: 35, type: 'identifier.js' },
                        { startIndex: 36, type: 'delimiter.js' },
                        { startIndex: 37, type: '' },
                        { startIndex: 38, type: 'number.js' },
                        { startIndex: 40, type: 'delimiter.js' },
                        { startIndex: 41, type: htmlTokenTypes_1.DELIM_END, bracket: Modes.Bracket.Open },
                        { startIndex: 43, type: htmlTokenTypes_1.getTag('script') },
                        { startIndex: 49, type: htmlTokenTypes_1.DELIM_END, bracket: Modes.Bracket.Close }
                    ] }
            ]);
        });
        test('Embedded Content #2', function () {
            modesUtil.assertTokenization(tokenizationSupport, [{
                    line: '<script type="text/javascript">',
                    tokens: [
                        { startIndex: 0, type: htmlTokenTypes_1.DELIM_START, bracket: Modes.Bracket.Open },
                        { startIndex: 1, type: htmlTokenTypes_1.getTag('script') },
                        { startIndex: 7, type: '' },
                        { startIndex: 8, type: htmlTokenTypes_1.ATTRIB_NAME },
                        { startIndex: 12, type: htmlTokenTypes_1.DELIM_ASSIGN },
                        { startIndex: 13, type: htmlTokenTypes_1.ATTRIB_VALUE },
                        { startIndex: 30, type: htmlTokenTypes_1.DELIM_START, bracket: Modes.Bracket.Close }
                    ] }, {
                    line: 'var i= 10;',
                    tokens: [
                        { startIndex: 0, type: 'keyword.js' },
                        { startIndex: 3, type: '' },
                        { startIndex: 4, type: 'identifier.js' },
                        { startIndex: 5, type: 'delimiter.js' },
                        { startIndex: 6, type: '' },
                        { startIndex: 7, type: 'number.js' },
                        { startIndex: 9, type: 'delimiter.js' }
                    ] }, {
                    line: '</script>',
                    tokens: [
                        { startIndex: 0, type: htmlTokenTypes_1.DELIM_END, bracket: Modes.Bracket.Open },
                        { startIndex: 2, type: htmlTokenTypes_1.getTag('script') },
                        { startIndex: 8, type: htmlTokenTypes_1.DELIM_END, bracket: Modes.Bracket.Close }
                    ] }
            ]);
        });
        test('Embedded Content #3', function () {
            modesUtil.assertTokenization(tokenizationSupport, [{
                    line: '<script type="text/javascript">var i= 10;',
                    tokens: [
                        { startIndex: 0, type: htmlTokenTypes_1.DELIM_START, bracket: Modes.Bracket.Open },
                        { startIndex: 1, type: htmlTokenTypes_1.getTag('script') },
                        { startIndex: 7, type: '' },
                        { startIndex: 8, type: htmlTokenTypes_1.ATTRIB_NAME },
                        { startIndex: 12, type: htmlTokenTypes_1.DELIM_ASSIGN },
                        { startIndex: 13, type: htmlTokenTypes_1.ATTRIB_VALUE },
                        { startIndex: 30, type: htmlTokenTypes_1.DELIM_START, bracket: Modes.Bracket.Close },
                        { startIndex: 31, type: 'keyword.js' },
                        { startIndex: 34, type: '' },
                        { startIndex: 35, type: 'identifier.js' },
                        { startIndex: 36, type: 'delimiter.js' },
                        { startIndex: 37, type: '' },
                        { startIndex: 38, type: 'number.js' },
                        { startIndex: 40, type: 'delimiter.js' }
                    ] }, {
                    line: '</script>',
                    tokens: [
                        { startIndex: 0, type: htmlTokenTypes_1.DELIM_END, bracket: Modes.Bracket.Open },
                        { startIndex: 2, type: htmlTokenTypes_1.getTag('script') },
                        { startIndex: 8, type: htmlTokenTypes_1.DELIM_END, bracket: Modes.Bracket.Close }
                    ] }
            ]);
        });
        test('Embedded Content #4', function () {
            modesUtil.assertTokenization(tokenizationSupport, [{
                    line: '<script type="text/javascript">',
                    tokens: [
                        { startIndex: 0, type: htmlTokenTypes_1.DELIM_START, bracket: Modes.Bracket.Open },
                        { startIndex: 1, type: htmlTokenTypes_1.getTag('script') },
                        { startIndex: 7, type: '' },
                        { startIndex: 8, type: htmlTokenTypes_1.ATTRIB_NAME },
                        { startIndex: 12, type: htmlTokenTypes_1.DELIM_ASSIGN },
                        { startIndex: 13, type: htmlTokenTypes_1.ATTRIB_VALUE },
                        { startIndex: 30, type: htmlTokenTypes_1.DELIM_START, bracket: Modes.Bracket.Close }
                    ] }, {
                    line: 'var i= 10;</script>',
                    tokens: [
                        { startIndex: 0, type: 'keyword.js' },
                        { startIndex: 3, type: '' },
                        { startIndex: 4, type: 'identifier.js' },
                        { startIndex: 5, type: 'delimiter.js' },
                        { startIndex: 6, type: '' },
                        { startIndex: 7, type: 'number.js' },
                        { startIndex: 9, type: 'delimiter.js' },
                        { startIndex: 10, type: htmlTokenTypes_1.DELIM_END, bracket: Modes.Bracket.Open },
                        { startIndex: 12, type: htmlTokenTypes_1.getTag('script') },
                        { startIndex: 18, type: htmlTokenTypes_1.DELIM_END, bracket: Modes.Bracket.Close }
                    ] }
            ]);
        });
        test('Embedded Content #5', function () {
            modesUtil.assertTokenization(tokenizationSupport, [{
                    line: '<script type="text/plain">a\n<a</script>',
                    tokens: [
                        { startIndex: 0, type: htmlTokenTypes_1.DELIM_START, bracket: Modes.Bracket.Open },
                        { startIndex: 1, type: htmlTokenTypes_1.getTag('script') },
                        { startIndex: 7, type: '' },
                        { startIndex: 8, type: htmlTokenTypes_1.ATTRIB_NAME },
                        { startIndex: 12, type: htmlTokenTypes_1.DELIM_ASSIGN },
                        { startIndex: 13, type: htmlTokenTypes_1.ATTRIB_VALUE },
                        { startIndex: 25, type: htmlTokenTypes_1.DELIM_START, bracket: Modes.Bracket.Close },
                        { startIndex: 26, type: '' },
                        { startIndex: 30, type: htmlTokenTypes_1.DELIM_END, bracket: Modes.Bracket.Open },
                        { startIndex: 32, type: htmlTokenTypes_1.getTag('script') },
                        { startIndex: 38, type: htmlTokenTypes_1.DELIM_END, bracket: Modes.Bracket.Close }
                    ] }
            ]);
        });
        test('Embedded Content #6', function () {
            modesUtil.assertTokenization(tokenizationSupport, [{
                    line: '<script>a</script><script>b</script>',
                    tokens: [
                        { startIndex: 0, type: htmlTokenTypes_1.DELIM_START, bracket: Modes.Bracket.Open },
                        { startIndex: 1, type: htmlTokenTypes_1.getTag('script') },
                        { startIndex: 7, type: htmlTokenTypes_1.DELIM_START, bracket: Modes.Bracket.Close },
                        { startIndex: 8, type: 'identifier.js' },
                        { startIndex: 9, type: htmlTokenTypes_1.DELIM_END, bracket: Modes.Bracket.Open },
                        { startIndex: 11, type: htmlTokenTypes_1.getTag('script') },
                        { startIndex: 17, type: htmlTokenTypes_1.DELIM_END, bracket: Modes.Bracket.Close },
                        { startIndex: 18, type: htmlTokenTypes_1.DELIM_START, bracket: Modes.Bracket.Open },
                        { startIndex: 19, type: htmlTokenTypes_1.getTag('script') },
                        { startIndex: 25, type: htmlTokenTypes_1.DELIM_START, bracket: Modes.Bracket.Close },
                        { startIndex: 26, type: 'identifier.js' },
                        { startIndex: 27, type: htmlTokenTypes_1.DELIM_END, bracket: Modes.Bracket.Open },
                        { startIndex: 29, type: htmlTokenTypes_1.getTag('script') },
                        { startIndex: 35, type: htmlTokenTypes_1.DELIM_END, bracket: Modes.Bracket.Close }
                    ] }
            ]);
        });
        test('Embedded Content #7', function () {
            modesUtil.assertTokenization(tokenizationSupport, [{
                    line: '<script type="text/javascript"></script>',
                    tokens: [
                        { startIndex: 0, type: htmlTokenTypes_1.DELIM_START, bracket: Modes.Bracket.Open },
                        { startIndex: 1, type: htmlTokenTypes_1.getTag('script') },
                        { startIndex: 7, type: '' },
                        { startIndex: 8, type: htmlTokenTypes_1.ATTRIB_NAME },
                        { startIndex: 12, type: htmlTokenTypes_1.DELIM_ASSIGN },
                        { startIndex: 13, type: htmlTokenTypes_1.ATTRIB_VALUE },
                        { startIndex: 30, type: htmlTokenTypes_1.DELIM_START, bracket: Modes.Bracket.Close },
                        { startIndex: 31, type: htmlTokenTypes_1.DELIM_END, bracket: Modes.Bracket.Open },
                        { startIndex: 33, type: htmlTokenTypes_1.getTag('script') },
                        { startIndex: 39, type: htmlTokenTypes_1.DELIM_END, bracket: Modes.Bracket.Close }
                    ] }
            ]);
        });
        test('Embedded Content #8', function () {
            modesUtil.assertTokenization(tokenizationSupport, [{
                    line: '<script>var i= 10;</script>',
                    tokens: [
                        { startIndex: 0, type: htmlTokenTypes_1.DELIM_START, bracket: Modes.Bracket.Open },
                        { startIndex: 1, type: htmlTokenTypes_1.getTag('script') },
                        { startIndex: 7, type: htmlTokenTypes_1.DELIM_START, bracket: Modes.Bracket.Close },
                        { startIndex: 8, type: 'keyword.js' },
                        { startIndex: 11, type: '' },
                        { startIndex: 12, type: 'identifier.js' },
                        { startIndex: 13, type: 'delimiter.js' },
                        { startIndex: 14, type: '' },
                        { startIndex: 15, type: 'number.js' },
                        { startIndex: 17, type: 'delimiter.js' },
                        { startIndex: 18, type: htmlTokenTypes_1.DELIM_END, bracket: Modes.Bracket.Open },
                        { startIndex: 20, type: htmlTokenTypes_1.getTag('script') },
                        { startIndex: 26, type: htmlTokenTypes_1.DELIM_END, bracket: Modes.Bracket.Close }
                    ] }
            ]);
        });
        test('Embedded Content #9', function () {
            modesUtil.assertTokenization(tokenizationSupport, [{
                    line: '<script type="text/javascript" src="main.js"></script>',
                    tokens: [
                        { startIndex: 0, type: htmlTokenTypes_1.DELIM_START, bracket: Modes.Bracket.Open },
                        { startIndex: 1, type: htmlTokenTypes_1.getTag('script') },
                        { startIndex: 7, type: '' },
                        { startIndex: 8, type: htmlTokenTypes_1.ATTRIB_NAME },
                        { startIndex: 12, type: htmlTokenTypes_1.DELIM_ASSIGN },
                        { startIndex: 13, type: htmlTokenTypes_1.ATTRIB_VALUE },
                        { startIndex: 30, type: '' },
                        { startIndex: 31, type: htmlTokenTypes_1.ATTRIB_NAME },
                        { startIndex: 34, type: htmlTokenTypes_1.DELIM_ASSIGN },
                        { startIndex: 35, type: htmlTokenTypes_1.ATTRIB_VALUE },
                        { startIndex: 44, type: htmlTokenTypes_1.DELIM_START, bracket: Modes.Bracket.Close },
                        { startIndex: 45, type: htmlTokenTypes_1.DELIM_END, bracket: Modes.Bracket.Open },
                        { startIndex: 47, type: htmlTokenTypes_1.getTag('script') },
                        { startIndex: 53, type: htmlTokenTypes_1.DELIM_END, bracket: Modes.Bracket.Close }
                    ] }
            ]);
        });
        test('Tag with Attribute', function () {
            modesUtil.assertTokenization(tokenizationSupport, [{
                    line: '<abc foo="bar">',
                    tokens: [
                        { startIndex: 0, type: htmlTokenTypes_1.DELIM_START, bracket: Modes.Bracket.Open },
                        { startIndex: 1, type: htmlTokenTypes_1.getTag('abc') },
                        { startIndex: 4, type: '' },
                        { startIndex: 5, type: htmlTokenTypes_1.ATTRIB_NAME },
                        { startIndex: 8, type: htmlTokenTypes_1.DELIM_ASSIGN },
                        { startIndex: 9, type: htmlTokenTypes_1.ATTRIB_VALUE },
                        { startIndex: 14, type: htmlTokenTypes_1.DELIM_START, bracket: Modes.Bracket.Close }
                    ] }
            ]);
        });
        test('Tag with Empty Attribute Value', function () {
            modesUtil.assertTokenization(tokenizationSupport, [{
                    line: '<abc foo=\'bar\'>',
                    tokens: [
                        { startIndex: 0, type: htmlTokenTypes_1.DELIM_START, bracket: Modes.Bracket.Open },
                        { startIndex: 1, type: htmlTokenTypes_1.getTag('abc') },
                        { startIndex: 4, type: '' },
                        { startIndex: 5, type: htmlTokenTypes_1.ATTRIB_NAME },
                        { startIndex: 8, type: htmlTokenTypes_1.DELIM_ASSIGN },
                        { startIndex: 9, type: htmlTokenTypes_1.ATTRIB_VALUE },
                        { startIndex: 14, type: htmlTokenTypes_1.DELIM_START, bracket: Modes.Bracket.Close }
                    ] }
            ]);
        });
        test('Tag with empty atrributes', function () {
            modesUtil.assertTokenization(tokenizationSupport, [{
                    line: '<abc foo="">',
                    tokens: [
                        { startIndex: 0, type: htmlTokenTypes_1.DELIM_START, bracket: Modes.Bracket.Open },
                        { startIndex: 1, type: htmlTokenTypes_1.getTag('abc') },
                        { startIndex: 4, type: '' },
                        { startIndex: 5, type: htmlTokenTypes_1.ATTRIB_NAME },
                        { startIndex: 8, type: htmlTokenTypes_1.DELIM_ASSIGN },
                        { startIndex: 9, type: htmlTokenTypes_1.ATTRIB_VALUE },
                        { startIndex: 11, type: htmlTokenTypes_1.DELIM_START, bracket: Modes.Bracket.Close }
                    ] }
            ]);
        });
        test('Tag with Attributes', function () {
            modesUtil.assertTokenization(tokenizationSupport, [{
                    line: '<abc foo="bar" bar="foo">',
                    tokens: [
                        { startIndex: 0, type: htmlTokenTypes_1.DELIM_START, bracket: Modes.Bracket.Open },
                        { startIndex: 1, type: htmlTokenTypes_1.getTag('abc') },
                        { startIndex: 4, type: '' },
                        { startIndex: 5, type: htmlTokenTypes_1.ATTRIB_NAME },
                        { startIndex: 8, type: htmlTokenTypes_1.DELIM_ASSIGN },
                        { startIndex: 9, type: htmlTokenTypes_1.ATTRIB_VALUE },
                        { startIndex: 14, type: '' },
                        { startIndex: 15, type: htmlTokenTypes_1.ATTRIB_NAME },
                        { startIndex: 18, type: htmlTokenTypes_1.DELIM_ASSIGN },
                        { startIndex: 19, type: htmlTokenTypes_1.ATTRIB_VALUE },
                        { startIndex: 24, type: htmlTokenTypes_1.DELIM_START, bracket: Modes.Bracket.Close }
                    ] }
            ]);
        });
        test('Tag with Attribute And Whitespace', function () {
            modesUtil.assertTokenization(tokenizationSupport, [{
                    line: '<abc foo=  "bar">',
                    tokens: [
                        { startIndex: 0, type: htmlTokenTypes_1.DELIM_START, bracket: Modes.Bracket.Open },
                        { startIndex: 1, type: htmlTokenTypes_1.getTag('abc') },
                        { startIndex: 4, type: '' },
                        { startIndex: 5, type: htmlTokenTypes_1.ATTRIB_NAME },
                        { startIndex: 8, type: htmlTokenTypes_1.DELIM_ASSIGN },
                        { startIndex: 9, type: '' },
                        { startIndex: 11, type: htmlTokenTypes_1.ATTRIB_VALUE },
                        { startIndex: 16, type: htmlTokenTypes_1.DELIM_START, bracket: Modes.Bracket.Close }
                    ] }
            ]);
        });
        test('Tag with Attribute And Whitespace #2', function () {
            modesUtil.assertTokenization(tokenizationSupport, [{
                    line: '<abc foo = "bar">',
                    tokens: [
                        { startIndex: 0, type: htmlTokenTypes_1.DELIM_START, bracket: Modes.Bracket.Open },
                        { startIndex: 1, type: htmlTokenTypes_1.getTag('abc') },
                        { startIndex: 4, type: '' },
                        { startIndex: 5, type: htmlTokenTypes_1.ATTRIB_NAME },
                        { startIndex: 8, type: '' },
                        { startIndex: 9, type: htmlTokenTypes_1.DELIM_ASSIGN },
                        { startIndex: 10, type: '' },
                        { startIndex: 11, type: htmlTokenTypes_1.ATTRIB_VALUE },
                        { startIndex: 16, type: htmlTokenTypes_1.DELIM_START, bracket: Modes.Bracket.Close }
                    ] }
            ]);
        });
        test('Tag with Name-Only-Attribute #1', function () {
            modesUtil.assertTokenization(tokenizationSupport, [{
                    line: '<abc foo>',
                    tokens: [
                        { startIndex: 0, type: htmlTokenTypes_1.DELIM_START, bracket: Modes.Bracket.Open },
                        { startIndex: 1, type: htmlTokenTypes_1.getTag('abc') },
                        { startIndex: 4, type: '' },
                        { startIndex: 5, type: htmlTokenTypes_1.ATTRIB_NAME },
                        { startIndex: 8, type: htmlTokenTypes_1.DELIM_START, bracket: Modes.Bracket.Close }
                    ] }
            ]);
        });
        test('Tag with Name-Only-Attribute #2', function () {
            modesUtil.assertTokenization(tokenizationSupport, [{
                    line: '<abc foo bar>',
                    tokens: [
                        { startIndex: 0, type: htmlTokenTypes_1.DELIM_START, bracket: Modes.Bracket.Open },
                        { startIndex: 1, type: htmlTokenTypes_1.getTag('abc') },
                        { startIndex: 4, type: '' },
                        { startIndex: 5, type: htmlTokenTypes_1.ATTRIB_NAME },
                        { startIndex: 8, type: '' },
                        { startIndex: 9, type: htmlTokenTypes_1.ATTRIB_NAME },
                        { startIndex: 12, type: htmlTokenTypes_1.DELIM_START, bracket: Modes.Bracket.Close }
                    ] }
            ]);
        });
        test('Tag with Invalid Attribute Name', function () {
            modesUtil.assertTokenization(tokenizationSupport, [{
                    line: '<abc foo!@#="bar">',
                    tokens: [
                        { startIndex: 0, type: htmlTokenTypes_1.DELIM_START, bracket: Modes.Bracket.Open },
                        { startIndex: 1, type: htmlTokenTypes_1.getTag('abc') },
                        { startIndex: 4, type: '' },
                        { startIndex: 5, type: htmlTokenTypes_1.ATTRIB_NAME },
                        { startIndex: 8, type: '' },
                        { startIndex: 13, type: htmlTokenTypes_1.ATTRIB_NAME },
                        { startIndex: 16, type: '' },
                        { startIndex: 17, type: htmlTokenTypes_1.DELIM_START, bracket: Modes.Bracket.Close }
                    ] }
            ]);
        });
        test('Tag with Invalid Attribute Value', function () {
            modesUtil.assertTokenization(tokenizationSupport, [{
                    line: '<abc foo=">',
                    tokens: [
                        { startIndex: 0, type: htmlTokenTypes_1.DELIM_START, bracket: Modes.Bracket.Open },
                        { startIndex: 1, type: htmlTokenTypes_1.getTag('abc') },
                        { startIndex: 4, type: '' },
                        { startIndex: 5, type: htmlTokenTypes_1.ATTRIB_NAME },
                        { startIndex: 8, type: htmlTokenTypes_1.DELIM_ASSIGN },
                        { startIndex: 9, type: htmlTokenTypes_1.ATTRIB_VALUE }
                    ] }
            ]);
        });
        test('Simple Comment 1', function () {
            modesUtil.assertTokenization(tokenizationSupport, [{
                    line: '<!--a-->',
                    tokens: [
                        { startIndex: 0, type: htmlTokenTypes_1.DELIM_COMMENT, bracket: Modes.Bracket.Open },
                        { startIndex: 4, type: htmlTokenTypes_1.COMMENT },
                        { startIndex: 5, type: htmlTokenTypes_1.DELIM_COMMENT, bracket: Modes.Bracket.Close }
                    ] }
            ]);
        });
        test('Simple Comment 2', function () {
            modesUtil.assertTokenization(tokenizationSupport, [{
                    line: '<!--a>foo bar</a -->',
                    tokens: [
                        { startIndex: 0, type: htmlTokenTypes_1.DELIM_COMMENT, bracket: Modes.Bracket.Open },
                        { startIndex: 4, type: htmlTokenTypes_1.COMMENT },
                        { startIndex: 17, type: htmlTokenTypes_1.DELIM_COMMENT, bracket: Modes.Bracket.Close }
                    ] }
            ]);
        });
        test('Multiline Comment', function () {
            modesUtil.assertTokenization(tokenizationSupport, [{
                    line: '<!--a>\nfoo \nbar</a -->',
                    tokens: [
                        { startIndex: 0, type: htmlTokenTypes_1.DELIM_COMMENT, bracket: Modes.Bracket.Open },
                        { startIndex: 4, type: htmlTokenTypes_1.COMMENT },
                        { startIndex: 19, type: htmlTokenTypes_1.DELIM_COMMENT, bracket: Modes.Bracket.Close }
                    ] }
            ]);
        });
        test('Simple Doctype', function () {
            modesUtil.assertTokenization(tokenizationSupport, [{
                    line: '<!DOCTYPE a>',
                    tokens: [
                        { startIndex: 0, type: htmlTokenTypes_1.DELIM_DOCTYPE, bracket: Modes.Bracket.Open },
                        { startIndex: 9, type: htmlTokenTypes_1.DOCTYPE },
                        { startIndex: 11, type: htmlTokenTypes_1.DELIM_DOCTYPE, bracket: Modes.Bracket.Close }
                    ] }
            ]);
        });
        test('Simple Doctype #2', function () {
            modesUtil.assertTokenization(tokenizationSupport, [{
                    line: '<!doctype a>',
                    tokens: [
                        { startIndex: 0, type: htmlTokenTypes_1.DELIM_DOCTYPE, bracket: Modes.Bracket.Open },
                        { startIndex: 9, type: htmlTokenTypes_1.DOCTYPE },
                        { startIndex: 11, type: htmlTokenTypes_1.DELIM_DOCTYPE, bracket: Modes.Bracket.Close }
                    ] }
            ]);
        });
        test('Simple Doctype #4', function () {
            modesUtil.assertTokenization(tokenizationSupport, [{
                    line: '<!DOCTYPE a\n"foo" \'bar\'>',
                    tokens: [
                        { startIndex: 0, type: htmlTokenTypes_1.DELIM_DOCTYPE, bracket: Modes.Bracket.Open },
                        { startIndex: 9, type: htmlTokenTypes_1.DOCTYPE },
                        { startIndex: 23, type: htmlTokenTypes_1.DELIM_DOCTYPE, bracket: Modes.Bracket.Close }
                    ] }
            ]);
        });
        test('onEnter', function () {
            var model = new model_1.Model('<script type=\"text/javascript\">function f() { foo(); }', _mode);
            var actual = _mode.onEnterSupport.onEnter(model, {
                lineNumber: 1,
                column: 46
            });
            assert.equal(actual.indentAction, Modes.IndentAction.Indent);
            model.dispose();
        });
        test('onEnter', function () {
            assert.equal(onEnter('', 0), null);
            assert.equal(onEnter('>', 1), null);
            assert.equal(onEnter('span>', 5), null);
            assert.equal(onEnter('</span>', 7), null);
            assert.equal(onEnter('<img />', 7), null);
            assert.equal(onEnter('<span>', 6).indentAction, Modes.IndentAction.Indent);
            assert.equal(onEnter('<p>', 3).indentAction, Modes.IndentAction.Indent);
            assert.equal(onEnter('<span><span>', 6).indentAction, Modes.IndentAction.Indent);
            assert.equal(onEnter('<p><span>', 3).indentAction, Modes.IndentAction.Indent);
            assert.equal(onEnter('<span></span>', 6).indentAction, Modes.IndentAction.IndentOutdent);
            assert.equal(onEnter('<p></p>', 3).indentAction, Modes.IndentAction.IndentOutdent);
            assert.equal(onEnter('<span>a</span>', 6).indentAction, Modes.IndentAction.Indent);
            assert.equal(onEnter('<span>a</span>', 7).indentAction, Modes.IndentAction.IndentOutdent);
            assert.equal(onEnter('<span> </span>', 6).indentAction, Modes.IndentAction.Indent);
            assert.equal(onEnter('<span> </span>', 7).indentAction, Modes.IndentAction.IndentOutdent);
        });
    });
});
//# sourceMappingURL=html.test.js.map