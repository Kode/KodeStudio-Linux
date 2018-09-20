/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var vscode = require("vscode");
function fixDriveC(_path) {
    var root = path.parse(_path).root;
    return root.toLowerCase() === 'c:/' ?
        _path.replace(/^c:[/\\]/i, '/') :
        _path;
}
exports.fixDriveC = fixDriveC;
function anchorGlob(glob) {
    return glob.startsWith('**') || glob.startsWith('/') ? glob : "/" + glob;
}
exports.anchorGlob = anchorGlob;
function createTextSearchResult(uri, fullText, range, previewOptions) {
    var preview;
    if (previewOptions) {
        var previewStart = Math.max(range.start.character - previewOptions.leadingChars, 0);
        var previewEnd = previewOptions.totalChars + previewStart;
        var endOfMatchRangeInPreview = Math.min(previewEnd, range.end.character - previewStart);
        preview = {
            text: fullText.substring(previewStart, previewEnd),
            match: new vscode.Range(0, range.start.character - previewStart, 0, endOfMatchRangeInPreview)
        };
    }
    else {
        preview = {
            text: fullText,
            match: new vscode.Range(0, range.start.character, 0, range.end.character)
        };
    }
    return {
        uri: uri,
        range: range,
        preview: preview
    };
}
exports.createTextSearchResult = createTextSearchResult;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/b4f62a65292c32b44a9c2ab7739390fd05d4df2a/extensions/search-rg/out/utils.js.map
