/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/editor/common/model/model'], function (require, exports, Model) {
    function pos(lineNumber, column) {
        return {
            lineNumber: lineNumber,
            column: column
        };
    }
    exports.pos = pos;
    function withEditorModel(text, callback) {
        var model = new Model.Model(text.join('\n'), null);
        callback(model);
        model.dispose();
    }
    exports.withEditorModel = withEditorModel;
});
//# sourceMappingURL=editorTestUtils.js.map