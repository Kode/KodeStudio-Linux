/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'assert', 'vs/platform/platform', 'vs/editor/common/modes/modesRegistry', 'vs/languages/plaintext/common/plaintext.contribution', 'vs/languages/html/common/html.contribution'], function (require, exports, assert, Platform, ModesExtensions) {
    suite('Editor Modes - Modes Registry', function () {
        test('Bug 12104: [f12] createModel not successfully handling mime type list?', function () {
            var modesRegistry = Platform.Registry.as(ModesExtensions.Extensions.EditorModes);
            assert.equal(modesRegistry.getModeId('text/html,text/plain'), 'html');
        });
    });
});
//# sourceMappingURL=modesRegistry.test.js.map