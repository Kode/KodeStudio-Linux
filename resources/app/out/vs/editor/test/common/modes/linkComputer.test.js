/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'assert', 'vs/editor/common/modes/linkComputer'], function (require, exports, assert, LinkComputer) {
    var SimpleLinkComputerTarget = (function () {
        function SimpleLinkComputerTarget(_lines) {
            this._lines = _lines;
            // Intentional Empty
        }
        SimpleLinkComputerTarget.prototype.getLineCount = function () {
            return this._lines.length;
        };
        SimpleLinkComputerTarget.prototype.getLineContent = function (lineNumber) {
            return this._lines[lineNumber - 1];
        };
        return SimpleLinkComputerTarget;
    })();
    function computeLinks(lines) {
        var target = new SimpleLinkComputerTarget(lines);
        return LinkComputer.computeLinks(target);
    }
    function assertLink(text, extractedLink) {
        var startColumn = 0, endColumn = 0, chr, i = 0;
        for (i = 0; i < extractedLink.length; i++) {
            chr = extractedLink.charAt(i);
            if (chr !== ' ' && chr !== '\t') {
                startColumn = i + 1;
                break;
            }
        }
        for (i = extractedLink.length - 1; i >= 0; i--) {
            chr = extractedLink.charAt(i);
            if (chr !== ' ' && chr !== '\t') {
                endColumn = i + 2;
                break;
            }
        }
        var r = computeLinks([text]);
        assert.deepEqual(r, [{
                range: {
                    startLineNumber: 1,
                    startColumn: startColumn,
                    endLineNumber: 1,
                    endColumn: endColumn
                },
                url: extractedLink.substring(startColumn - 1, endColumn - 1)
            }]);
    }
    suite('Editor Modes - Link Computer', function () {
        test('Null model', function () {
            var r = LinkComputer.computeLinks(null);
            assert.deepEqual(r, []);
        });
        test('Parsing', function () {
            assertLink('x = "http://foo.bar";', '     http://foo.bar  ');
            assertLink('x = (http://foo.bar);', '     http://foo.bar  ');
            assertLink('x = [http://foo.bar];', '     http://foo.bar  ');
            assertLink('x = \'http://foo.bar\';', '     http://foo.bar  ');
            assertLink('x =  http://foo.bar ;', '     http://foo.bar  ');
            assertLink('x = <http://foo.bar>;', '     http://foo.bar  ');
            assertLink('x = {http://foo.bar};', '     http://foo.bar  ');
            assertLink('(see http://foo.bar)', '     http://foo.bar  ');
            assertLink('[see http://foo.bar]', '     http://foo.bar  ');
            assertLink('{see http://foo.bar}', '     http://foo.bar  ');
            assertLink('<see http://foo.bar>', '     http://foo.bar  ');
            assertLink('<url>http://mylink.com</url>', '     http://mylink.com      ');
            assertLink('// Click here to learn more. http://go.microsoft.com/fwlink/?LinkID=513275&clcid=0x409', '                             http://go.microsoft.com/fwlink/?LinkID=513275&clcid=0x409');
            assertLink('// https://github.com/projectkudu/kudu/blob/master/Kudu.Core/Scripts/selectNodeVersion.js', '   https://github.com/projectkudu/kudu/blob/master/Kudu.Core/Scripts/selectNodeVersion.js');
            assertLink('<!-- !!! Do not remove !!!   WebContentRef(link:http://go.microsoft.com/fwlink/?LinkId=166007, area:Admin, updated:2015, nextUpdate:2016, tags:SqlServer)   !!! Do not remove !!! -->', '                                                http://go.microsoft.com/fwlink/?LinkId=166007                                                                                        ');
            assertLink('For instructions, see http://go.microsoft.com/fwlink/?LinkId=166007.</value>', '                      http://go.microsoft.com/fwlink/?LinkId=166007         ');
            // foo bar (see http://www.w3schools.com/tags/att_iframe_sandbox.asp)
        });
    });
});
//# sourceMappingURL=linkComputer.test.js.map