/*!--------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
(function() {
var __m = ["exports","require","vs/base/common/strings","vs/base/common/paths","vs/base/common/platform","vs/base/common/network","vs/base/common/resources","vs/base/common/uri","vs/workbench/parts/output/common/outputLinkComputer","vs/base/common/arrays","vs/editor/common/core/range"];
var __M = function(deps) {
  var result = [];
  for (var i = 0, len = deps.length; i < len; i++) {
    result[i] = __m[deps[i]];
  }
  return result;
};
define(__m[5/*vs/base/common/network*/], __M([1/*require*/,0/*exports*/]), function (require, exports) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var Schemas;
    (function (Schemas) {
        /**
         * A schema that is used for models that exist in memory
         * only and that have no correspondence on a server or such.
         */
        Schemas.inMemory = 'inmemory';
        /**
         * A schema that is used for setting files
         */
        Schemas.vscode = 'vscode';
        /**
         * A schema that is used for internal private files
         */
        Schemas.internal = 'private';
        /**
         * A walk-through document.
         */
        Schemas.walkThrough = 'walkThrough';
        /**
         * An embedded code snippet.
         */
        Schemas.walkThroughSnippet = 'walkThroughSnippet';
        Schemas.http = 'http';
        Schemas.https = 'https';
        Schemas.file = 'file';
        Schemas.mailto = 'mailto';
        Schemas.untitled = 'untitled';
        Schemas.data = 'data';
    })(Schemas = exports.Schemas || (exports.Schemas = {}));
});

