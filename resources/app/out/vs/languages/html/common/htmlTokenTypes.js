/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/base/common/strings'], function (require, exports, strings) {
    exports.DELIM_END = 'punctuation.definition.meta.tag.end.html';
    exports.DELIM_START = 'punctuation.definition.meta.tag.begin.html';
    exports.DELIM_ASSIGN = 'meta.tag.assign.html';
    exports.ATTRIB_NAME = 'entity.other.attribute-name.html';
    exports.ATTRIB_VALUE = 'string.html';
    exports.COMMENT = 'comment.html.content';
    exports.DELIM_COMMENT = 'comment.html';
    exports.DOCTYPE = 'storage.content.html';
    exports.DELIM_DOCTYPE = 'storage.html';
    var TAG_PREFIX = 'entity.name.tag.tag-';
    function isTag(tokenType) {
        return strings.startsWith(tokenType, TAG_PREFIX);
    }
    exports.isTag = isTag;
    function getTag(name) {
        return TAG_PREFIX + name;
    }
    exports.getTag = getTag;
});
//# sourceMappingURL=htmlTokenTypes.js.map