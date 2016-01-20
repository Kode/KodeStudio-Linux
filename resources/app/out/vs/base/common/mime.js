/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/base/common/paths', 'vs/base/common/types', 'vs/base/common/strings'], function (require, exports, paths, types, strings) {
    exports.MIME_TEXT = 'text/plain';
    exports.MIME_BINARY = 'application/octet-stream';
    exports.MIME_UNKNOWN = 'application/unknown';
    var registeredTextMimesByFilename = Object.create(null);
    var registeredTextMimesByFirstLine = [];
    // This is for automatic generation at native.guplfile.js#41 => darwinBundleDocumentTypes.extensions
    function generateKnownFilenames(onlyExtensions) {
        if (onlyExtensions === void 0) { onlyExtensions = true; }
        var filter = function (ext) {
            if (onlyExtensions) {
                return /^\./.test(ext);
            }
            return true;
        };
        var removeLeadingDot = function (ext) {
            return ext.replace(/^\./, '');
        };
        var list = [];
        list = list.concat(Object.keys(registeredTextMimesByFilename));
        list = list.filter(filter).map(removeLeadingDot);
        list.sort();
        var result = [];
        var currentLetter = null;
        var previousItem = null;
        var currentRow = [];
        var pushCurrentRow = function () {
            if (currentRow.length > 0) {
                result.push('\'' + currentRow.join('\', \'') + '\'');
            }
        };
        for (var i = 0, len = list.length; i < len; i++) {
            var item = list[i];
            if (item.length === 0) {
                continue;
            }
            if (item === previousItem) {
                continue;
            }
            var letter = item.charAt(0);
            if (currentLetter !== letter) {
                pushCurrentRow();
                currentLetter = letter;
                currentRow = [];
            }
            currentRow.push(item);
            previousItem = item;
        }
        pushCurrentRow();
        return result.join(',\n');
    }
    exports.generateKnownFilenames = generateKnownFilenames;
    /**
     * Allow to register extra text mimes dynamically based on filename
     */
    function registerTextMimeByFilename(nameOrExtension, mime) {
        if (nameOrExtension && mime) {
            if (registeredTextMimesByFilename[nameOrExtension] && registeredTextMimesByFilename[nameOrExtension] !== mime) {
                console.warn('Overwriting filename <<' + nameOrExtension + '>> to now point to mime <<' + mime + '>>');
            }
            registeredTextMimesByFilename[nameOrExtension] = mime;
        }
    }
    exports.registerTextMimeByFilename = registerTextMimeByFilename;
    /**
     * Allow to register extra text mimes dynamically based on firstline
     */
    function registerTextMimeByFirstLine(firstLineRegexp, mime) {
        if (firstLineRegexp && mime) {
            registeredTextMimesByFirstLine.push({ regexp: firstLineRegexp, mime: mime });
        }
    }
    exports.registerTextMimeByFirstLine = registerTextMimeByFirstLine;
    function isBinaryMime(mimes) {
        if (!mimes) {
            return false;
        }
        var mimeVals;
        if (types.isArray(mimes)) {
            mimeVals = mimes;
        }
        else {
            mimeVals = mimes.split(',').map(function (mime) { return mime.trim(); });
        }
        return mimeVals.indexOf(exports.MIME_BINARY) >= 0;
    }
    exports.isBinaryMime = isBinaryMime;
    /**
     * New function for mime type detection supporting application/unknown as concept.
     */
    function guessMimeTypes(path, firstLine) {
        if (!path) {
            return [exports.MIME_UNKNOWN];
        }
        // 1.) Firstline gets highest priority
        if (firstLine) {
            if (strings.startsWithUTF8BOM(firstLine)) {
                firstLine = firstLine.substr(1);
            }
            if (firstLine.length > 0) {
                for (var i = 0; i < registeredTextMimesByFirstLine.length; ++i) {
                    // Make sure the entire line matches, not just a subpart.
                    var matches = firstLine.match(registeredTextMimesByFirstLine[i].regexp);
                    if (matches && matches.length > 0 && matches[0].length === firstLine.length) {
                        return [registeredTextMimesByFirstLine[i].mime, exports.MIME_TEXT];
                    }
                }
            }
        }
        // Check with file name and extension
        path = path.toLowerCase();
        var filename = paths.basename(path);
        var exactNameMatch;
        var extensionMatch;
        // Check for dynamically registered match based on filename and extension
        for (var nameOrExtension in registeredTextMimesByFilename) {
            var nameOrExtensionLower = nameOrExtension.toLowerCase();
            // First exact name match
            if (!exactNameMatch && filename === nameOrExtensionLower) {
                exactNameMatch = nameOrExtension;
                break; // take it!
            }
            // Longest extension match
            if (nameOrExtension[0] === '.' && strings.endsWith(filename, nameOrExtensionLower)) {
                if (!extensionMatch || nameOrExtensionLower.length > extensionMatch.length) {
                    extensionMatch = nameOrExtension;
                }
            }
        }
        // 2.) Exact name match has second highest prio
        if (exactNameMatch) {
            return [registeredTextMimesByFilename[exactNameMatch], exports.MIME_TEXT];
        }
        // 3.) Match on extension comes last
        if (extensionMatch) {
            return [registeredTextMimesByFilename[extensionMatch], exports.MIME_TEXT];
        }
        return [exports.MIME_UNKNOWN];
    }
    exports.guessMimeTypes = guessMimeTypes;
    function isUnspecific(mime) {
        if (!mime) {
            return true;
        }
        if (typeof mime === 'string') {
            return mime === exports.MIME_BINARY || mime === exports.MIME_TEXT || mime === exports.MIME_UNKNOWN;
        }
        return mime.length === 1 && isUnspecific(mime[0]);
    }
    exports.isUnspecific = isUnspecific;
    function suggestFilename(theMime, prefix) {
        for (var fileExtension in registeredTextMimesByFilename) {
            var mime = registeredTextMimesByFilename[fileExtension];
            if (mime === theMime) {
                return prefix + fileExtension;
            }
        }
        return null;
    }
    exports.suggestFilename = suggestFilename;
});
//# sourceMappingURL=mime.js.map