define(__m[3/*vs/base/common/paths*/], __M([1/*require*/,0/*exports*/,4/*vs/base/common/platform*/,2/*vs/base/common/strings*/]), function (require, exports, platform_1, strings_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * The forward slash path separator.
     */
    exports.sep = '/';
    /**
     * The native path separator depending on the OS.
     */
    exports.nativeSep = platform_1.isWindows ? '\\' : '/';
    /**
     * @param path the path to get the dirname from
     * @param separator the separator to use
     * @returns the directory name of a path.
     *
     */
    function dirname(path, separator) {
        if (separator === void 0) { separator = exports.nativeSep; }
        var idx = ~path.lastIndexOf('/') || ~path.lastIndexOf('\\');
        if (idx === 0) {
            return '.';
        }
        else if (~idx === 0) {
            return path[0];
        }
        else if (~idx === path.length - 1) {
            return dirname(path.substring(0, path.length - 1));
        }
        else {
            var res = path.substring(0, ~idx);
            if (platform_1.isWindows && res[res.length - 1] === ':') {
                res += separator; // make sure drive letters end with backslash
            }
            return res;
        }
    }
    exports.dirname = dirname;
    /**
     * @returns the base name of a path.
     */
    function basename(path) {
        var idx = ~path.lastIndexOf('/') || ~path.lastIndexOf('\\');
        if (idx === 0) {
            return path;
        }
        else if (~idx === path.length - 1) {
            return basename(path.substring(0, path.length - 1));
        }
        else {
            return path.substr(~idx + 1);
        }
    }
    exports.basename = basename;
    /**
     * @returns `.far` from `boo.far` or the empty string.
     */
    function extname(path) {
        path = basename(path);
        var idx = ~path.lastIndexOf('.');
        return idx ? path.substring(~idx) : '';
    }
    exports.extname = extname;
    var _posixBadPath = /(\/\.\.?\/)|(\/\.\.?)$|^(\.\.?\/)|(\/\/+)|(\\)/;
    var _winBadPath = /(\\\.\.?\\)|(\\\.\.?)$|^(\.\.?\\)|(\\\\+)|(\/)/;
    function _isNormal(path, win) {
        return win
            ? !_winBadPath.test(path)
            : !_posixBadPath.test(path);
    }
    function normalize(path, toOSPath) {
        if (path === null || path === void 0) {
            return path;
        }
        var len = path.length;
        if (len === 0) {
            return '.';
        }
        var wantsBackslash = platform_1.isWindows && toOSPath;
        if (_isNormal(path, wantsBackslash)) {
            return path;
        }
        var sep = wantsBackslash ? '\\' : '/';
        var root = getRoot(path, sep);
        // skip the root-portion of the path
        var start = root.length;
        var skip = false;
        var res = '';
        for (var end = root.length; end <= len; end++) {
            // either at the end or at a path-separator character
            if (end === len || path.charCodeAt(end) === 47 /* Slash */ || path.charCodeAt(end) === 92 /* Backslash */) {
                if (streql(path, start, end, '..')) {
                    // skip current and remove parent (if there is already something)
                    var prev_start = res.lastIndexOf(sep);
                    var prev_part = res.slice(prev_start + 1);
                    if ((root || prev_part.length > 0) && prev_part !== '..') {
                        res = prev_start === -1 ? '' : res.slice(0, prev_start);
                        skip = true;
                    }
                }
                else if (streql(path, start, end, '.') && (root || res || end < len - 1)) {
                    // skip current (if there is already something or if there is more to come)
                    skip = true;
                }
                if (!skip) {
                    var part = path.slice(start, end);
                    if (res !== '' && res[res.length - 1] !== sep) {
                        res += sep;
                    }
                    res += part;
                }
                start = end + 1;
                skip = false;
            }
        }
        return root + res;
    }
    exports.normalize = normalize;
    function streql(value, start, end, other) {
        return start + other.length === end && value.indexOf(other, start) === start;
    }
    /**
     * Computes the _root_ this path, like `getRoot('c:\files') === c:\`,
     * `getRoot('files:///files/path') === files:///`,
     * or `getRoot('\\server\shares\path') === \\server\shares\`
     */
    function getRoot(path, sep) {
        if (sep === void 0) { sep = '/'; }
        if (!path) {
            return '';
        }
        var len = path.length;
        var code = path.charCodeAt(0);
        if (code === 47 /* Slash */ || code === 92 /* Backslash */) {
            code = path.charCodeAt(1);
            if (code === 47 /* Slash */ || code === 92 /* Backslash */) {
                // UNC candidate \\localhost\shares\ddd
                //               ^^^^^^^^^^^^^^^^^^^
                code = path.charCodeAt(2);
                if (code !== 47 /* Slash */ && code !== 92 /* Backslash */) {
                    var pos_1 = 3;
                    var start = pos_1;
                    for (; pos_1 < len; pos_1++) {
                        code = path.charCodeAt(pos_1);
                        if (code === 47 /* Slash */ || code === 92 /* Backslash */) {
                            break;
                        }
                    }
                    code = path.charCodeAt(pos_1 + 1);
                    if (start !== pos_1 && code !== 47 /* Slash */ && code !== 92 /* Backslash */) {
                        pos_1 += 1;
                        for (; pos_1 < len; pos_1++) {
                            code = path.charCodeAt(pos_1);
                            if (code === 47 /* Slash */ || code === 92 /* Backslash */) {
                                return path.slice(0, pos_1 + 1) // consume this separator
                                    .replace(/[\\/]/g, sep);
                            }
                        }
                    }
                }
            }
            // /user/far
            // ^
            return sep;
        }
        else if ((code >= 65 /* A */ && code <= 90 /* Z */) || (code >= 97 /* a */ && code <= 122 /* z */)) {
            // check for windows drive letter c:\ or c:
            if (path.charCodeAt(1) === 58 /* Colon */) {
                code = path.charCodeAt(2);
                if (code === 47 /* Slash */ || code === 92 /* Backslash */) {
                    // C:\fff
                    // ^^^
                    return path.slice(0, 2) + sep;
                }
                else {
                    // C:
                    // ^^
                    return path.slice(0, 2);
                }
            }
        }
        // check for URI
        // scheme://authority/path
        // ^^^^^^^^^^^^^^^^^^^
        var pos = path.indexOf('://');
        if (pos !== -1) {
            pos += 3; // 3 -> "://".length
            for (; pos < len; pos++) {
                code = path.charCodeAt(pos);
                if (code === 47 /* Slash */ || code === 92 /* Backslash */) {
                    return path.slice(0, pos + 1); // consume this separator
                }
            }
        }
        return '';
    }
    exports.getRoot = getRoot;
    exports.join = function () {
        // Not using a function with var-args because of how TS compiles
        // them to JS - it would result in 2*n runtime cost instead
        // of 1*n, where n is parts.length.
        var value = '';
        for (var i = 0; i < arguments.length; i++) {
            var part = arguments[i];
            if (i > 0) {
                // add the separater between two parts unless
                // there already is one
                var last = value.charCodeAt(value.length - 1);
                if (last !== 47 /* Slash */ && last !== 92 /* Backslash */) {
                    var next = part.charCodeAt(0);
                    if (next !== 47 /* Slash */ && next !== 92 /* Backslash */) {
                        value += exports.sep;
                    }
                }
            }
            value += part;
        }
        return normalize(value);
    };
    /**
     * Check if the path follows this pattern: `\\hostname\sharename`.
     *
     * @see https://msdn.microsoft.com/en-us/library/gg465305.aspx
     * @return A boolean indication if the path is a UNC path, on none-windows
     * always false.
     */
    function isUNC(path) {
        if (!platform_1.isWindows) {
            // UNC is a windows concept
            return false;
        }
        if (!path || path.length < 5) {
            // at least \\a\b
            return false;
        }
        var code = path.charCodeAt(0);
        if (code !== 92 /* Backslash */) {
            return false;
        }
        code = path.charCodeAt(1);
        if (code !== 92 /* Backslash */) {
            return false;
        }
        var pos = 2;
        var start = pos;
        for (; pos < path.length; pos++) {
            code = path.charCodeAt(pos);
            if (code === 92 /* Backslash */) {
                break;
            }
        }
        if (start === pos) {
            return false;
        }
        code = path.charCodeAt(pos + 1);
        if (isNaN(code) || code === 92 /* Backslash */) {
            return false;
        }
        return true;
    }
    exports.isUNC = isUNC;
    // Reference: https://en.wikipedia.org/wiki/Filename
    var INVALID_FILE_CHARS = platform_1.isWindows ? /[\\/:\*\?"<>\|]/g : /[\\/]/g;
    var WINDOWS_FORBIDDEN_NAMES = /^(con|prn|aux|clock\$|nul|lpt[0-9]|com[0-9])$/i;
    function isValidBasename(name) {
        if (!name || name.length === 0 || /^\s+$/.test(name)) {
            return false; // require a name that is not just whitespace
        }
        INVALID_FILE_CHARS.lastIndex = 0; // the holy grail of software development
        if (INVALID_FILE_CHARS.test(name)) {
            return false; // check for certain invalid file characters
        }
        if (platform_1.isWindows && WINDOWS_FORBIDDEN_NAMES.test(name)) {
            return false; // check for certain invalid file names
        }
        if (name === '.' || name === '..') {
            return false; // check for reserved values
        }
        if (platform_1.isWindows && name[name.length - 1] === '.') {
            return false; // Windows: file cannot end with a "."
        }
        if (platform_1.isWindows && name.length !== name.trim().length) {
            return false; // Windows: file cannot end with a whitespace
        }
        return true;
    }
    exports.isValidBasename = isValidBasename;
    function isEqual(pathA, pathB, ignoreCase) {
        var identityEquals = (pathA === pathB);
        if (!ignoreCase || identityEquals) {
            return identityEquals;
        }
        if (!pathA || !pathB) {
            return false;
        }
        return strings_1.equalsIgnoreCase(pathA, pathB);
    }
    exports.isEqual = isEqual;
    function isEqualOrParent(path, candidate, ignoreCase, separator) {
        if (separator === void 0) { separator = exports.nativeSep; }
        if (path === candidate) {
            return true;
        }
        if (!path || !candidate) {
            return false;
        }
        if (candidate.length > path.length) {
            return false;
        }
        if (ignoreCase) {
            var beginsWith = strings_1.startsWithIgnoreCase(path, candidate);
            if (!beginsWith) {
                return false;
            }
            if (candidate.length === path.length) {
                return true; // same path, different casing
            }
            var sepOffset = candidate.length;
            if (candidate.charAt(candidate.length - 1) === separator) {
                sepOffset--; // adjust the expected sep offset in case our candidate already ends in separator character
            }
            return path.charAt(sepOffset) === separator;
        }
        if (candidate.charAt(candidate.length - 1) !== separator) {
            candidate += separator;
        }
        return path.indexOf(candidate) === 0;
    }
    exports.isEqualOrParent = isEqualOrParent;
    /**
     * Adapted from Node's path.isAbsolute functions
     */
    function isAbsolute(path) {
        return platform_1.isWindows ?
            isAbsolute_win32(path) :
            isAbsolute_posix(path);
    }
    exports.isAbsolute = isAbsolute;
    function isAbsolute_win32(path) {
        if (!path) {
            return false;
        }
        var char0 = path.charCodeAt(0);
        if (char0 === 47 /* Slash */ || char0 === 92 /* Backslash */) {
            return true;
        }
        else if ((char0 >= 65 /* A */ && char0 <= 90 /* Z */) || (char0 >= 97 /* a */ && char0 <= 122 /* z */)) {
            if (path.length > 2 && path.charCodeAt(1) === 58 /* Colon */) {
                var char2 = path.charCodeAt(2);
                if (char2 === 47 /* Slash */ || char2 === 92 /* Backslash */) {
                    return true;
                }
            }
        }
        return false;
    }
    exports.isAbsolute_win32 = isAbsolute_win32;
    function isAbsolute_posix(path) {
        return path && path.charCodeAt(0) === 47 /* Slash */;
    }
    exports.isAbsolute_posix = isAbsolute_posix;
});

define(__m[6/*vs/base/common/resources*/], __M([1/*require*/,0/*exports*/,3/*vs/base/common/paths*/,7/*vs/base/common/uri*/,2/*vs/base/common/strings*/,5/*vs/base/common/network*/,4/*vs/base/common/platform*/]), function (require, exports, paths, uri_1, strings_1, network_1, platform_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    function getComparisonKey(resource) {
        return hasToIgnoreCase(resource) ? resource.toString().toLowerCase() : resource.toString();
    }
    exports.getComparisonKey = getComparisonKey;
    function hasToIgnoreCase(resource) {
        // A file scheme resource is in the same platform as code, so ignore case for non linux platforms
        // Resource can be from another platform. Lowering the case as an hack. Should come from File system provider
        return resource && resource.scheme === network_1.Schemas.file ? !platform_1.isLinux : true;
    }
    exports.hasToIgnoreCase = hasToIgnoreCase;
    function basenameOrAuthority(resource) {
        return basename(resource) || resource.authority;
    }
    exports.basenameOrAuthority = basenameOrAuthority;
    /**
     * Tests wheter a `candidate` URI is a parent or equal of a given `base` URI.
     * @param base A uri which is "longer"
     * @param parentCandidate A uri which is "shorter" then `base`
     */
    function isEqualOrParent(base, parentCandidate, ignoreCase) {
        if (ignoreCase === void 0) { ignoreCase = hasToIgnoreCase(base); }
        if (base.scheme === parentCandidate.scheme) {
            if (base.scheme === network_1.Schemas.file) {
                return paths.isEqualOrParent(fsPath(base), fsPath(parentCandidate), ignoreCase);
            }
            if (isEqualAuthority(base.authority, parentCandidate.authority, ignoreCase)) {
                return paths.isEqualOrParent(base.path, parentCandidate.path, ignoreCase, '/');
            }
        }
        return false;
    }
    exports.isEqualOrParent = isEqualOrParent;
    function isEqualAuthority(a1, a2, ignoreCase) {
        return a1 === a2 || ignoreCase && a1 && a2 && strings_1.equalsIgnoreCase(a1, a2);
    }
    function isEqual(first, second, ignoreCase) {
        if (ignoreCase === void 0) { ignoreCase = hasToIgnoreCase(first); }
        var identityEquals = (first === second);
        if (identityEquals) {
            return true;
        }
        if (!first || !second) {
            return false;
        }
        if (ignoreCase) {
            return strings_1.equalsIgnoreCase(first.toString(), second.toString());
        }
        return first.toString() === second.toString();
    }
    exports.isEqual = isEqual;
    function basename(resource) {
        return paths.basename(resource.path);
    }
    exports.basename = basename;
    /**
     * Return a URI representing the directory of a URI path.
     *
     * @param resource The input URI.
     * @returns The URI representing the directory of the input URI.
     */
    function dirname(resource) {
        var dirname = paths.dirname(resource.path, '/');
        if (resource.authority && dirname.length && dirname.charCodeAt(0) !== 47 /* Slash */) {
            return null; // If a URI contains an authority component, then the path component must either be empty or begin with a CharCode.Slash ("/") character
        }
        return resource.with({
            path: dirname
        });
    }
    exports.dirname = dirname;
    /**
     * Join a URI path with a path fragment and normalizes the resulting path.
     *
     * @param resource The input URI.
     * @param pathFragment The path fragment to add to the URI path.
     * @returns The resulting URI.
     */
    function joinPath(resource, pathFragment) {
        var joinedPath;
        if (resource.scheme === network_1.Schemas.file) {
            joinedPath = uri_1.URI.file(paths.join(fsPath(resource), pathFragment)).path;
        }
        else {
            joinedPath = paths.join(resource.path, pathFragment);
        }
        return resource.with({
            path: joinedPath
        });
    }
    exports.joinPath = joinPath;
    /**
     * Normalizes the path part of a URI: Resolves `.` and `..` elements with directory names.
     *
     * @param resource The URI to normalize the path.
     * @returns The URI with the normalized path.
     */
    function normalizePath(resource) {
        var normalizedPath;
        if (resource.scheme === network_1.Schemas.file) {
            normalizedPath = uri_1.URI.file(paths.normalize(fsPath(resource))).path;
        }
        else {
            normalizedPath = paths.normalize(resource.path);
        }
        return resource.with({
            path: normalizedPath
        });
    }
    exports.normalizePath = normalizePath;
    /**
     * Returns the fsPath of an URI where the drive letter is not normalized.
     * See #56403.
     */
    function fsPath(uri) {
        var value;
        if (uri.authority && uri.path.length > 1 && uri.scheme === 'file') {
            // unc path: file://shares/c$/far/boo
            value = "//" + uri.authority + uri.path;
        }
        else if (platform_1.isWindows
            && uri.path.charCodeAt(0) === 47 /* Slash */
            && (uri.path.charCodeAt(1) >= 65 /* A */ && uri.path.charCodeAt(1) <= 90 /* Z */ || uri.path.charCodeAt(1) >= 97 /* a */ && uri.path.charCodeAt(1) <= 122 /* z */)
            && uri.path.charCodeAt(2) === 58 /* Colon */) {
            value = uri.path.substr(1);
        }
        else {
            // other path
            value = uri.path;
        }
        if (platform_1.isWindows) {
            value = value.replace(/\//g, '\\');
        }
        return value;
    }
    /**
     * Returns true if the URI path is absolute.
     */
    function isAbsolutePath(resource) {
        return paths.isAbsolute(resource.path);
    }
    exports.isAbsolutePath = isAbsolutePath;
    function distinctParents(items, resourceAccessor) {
        var distinctParents = [];
        var _loop_1 = function (i) {
            var candidateResource = resourceAccessor(items[i]);
            if (items.some(function (otherItem, index) {
                if (index === i) {
                    return false;
                }
                return isEqualOrParent(candidateResource, resourceAccessor(otherItem));
            })) {
                return "continue";
            }
            distinctParents.push(items[i]);
        };
        for (var i = 0; i < items.length; i++) {
            _loop_1(i);
        }
        return distinctParents;
    }
    exports.distinctParents = distinctParents;
    /**
     * Tests wheter the given URL is a file URI created by `URI.parse` instead of `URI.file`.
     * Such URI have no scheme or scheme that consist of a single letter (windows drive letter)
     * @param candidate The URI to test
     * @returns A corrected, real file URI if the input seems to be malformed.
     * Undefined is returned if the input URI looks fine.
     */
    function isMalformedFileUri(candidate) {
        if (!candidate.scheme || platform_1.isWindows && candidate.scheme.match(/^[a-zA-Z]$/)) {
            return uri_1.URI.file((candidate.scheme ? candidate.scheme + ':' : '') + candidate.path);
        }
        return void 0;
    }
    exports.isMalformedFileUri = isMalformedFileUri;
});

define(__m[8/*vs/workbench/parts/output/common/outputLinkComputer*/], __M([1/*require*/,0/*exports*/,7/*vs/base/common/uri*/,3/*vs/base/common/paths*/,6/*vs/base/common/resources*/,2/*vs/base/common/strings*/,9/*vs/base/common/arrays*/,10/*vs/editor/common/core/range*/]), function (require, exports, uri_1, paths, resources, strings, arrays, range_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var OutputLinkComputer = /** @class */ (function () {
        function OutputLinkComputer(ctx, createData) {
            this.ctx = ctx;
            this.patterns = new Map();
            this.computePatterns(createData);
        }
        OutputLinkComputer.prototype.computePatterns = function (createData) {
            var _this = this;
            // Produce patterns for each workspace root we are configured with
            // This means that we will be able to detect links for paths that
            // contain any of the workspace roots as segments.
            var workspaceFolders = createData.workspaceFolders.map(function (r) { return uri_1.URI.parse(r); });
            workspaceFolders.forEach(function (workspaceFolder) {
                var patterns = OutputLinkComputer.createPatterns(workspaceFolder);
                _this.patterns.set(workspaceFolder, patterns);
            });
        };
        OutputLinkComputer.prototype.getModel = function (uri) {
            var models = this.ctx.getMirrorModels();
            for (var i = 0; i < models.length; i++) {
                var model = models[i];
                if (model.uri.toString() === uri) {
                    return model;
                }
            }
            return null;
        };
        OutputLinkComputer.prototype.computeLinks = function (uri) {
            var model = this.getModel(uri);
            if (!model) {
                return void 0;
            }
            var links = [];
            var lines = model.getValue().split(/\r\n|\r|\n/);
            // For each workspace root patterns
            this.patterns.forEach(function (folderPatterns, folderUri) {
                var resourceCreator = {
                    toResource: function (folderRelativePath) {
                        if (typeof folderRelativePath === 'string') {
                            return resources.joinPath(folderUri, folderRelativePath);
                        }
                        return null;
                    }
                };
                for (var i = 0, len = lines.length; i < len; i++) {
                    links.push.apply(links, OutputLinkComputer.detectLinks(lines[i], i + 1, folderPatterns, resourceCreator));
                }
            });
            return links;
        };
        OutputLinkComputer.createPatterns = function (workspaceFolder) {
            var patterns = [];
            var workspaceFolderPath = workspaceFolder.scheme === 'file' ? workspaceFolder.fsPath : workspaceFolder.path;
            var workspaceFolderVariants = arrays.distinct([
                paths.normalize(workspaceFolderPath, true),
                paths.normalize(workspaceFolderPath, false)
            ]);
            workspaceFolderVariants.forEach(function (workspaceFolderVariant) {
                var validPathCharacterPattern = '[^\\s\\(\\):<>"]';
                var validPathCharacterOrSpacePattern = "(?:" + validPathCharacterPattern + "| " + validPathCharacterPattern + ")";
                var pathPattern = validPathCharacterOrSpacePattern + "+\\." + validPathCharacterPattern + "+";
                var strictPathPattern = validPathCharacterPattern + "+";
                // Example: /workspaces/express/server.js on line 8, column 13
                patterns.push(new RegExp(strings.escapeRegExpCharacters(workspaceFolderVariant) + ("(" + pathPattern + ") on line ((\\d+)(, column (\\d+))?)"), 'gi'));
                // Example: /workspaces/express/server.js:line 8, column 13
                patterns.push(new RegExp(strings.escapeRegExpCharacters(workspaceFolderVariant) + ("(" + pathPattern + "):line ((\\d+)(, column (\\d+))?)"), 'gi'));
                // Example: /workspaces/mankala/Features.ts(45): error
                // Example: /workspaces/mankala/Features.ts (45): error
                // Example: /workspaces/mankala/Features.ts(45,18): error
                // Example: /workspaces/mankala/Features.ts (45,18): error
                // Example: /workspaces/mankala/Features Special.ts (45,18): error
                patterns.push(new RegExp(strings.escapeRegExpCharacters(workspaceFolderVariant) + ("(" + pathPattern + ")(\\s?\\((\\d+)(,(\\d+))?)\\)"), 'gi'));
                // Example: at /workspaces/mankala/Game.ts
                // Example: at /workspaces/mankala/Game.ts:336
                // Example: at /workspaces/mankala/Game.ts:336:9
                patterns.push(new RegExp(strings.escapeRegExpCharacters(workspaceFolderVariant) + ("(" + strictPathPattern + ")(:(\\d+))?(:(\\d+))?"), 'gi'));
            });
            return patterns;
        };
        /**
         * Detect links. Made public static to allow for tests.
         */
        OutputLinkComputer.detectLinks = function (line, lineIndex, patterns, resourceCreator) {
            var links = [];
            patterns.forEach(function (pattern) {
                pattern.lastIndex = 0; // the holy grail of software development
                var match;
                var offset = 0;
                var _loop_1 = function () {
                    // Convert the relative path information to a resource that we can use in links
                    var folderRelativePath = strings.rtrim(match[1], '.').replace(/\\/g, '/'); // remove trailing "." that likely indicate end of sentence
                    var resource = void 0;
                    try {
                        resource = resourceCreator.toResource(folderRelativePath).toString();
                    }
                    catch (error) {
                        return "continue";
                    }
                    // Append line/col information to URI if matching
                    if (match[3]) {
                        var lineNumber = match[3];
                        if (match[5]) {
                            var columnNumber = match[5];
                            resource = strings.format('{0}#{1},{2}', resource, lineNumber, columnNumber);
                        }
                        else {
                            resource = strings.format('{0}#{1}', resource, lineNumber);
                        }
                    }
                    var fullMatch = strings.rtrim(match[0], '.'); // remove trailing "." that likely indicate end of sentence
                    var index = line.indexOf(fullMatch, offset);
                    offset += index + fullMatch.length;
                    var linkRange = {
                        startColumn: index + 1,
                        startLineNumber: lineIndex,
                        endColumn: index + 1 + fullMatch.length,
                        endLineNumber: lineIndex
                    };
                    if (links.some(function (link) { return range_1.Range.areIntersectingOrTouching(link.range, linkRange); })) {
                        return { value: void 0 };
                    }
                    links.push({
                        range: linkRange,
                        url: resource
                    });
                };
                while ((match = pattern.exec(line)) !== null) {
                    var state_1 = _loop_1();
                    if (typeof state_1 === "object")
                        return state_1.value;
                }
            });
            return links;
        };
        return OutputLinkComputer;
    }());
    exports.OutputLinkComputer = OutputLinkComputer;
    function create(ctx, createData) {
        return new OutputLinkComputer(ctx, createData);
    }
    exports.create = create;
});

}).call(this);
//# sourceMappingURL=outputLinkComputer.js.map
