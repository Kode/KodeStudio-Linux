/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/base/common/strings'], function (require, exports, strings) {
    function html(parts, className) {
        if (className === void 0) { className = strings.empty; }
        if (!parts) {
            return {};
        }
        var htmlParts = parts.map(function (part) {
            return {
                tagName: 'span',
                text: part.text,
                className: part.kind
            };
        });
        return {
            tagName: 'div',
            className: 'ts-symbol ' + className,
            children: htmlParts
        };
    }
    exports.html = html;
    function plain(parts) {
        if (!parts) {
            return strings.empty;
        }
        return parts.map(function (part) { return part.text; }).join(strings.empty);
    }
    exports.plain = plain;
});
//# sourceMappingURL=previewer.js.map