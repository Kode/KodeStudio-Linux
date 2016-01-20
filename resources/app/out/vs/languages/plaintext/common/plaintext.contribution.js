/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/editor/common/modes/modesRegistry', 'vs/languages/plaintext/common/plaintext'], function (require, exports, modesExtensions) {
    modesExtensions.registerMode({
        id: 'plaintext',
        extensions: ['.txt', '.gitignore'],
        aliases: ['Plain Text', 'text'],
        mimetypes: ['text/plain'],
        moduleId: 'vs/languages/plaintext/common/plaintext',
        ctorName: 'Mode'
    });
});
//# sourceMappingURL=plaintext.contribution.js.map