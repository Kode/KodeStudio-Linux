/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/editor/common/modes', 'vs/editor/test/common/modesUtil', 'vs/languages/html/common/html', 'vs/languages/handlebars/common/handlebarsTokenTypes', 'vs/languages/handlebars/common/handlebars.contribution'], function (require, exports, Modes, modesUtil, html_1, handlebarsTokenTypes) {
    suite('Handlebars', function () {
        var tokenizationSupport;
        setup(function (done) {
            modesUtil.load('handlebars' /*, ['javascript']*/).then(function (mode) {
                tokenizationSupport = mode.tokenizationSupport;
                done();
            });
        });
        test('Just HTML', function () {
            modesUtil.assertTokenization(tokenizationSupport, [{
                    line: '<h1>handlebars!</h1>',
                    tokens: [
                        { startIndex: 0, type: html_1.htmlTokenTypes.DELIM_START, bracket: Modes.Bracket.Open },
                        { startIndex: 1, type: html_1.htmlTokenTypes.getTag('h1') },
                        { startIndex: 3, type: html_1.htmlTokenTypes.DELIM_START, bracket: Modes.Bracket.Close },
                        { startIndex: 4, type: '' },
                        { startIndex: 15, type: html_1.htmlTokenTypes.DELIM_END, bracket: Modes.Bracket.Open },
                        { startIndex: 17, type: html_1.htmlTokenTypes.getTag('h1') },
                        { startIndex: 19, type: html_1.htmlTokenTypes.DELIM_END, bracket: Modes.Bracket.Close }
                    ] }
            ]);
        });
        test('Expressions', function () {
            modesUtil.assertTokenization(tokenizationSupport, [{
                    line: '<h1>{{ title }}</h1>',
                    tokens: [
                        { startIndex: 0, type: html_1.htmlTokenTypes.DELIM_START, bracket: Modes.Bracket.Open },
                        { startIndex: 1, type: html_1.htmlTokenTypes.getTag('h1') },
                        { startIndex: 3, type: html_1.htmlTokenTypes.DELIM_START, bracket: Modes.Bracket.Close },
                        { startIndex: 4, type: handlebarsTokenTypes.EMBED, bracket: Modes.Bracket.Open },
                        { startIndex: 6, type: '' },
                        { startIndex: 7, type: handlebarsTokenTypes.VARIABLE },
                        { startIndex: 12, type: '' },
                        { startIndex: 13, type: handlebarsTokenTypes.EMBED, bracket: Modes.Bracket.Close },
                        { startIndex: 15, type: html_1.htmlTokenTypes.DELIM_END, bracket: Modes.Bracket.Open },
                        { startIndex: 17, type: html_1.htmlTokenTypes.getTag('h1') },
                        { startIndex: 19, type: html_1.htmlTokenTypes.DELIM_END, bracket: Modes.Bracket.Close }
                    ] }
            ]);
        });
        test('Expressions Sans Whitespace', function () {
            modesUtil.assertTokenization(tokenizationSupport, [{
                    line: '<h1>{{title}}</h1>',
                    tokens: [
                        { startIndex: 0, type: html_1.htmlTokenTypes.DELIM_START, bracket: Modes.Bracket.Open },
                        { startIndex: 1, type: html_1.htmlTokenTypes.getTag('h1') },
                        { startIndex: 3, type: html_1.htmlTokenTypes.DELIM_START, bracket: Modes.Bracket.Close },
                        { startIndex: 4, type: handlebarsTokenTypes.EMBED, bracket: Modes.Bracket.Open },
                        { startIndex: 6, type: handlebarsTokenTypes.VARIABLE },
                        { startIndex: 11, type: handlebarsTokenTypes.EMBED, bracket: Modes.Bracket.Close },
                        { startIndex: 13, type: html_1.htmlTokenTypes.DELIM_END, bracket: Modes.Bracket.Open },
                        { startIndex: 15, type: html_1.htmlTokenTypes.getTag('h1') },
                        { startIndex: 17, type: html_1.htmlTokenTypes.DELIM_END, bracket: Modes.Bracket.Close }
                    ] }
            ]);
        });
        test('Unescaped Expressions', function () {
            modesUtil.assertTokenization(tokenizationSupport, [{
                    line: '<h1>{{{ title }}}</h1>',
                    tokens: [
                        { startIndex: 0, type: html_1.htmlTokenTypes.DELIM_START, bracket: Modes.Bracket.Open },
                        { startIndex: 1, type: html_1.htmlTokenTypes.getTag('h1') },
                        { startIndex: 3, type: html_1.htmlTokenTypes.DELIM_START, bracket: Modes.Bracket.Close },
                        { startIndex: 4, type: handlebarsTokenTypes.EMBED_UNESCAPED, bracket: Modes.Bracket.Open },
                        { startIndex: 7, type: '' },
                        { startIndex: 8, type: handlebarsTokenTypes.VARIABLE },
                        { startIndex: 13, type: '' },
                        { startIndex: 14, type: handlebarsTokenTypes.EMBED_UNESCAPED, bracket: Modes.Bracket.Close },
                        { startIndex: 17, type: html_1.htmlTokenTypes.DELIM_END, bracket: Modes.Bracket.Open },
                        { startIndex: 19, type: html_1.htmlTokenTypes.getTag('h1') },
                        { startIndex: 21, type: html_1.htmlTokenTypes.DELIM_END, bracket: Modes.Bracket.Close }
                    ] }
            ]);
        });
        test('Blocks', function () {
            modesUtil.assertTokenization(tokenizationSupport, [{
                    line: '<ul>{{#each items}}<li>{{item}}</li>{{/each}}</ul>',
                    tokens: [
                        { startIndex: 0, type: html_1.htmlTokenTypes.DELIM_START, bracket: Modes.Bracket.Open },
                        { startIndex: 1, type: html_1.htmlTokenTypes.getTag('ul') },
                        { startIndex: 3, type: html_1.htmlTokenTypes.DELIM_START, bracket: Modes.Bracket.Close },
                        { startIndex: 4, type: handlebarsTokenTypes.EMBED, bracket: Modes.Bracket.Open },
                        { startIndex: 6, type: handlebarsTokenTypes.KEYWORD, bracket: Modes.Bracket.Open },
                        { startIndex: 11, type: '' },
                        { startIndex: 12, type: handlebarsTokenTypes.VARIABLE },
                        { startIndex: 17, type: handlebarsTokenTypes.EMBED, bracket: Modes.Bracket.Close },
                        { startIndex: 19, type: html_1.htmlTokenTypes.DELIM_START, bracket: Modes.Bracket.Open },
                        { startIndex: 20, type: html_1.htmlTokenTypes.getTag('li') },
                        { startIndex: 22, type: html_1.htmlTokenTypes.DELIM_START, bracket: Modes.Bracket.Close },
                        { startIndex: 23, type: handlebarsTokenTypes.EMBED, bracket: Modes.Bracket.Open },
                        { startIndex: 25, type: handlebarsTokenTypes.VARIABLE },
                        { startIndex: 29, type: handlebarsTokenTypes.EMBED, bracket: Modes.Bracket.Close },
                        { startIndex: 31, type: html_1.htmlTokenTypes.DELIM_END, bracket: Modes.Bracket.Open },
                        { startIndex: 33, type: html_1.htmlTokenTypes.getTag('li') },
                        { startIndex: 35, type: html_1.htmlTokenTypes.DELIM_END, bracket: Modes.Bracket.Close },
                        { startIndex: 36, type: handlebarsTokenTypes.EMBED, bracket: Modes.Bracket.Open },
                        { startIndex: 38, type: handlebarsTokenTypes.KEYWORD, bracket: Modes.Bracket.Close },
                        { startIndex: 43, type: handlebarsTokenTypes.EMBED, bracket: Modes.Bracket.Close },
                        { startIndex: 45, type: html_1.htmlTokenTypes.DELIM_END, bracket: Modes.Bracket.Open },
                        { startIndex: 47, type: html_1.htmlTokenTypes.getTag('ul') },
                        { startIndex: 49, type: html_1.htmlTokenTypes.DELIM_END, bracket: Modes.Bracket.Close }
                    ] }
            ]);
        });
        test('Multiline', function () {
            modesUtil.assertTokenization(tokenizationSupport, [{
                    line: '<div>',
                    tokens: [
                        { startIndex: 0, type: html_1.htmlTokenTypes.DELIM_START, bracket: Modes.Bracket.Open },
                        { startIndex: 1, type: html_1.htmlTokenTypes.getTag('div') },
                        { startIndex: 4, type: html_1.htmlTokenTypes.DELIM_START, bracket: Modes.Bracket.Close }
                    ] }, {
                    line: '{{#if foo}}',
                    tokens: [
                        { startIndex: 0, type: handlebarsTokenTypes.EMBED, bracket: Modes.Bracket.Open },
                        { startIndex: 2, type: handlebarsTokenTypes.KEYWORD, bracket: Modes.Bracket.Open },
                        { startIndex: 5, type: '' },
                        { startIndex: 6, type: handlebarsTokenTypes.VARIABLE },
                        { startIndex: 9, type: handlebarsTokenTypes.EMBED, bracket: Modes.Bracket.Close }
                    ] }, {
                    line: '<span>{{bar}}</span>',
                    tokens: [
                        { startIndex: 0, type: html_1.htmlTokenTypes.DELIM_START, bracket: Modes.Bracket.Open },
                        { startIndex: 1, type: html_1.htmlTokenTypes.getTag('span') },
                        { startIndex: 5, type: html_1.htmlTokenTypes.DELIM_START, bracket: Modes.Bracket.Close },
                        { startIndex: 6, type: handlebarsTokenTypes.EMBED, bracket: Modes.Bracket.Open },
                        { startIndex: 8, type: handlebarsTokenTypes.VARIABLE },
                        { startIndex: 11, type: handlebarsTokenTypes.EMBED, bracket: Modes.Bracket.Close },
                        { startIndex: 13, type: html_1.htmlTokenTypes.DELIM_END, bracket: Modes.Bracket.Open },
                        { startIndex: 15, type: html_1.htmlTokenTypes.getTag('span') },
                        { startIndex: 19, type: html_1.htmlTokenTypes.DELIM_END, bracket: Modes.Bracket.Close }
                    ] }, {
                    line: '{{/if}}',
                    tokens: null }
            ]);
        });
        test('Div end', function () {
            modesUtil.assertTokenization(tokenizationSupport, [{
                    line: '</div>',
                    tokens: [
                        { startIndex: 0, type: html_1.htmlTokenTypes.DELIM_END, bracket: Modes.Bracket.Open },
                        { startIndex: 2, type: html_1.htmlTokenTypes.getTag('div') },
                        { startIndex: 5, type: html_1.htmlTokenTypes.DELIM_END, bracket: Modes.Bracket.Close }
                    ] }
            ]);
        });
        // shamelessly stolen from the HTML test bed since Handlebars are a superset of HTML
        test('Embedded Content in HTML', function () {
            modesUtil.assertTokenization(tokenizationSupport, [{
                    line: '<script type="text/javascript">var i= 10;</script>',
                    tokens: [
                        { startIndex: 0, type: html_1.htmlTokenTypes.DELIM_START, bracket: Modes.Bracket.Open },
                        { startIndex: 1, type: html_1.htmlTokenTypes.getTag('script') },
                        { startIndex: 7, type: '' },
                        { startIndex: 8, type: html_1.htmlTokenTypes.ATTRIB_NAME },
                        { startIndex: 12, type: html_1.htmlTokenTypes.DELIM_ASSIGN },
                        { startIndex: 13, type: html_1.htmlTokenTypes.ATTRIB_VALUE },
                        { startIndex: 30, type: html_1.htmlTokenTypes.DELIM_START, bracket: Modes.Bracket.Close },
                        { startIndex: 31, type: 'keyword.js' },
                        { startIndex: 34, type: '' },
                        { startIndex: 35, type: 'identifier.js' },
                        { startIndex: 36, type: 'delimiter.js' },
                        { startIndex: 37, type: '' },
                        { startIndex: 38, type: 'number.js' },
                        { startIndex: 40, type: 'delimiter.js' },
                        { startIndex: 41, type: html_1.htmlTokenTypes.DELIM_END, bracket: Modes.Bracket.Open },
                        { startIndex: 43, type: html_1.htmlTokenTypes.getTag('script') },
                        { startIndex: 49, type: html_1.htmlTokenTypes.DELIM_END, bracket: Modes.Bracket.Close }
                    ] }
            ]);
        });
        test('HTML Expressions', function () {
            modesUtil.assertTokenization(tokenizationSupport, [{
                    line: '<script type="text/x-handlebars-template"><h1>{{ title }}</h1></script>',
                    tokens: [
                        { startIndex: 0, type: html_1.htmlTokenTypes.DELIM_START, bracket: Modes.Bracket.Open },
                        { startIndex: 1, type: html_1.htmlTokenTypes.getTag('script') },
                        { startIndex: 7, type: '' },
                        { startIndex: 8, type: html_1.htmlTokenTypes.ATTRIB_NAME },
                        { startIndex: 12, type: html_1.htmlTokenTypes.DELIM_ASSIGN },
                        { startIndex: 13, type: html_1.htmlTokenTypes.ATTRIB_VALUE },
                        { startIndex: 41, type: html_1.htmlTokenTypes.DELIM_START, bracket: Modes.Bracket.Close },
                        { startIndex: 42, type: html_1.htmlTokenTypes.DELIM_START, bracket: Modes.Bracket.Open },
                        { startIndex: 43, type: html_1.htmlTokenTypes.getTag('h1') },
                        { startIndex: 45, type: html_1.htmlTokenTypes.DELIM_START, bracket: Modes.Bracket.Close },
                        { startIndex: 46, type: handlebarsTokenTypes.EMBED, bracket: Modes.Bracket.Open },
                        { startIndex: 48, type: '' },
                        { startIndex: 49, type: handlebarsTokenTypes.VARIABLE },
                        { startIndex: 54, type: '' },
                        { startIndex: 55, type: handlebarsTokenTypes.EMBED, bracket: Modes.Bracket.Close },
                        { startIndex: 57, type: html_1.htmlTokenTypes.DELIM_END, bracket: Modes.Bracket.Open },
                        { startIndex: 59, type: html_1.htmlTokenTypes.getTag('h1') },
                        { startIndex: 61, type: html_1.htmlTokenTypes.DELIM_END, bracket: Modes.Bracket.Close },
                        { startIndex: 62, type: html_1.htmlTokenTypes.DELIM_END, bracket: Modes.Bracket.Open },
                        { startIndex: 64, type: html_1.htmlTokenTypes.getTag('script') },
                        { startIndex: 70, type: html_1.htmlTokenTypes.DELIM_END, bracket: Modes.Bracket.Close }
                    ] }
            ]);
        });
        test('Multi-line HTML Expressions', function () {
            modesUtil.assertTokenization(tokenizationSupport, [{
                    line: '<script type="text/x-handlebars-template">',
                    tokens: [
                        { startIndex: 0, type: html_1.htmlTokenTypes.DELIM_START, bracket: Modes.Bracket.Open },
                        { startIndex: 1, type: html_1.htmlTokenTypes.getTag('script') },
                        { startIndex: 7, type: '' },
                        { startIndex: 8, type: html_1.htmlTokenTypes.ATTRIB_NAME },
                        { startIndex: 12, type: html_1.htmlTokenTypes.DELIM_ASSIGN },
                        { startIndex: 13, type: html_1.htmlTokenTypes.ATTRIB_VALUE },
                        { startIndex: 41, type: html_1.htmlTokenTypes.DELIM_START, bracket: Modes.Bracket.Close }
                    ] }, {
                    line: '<h1>{{ title }}</h1>',
                    tokens: [
                        { startIndex: 0, type: html_1.htmlTokenTypes.DELIM_START, bracket: Modes.Bracket.Open },
                        { startIndex: 1, type: html_1.htmlTokenTypes.getTag('h1') },
                        { startIndex: 3, type: html_1.htmlTokenTypes.DELIM_START, bracket: Modes.Bracket.Close },
                        { startIndex: 4, type: handlebarsTokenTypes.EMBED, bracket: Modes.Bracket.Open },
                        { startIndex: 6, type: '' },
                        { startIndex: 7, type: handlebarsTokenTypes.VARIABLE },
                        { startIndex: 12, type: '' },
                        { startIndex: 13, type: handlebarsTokenTypes.EMBED, bracket: Modes.Bracket.Close },
                        { startIndex: 15, type: html_1.htmlTokenTypes.DELIM_END, bracket: Modes.Bracket.Open },
                        { startIndex: 17, type: html_1.htmlTokenTypes.getTag('h1') },
                        { startIndex: 19, type: html_1.htmlTokenTypes.DELIM_END, bracket: Modes.Bracket.Close }
                    ] }, {
                    line: '</script>',
                    tokens: [
                        { startIndex: 0, type: html_1.htmlTokenTypes.DELIM_END, bracket: Modes.Bracket.Open },
                        { startIndex: 2, type: html_1.htmlTokenTypes.getTag('script') },
                        { startIndex: 8, type: html_1.htmlTokenTypes.DELIM_END, bracket: Modes.Bracket.Close }
                    ] }
            ]);
        });
        test('HTML Nested Modes', function () {
            modesUtil.assertTokenization(tokenizationSupport, [{
                    line: '{{foo}}<script></script>{{bar}}',
                    tokens: [
                        { startIndex: 0, type: handlebarsTokenTypes.EMBED, bracket: Modes.Bracket.Open },
                        { startIndex: 2, type: handlebarsTokenTypes.VARIABLE },
                        { startIndex: 5, type: handlebarsTokenTypes.EMBED, bracket: Modes.Bracket.Close },
                        { startIndex: 7, type: html_1.htmlTokenTypes.DELIM_START, bracket: Modes.Bracket.Open },
                        { startIndex: 8, type: html_1.htmlTokenTypes.getTag('script') },
                        { startIndex: 14, type: html_1.htmlTokenTypes.DELIM_START, bracket: Modes.Bracket.Close },
                        { startIndex: 15, type: html_1.htmlTokenTypes.DELIM_END, bracket: Modes.Bracket.Open },
                        { startIndex: 17, type: html_1.htmlTokenTypes.getTag('script') },
                        { startIndex: 23, type: html_1.htmlTokenTypes.DELIM_END, bracket: Modes.Bracket.Close },
                        { startIndex: 24, type: handlebarsTokenTypes.EMBED, bracket: Modes.Bracket.Open },
                        { startIndex: 26, type: handlebarsTokenTypes.VARIABLE },
                        { startIndex: 29, type: handlebarsTokenTypes.EMBED, bracket: Modes.Bracket.Close }
                    ] }
            ]);
        });
        test('else keyword', function () {
            modesUtil.assertTokenization(tokenizationSupport, [{
                    line: '{{else}}',
                    tokens: [
                        { startIndex: 0, type: handlebarsTokenTypes.EMBED, bracket: Modes.Bracket.Open },
                        { startIndex: 2, type: handlebarsTokenTypes.KEYWORD },
                        { startIndex: 6, type: handlebarsTokenTypes.EMBED, bracket: Modes.Bracket.Close }
                    ] }
            ]);
        });
        test('else keyword #2', function () {
            modesUtil.assertTokenization(tokenizationSupport, [{
                    line: '{{elseFoo}}',
                    tokens: [
                        { startIndex: 0, type: handlebarsTokenTypes.EMBED, bracket: Modes.Bracket.Open },
                        { startIndex: 2, type: handlebarsTokenTypes.VARIABLE },
                        { startIndex: 9, type: handlebarsTokenTypes.EMBED, bracket: Modes.Bracket.Close }
                    ] }
            ]);
        });
        test('Token inside attribute', function () {
            modesUtil.assertTokenization(tokenizationSupport, [{
                    line: '<a href="/posts/{{permalink}}">',
                    tokens: [
                        { startIndex: 0, type: html_1.htmlTokenTypes.DELIM_START, bracket: Modes.Bracket.Open },
                        { startIndex: 1, type: html_1.htmlTokenTypes.getTag('a') },
                        { startIndex: 2, type: '' },
                        { startIndex: 3, type: html_1.htmlTokenTypes.ATTRIB_NAME },
                        { startIndex: 7, type: html_1.htmlTokenTypes.DELIM_ASSIGN },
                        { startIndex: 8, type: html_1.htmlTokenTypes.ATTRIB_VALUE },
                        { startIndex: 16, type: handlebarsTokenTypes.EMBED, bracket: Modes.Bracket.Open },
                        { startIndex: 18, type: handlebarsTokenTypes.VARIABLE },
                        { startIndex: 27, type: handlebarsTokenTypes.EMBED, bracket: Modes.Bracket.Close },
                        { startIndex: 29, type: html_1.htmlTokenTypes.ATTRIB_VALUE },
                        { startIndex: 30, type: html_1.htmlTokenTypes.DELIM_START, bracket: Modes.Bracket.Close }
                    ] }
            ]);
        });
    });
});
//# sourceMappingURL=handlebars.test.js.map