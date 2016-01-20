/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/editor/common/modes/modesRegistry'], function (require, exports, modesExtensions) {
    modesExtensions.registerMode({
        id: 'handlebars',
        extensions: ['.handlebars', '.hbs'],
        aliases: ['Handlebars', 'handlebars'],
        mimetypes: ['text/x-handlebars-template'],
        moduleId: 'vs/languages/handlebars/common/handlebars',
        ctorName: 'HandlebarsMode'
    });
});
//# sourceMappingURL=handlebars.contribution.js.map