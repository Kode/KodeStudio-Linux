/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/editor/test/common/modesUtil', 'vs/editor/common/modes', 'vs/languages/html/common/html', 'vs/languages/css/common/css', 'vs/languages/markdown/common/markdown.contribution'], function (require, exports, modesUtil, Modes, html_1, css_1) {
    suite('Markdown - tokenization', function () {
        var tokenizationSupport;
        setup(function (done) {
            modesUtil.load('markdown', ['html']).then(function (mode) {
                tokenizationSupport = mode.tokenizationSupport;
                done();
            });
        });
        test('', function () {
            modesUtil.executeTests(tokenizationSupport, [
                // HTML and embedded content - bug 16912
                [{
                        line: '<b>foo</b>*bar*',
                        tokens: [
                            { startIndex: 0, type: html_1.htmlTokenTypes.getTag('b.md'), bracket: Modes.Bracket.Open },
                            { startIndex: 3, type: '' },
                            { startIndex: 6, type: html_1.htmlTokenTypes.getTag('b.md'), bracket: Modes.Bracket.Close },
                            { startIndex: 10, type: 'emphasis.md' }
                        ] }],
                [{
                        line: '</b>*bar*',
                        tokens: [
                            { startIndex: 0, type: html_1.htmlTokenTypes.getTag('b.md'), bracket: Modes.Bracket.Close },
                            { startIndex: 4, type: 'emphasis.md' }
                        ] }],
                [{
                        line: '<script>alert("foo")</script>*bar*',
                        tokens: [
                            { startIndex: 0, type: html_1.htmlTokenTypes.getTag('script.md'), bracket: Modes.Bracket.Open },
                            { startIndex: 8, type: 'identifier.js' },
                            { startIndex: 13, type: 'delimiter.parenthesis.js', bracket: Modes.Bracket.Open },
                            { startIndex: 14, type: 'string.js' },
                            { startIndex: 19, type: 'delimiter.parenthesis.js', bracket: Modes.Bracket.Close },
                            { startIndex: 20, type: html_1.htmlTokenTypes.getTag('script.md'), bracket: Modes.Bracket.Close },
                            { startIndex: 29, type: 'emphasis.md' }
                        ] }],
                [{
                        line: '<style>div { background: red }</style>*bar*',
                        tokens: [
                            { startIndex: 0, type: html_1.htmlTokenTypes.getTag('style.md'), bracket: Modes.Bracket.Open },
                            { startIndex: 7, type: css_1.cssTokenTypes.TOKEN_SELECTOR_TAG + '.css' },
                            { startIndex: 10, type: '' },
                            { startIndex: 11, type: 'punctuation.bracket.css', bracket: Modes.Bracket.Open },
                            { startIndex: 12, type: '' },
                            { startIndex: 13, type: css_1.cssTokenTypes.TOKEN_PROPERTY + '.css' },
                            { startIndex: 23, type: 'punctuation.css' },
                            { startIndex: 24, type: '' },
                            { startIndex: 25, type: css_1.cssTokenTypes.TOKEN_VALUE + '.css' },
                            { startIndex: 28, type: '' },
                            { startIndex: 29, type: 'punctuation.bracket.css', bracket: Modes.Bracket.Close },
                            { startIndex: 30, type: html_1.htmlTokenTypes.getTag('style.md'), bracket: Modes.Bracket.Close },
                            { startIndex: 38, type: 'emphasis.md' }
                        ] }]
            ]);
        });
    });
});
//# sourceMappingURL=markdown.test.js.map