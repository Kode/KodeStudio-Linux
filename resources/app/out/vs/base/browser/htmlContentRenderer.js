/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/base/browser/dom'], function (require, exports, DOM) {
    function renderHtml2(content, actionCallback) {
        if (typeof content === 'string') {
            return [document.createTextNode(content)];
        }
        else if (Array.isArray(content)) {
            return content.map(function (piece) { return renderHtml(piece, actionCallback); });
        }
        else if (content) {
            return [renderHtml(content, actionCallback)];
        }
        return [];
    }
    exports.renderHtml2 = renderHtml2;
    /**
     * Create html nodes for the given content element.
     * formattedText property supports **bold**, __italics__, and [[actions]]
     * @param content a html element description
     * @param actionCallback a callback function for any action links in the string. Argument is the zero-based index of the clicked action.
     */
    function renderHtml(content, actionCallback, codeBlockRenderer) {
        if (content.isText) {
            return document.createTextNode(content.text);
        }
        var tagName = getSafeTagName(content.tagName) || 'div';
        var element = document.createElement(tagName);
        if (content.className) {
            element.className = content.className;
        }
        if (content.text) {
            element.textContent = content.text;
        }
        if (content.style) {
            element.setAttribute('style', content.style);
        }
        if (content.customStyle) {
            Object.keys(content.customStyle).forEach(function (key) {
                element.style[key] = content.customStyle[key];
            });
        }
        if (content.code && codeBlockRenderer) {
            var child = codeBlockRenderer(content.code.language, content.code.value);
            element.appendChild(renderHtml(child, actionCallback, codeBlockRenderer));
        }
        if (content.children) {
            content.children.forEach(function (child) {
                element.appendChild(renderHtml(child, actionCallback, codeBlockRenderer));
            });
        }
        if (content.formattedText) {
            renderFormattedText(element, parseFormattedText(content.formattedText), actionCallback);
        }
        return element;
    }
    exports.renderHtml = renderHtml;
    var SAFE_TAG_NAMES = {
        a: true,
        b: true,
        blockquote: true,
        code: true,
        del: true,
        dd: true,
        div: true,
        dl: true,
        dt: true,
        em: true,
        h1h2h3i: true,
        img: true,
        kbd: true,
        li: true,
        ol: true,
        p: true,
        pre: true,
        s: true,
        span: true,
        sup: true,
        sub: true,
        strong: true,
        strike: true,
        ul: true,
        br: true,
        hr: true,
    };
    function getSafeTagName(tagName) {
        if (!tagName) {
            return null;
        }
        if (SAFE_TAG_NAMES.hasOwnProperty(tagName)) {
            return tagName;
        }
        return null;
    }
    var StringStream = (function () {
        function StringStream(source) {
            this.source = source;
            this.index = 0;
        }
        StringStream.prototype.eos = function () {
            return this.index >= this.source.length;
        };
        StringStream.prototype.next = function () {
            var next = this.peek();
            this.advance();
            return next;
        };
        StringStream.prototype.peek = function () {
            return this.source[this.index];
        };
        StringStream.prototype.advance = function () {
            this.index++;
        };
        return StringStream;
    })();
    var FormatType;
    (function (FormatType) {
        FormatType[FormatType["Invalid"] = 0] = "Invalid";
        FormatType[FormatType["Root"] = 1] = "Root";
        FormatType[FormatType["Text"] = 2] = "Text";
        FormatType[FormatType["Bold"] = 3] = "Bold";
        FormatType[FormatType["Italics"] = 4] = "Italics";
        FormatType[FormatType["Action"] = 5] = "Action";
        FormatType[FormatType["ActionClose"] = 6] = "ActionClose";
        FormatType[FormatType["NewLine"] = 7] = "NewLine";
    })(FormatType || (FormatType = {}));
    function renderFormattedText(element, treeNode, actionCallback) {
        var child;
        if (treeNode.type === FormatType.Text) {
            child = document.createTextNode(treeNode.content);
        }
        else if (treeNode.type === FormatType.Bold) {
            child = document.createElement('b');
        }
        else if (treeNode.type === FormatType.Italics) {
            child = document.createElement('i');
        }
        else if (treeNode.type === FormatType.Action) {
            var a = document.createElement('a');
            a.href = '#';
            DOM.addStandardDisposableListener(a, 'click', function (event) {
                actionCallback(treeNode.index, event);
            });
            child = a;
        }
        else if (treeNode.type === FormatType.NewLine) {
            child = document.createElement('br');
        }
        else if (treeNode.type === FormatType.Root) {
            child = element;
        }
        if (element !== child) {
            element.appendChild(child);
        }
        if (Array.isArray(treeNode.children)) {
            treeNode.children.forEach(function (nodeChild) {
                renderFormattedText(child, nodeChild, actionCallback);
            });
        }
    }
    function parseFormattedText(content) {
        var root = {
            type: FormatType.Root,
            children: []
        };
        var actionItemIndex = 0;
        var current = root;
        var stack = [];
        var stream = new StringStream(content);
        while (!stream.eos()) {
            var next = stream.next();
            var isEscapedFormatType = (next === '\\' && formatTagType(stream.peek()) !== FormatType.Invalid);
            if (isEscapedFormatType) {
                next = stream.next(); // unread the backslash if it escapes a format tag type
            }
            if (!isEscapedFormatType && isFormatTag(next) && next === stream.peek()) {
                stream.advance();
                if (current.type === FormatType.Text) {
                    current = stack.pop();
                }
                var type = formatTagType(next);
                if (current.type === type || (current.type === FormatType.Action && type === FormatType.ActionClose)) {
                    current = stack.pop();
                }
                else {
                    var newCurrent = {
                        type: type,
                        children: []
                    };
                    if (type === FormatType.Action) {
                        newCurrent.index = actionItemIndex;
                        actionItemIndex++;
                    }
                    current.children.push(newCurrent);
                    stack.push(current);
                    current = newCurrent;
                }
            }
            else if (next === '\n') {
                if (current.type === FormatType.Text) {
                    current = stack.pop();
                }
                current.children.push({
                    type: FormatType.NewLine
                });
            }
            else {
                if (current.type !== FormatType.Text) {
                    var textCurrent = {
                        type: FormatType.Text,
                        content: next
                    };
                    current.children.push(textCurrent);
                    stack.push(current);
                    current = textCurrent;
                }
                else {
                    current.content += next;
                }
            }
        }
        if (current.type === FormatType.Text) {
            current = stack.pop();
        }
        if (stack.length) {
        }
        return root;
    }
    function isFormatTag(char) {
        return formatTagType(char) !== FormatType.Invalid;
    }
    function formatTagType(char) {
        switch (char) {
            case '*':
                return FormatType.Bold;
            case '_':
                return FormatType.Italics;
            case '[':
                return FormatType.Action;
            case ']':
                return FormatType.ActionClose;
            default:
                return FormatType.Invalid;
        }
    }
});
//# sourceMappingURL=htmlContentRenderer.js.map