/*!--------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
define("vs/base/common/platform", ["require", "exports"], function (require, exports) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    // --- THIS FILE IS TEMPORARY UNTIL ENV.TS IS CLEANED UP. IT CAN SAFELY BE USED IN ALL TARGET EXECUTION ENVIRONMENTS (node & dom) ---
    var _isWindows = false;
    var _isMacintosh = false;
    var _isLinux = false;
    var _isNative = false;
    var _isWeb = false;
    var _isQunit = false;
    var _locale = undefined;
    var _language = undefined;
    // OS detection
    if (typeof process === 'object') {
        _isWindows = (process.platform === 'win32');
        _isMacintosh = (process.platform === 'darwin');
        _isLinux = (process.platform === 'linux');
        var vscode_nls_config = process.env['VSCODE_NLS_CONFIG'];
        if (vscode_nls_config) {
            try {
                var nlsConfig = JSON.parse(vscode_nls_config);
                var resolved = nlsConfig.availableLanguages['*'];
                _locale = nlsConfig.locale;
                // VSCode's default language is 'en'
                _language = resolved ? resolved : 'en';
            }
            catch (e) {
            }
        }
        _isNative = true;
    }
    else if (typeof navigator === 'object') {
        var userAgent = navigator.userAgent;
        _isWindows = userAgent.indexOf('Windows') >= 0;
        _isMacintosh = userAgent.indexOf('Macintosh') >= 0;
        _isLinux = userAgent.indexOf('Linux') >= 0;
        _isWeb = true;
        _locale = navigator.language;
        _language = _locale;
        _isQunit = !!self.QUnit;
    }
    (function (Platform) {
        Platform[Platform["Web"] = 0] = "Web";
        Platform[Platform["Mac"] = 1] = "Mac";
        Platform[Platform["Linux"] = 2] = "Linux";
        Platform[Platform["Windows"] = 3] = "Windows";
    })(exports.Platform || (exports.Platform = {}));
    var Platform = exports.Platform;
    exports._platform = Platform.Web;
    if (_isNative) {
        if (_isMacintosh) {
            exports._platform = Platform.Mac;
        }
        else if (_isWindows) {
            exports._platform = Platform.Windows;
        }
        else if (_isLinux) {
            exports._platform = Platform.Linux;
        }
    }
    exports.isWindows = _isWindows;
    exports.isMacintosh = _isMacintosh;
    exports.isLinux = _isLinux;
    exports.isNative = _isNative;
    exports.isWeb = _isWeb;
    exports.isQunit = _isQunit;
    exports.platform = exports._platform;
    /**
     * The language used for the user interface. The format of
     * the string is all lower case (e.g. zh-tw for Traditional
     * Chinese)
     */
    exports.language = _language;
    /**
     * The OS locale or the locale specified by --locale. The format of
     * the string is all lower case (e.g. zh-tw for Traditional
     * Chinese)
     */
    exports.locale = _locale;
    var _globals = (typeof self === 'object' ? self : global);
    exports.globals = _globals;
    function hasWebWorkerSupport() {
        return typeof _globals.Worker !== 'undefined';
    }
    exports.hasWebWorkerSupport = hasWebWorkerSupport;
    exports.setTimeout = _globals.setTimeout.bind(_globals);
    exports.clearTimeout = _globals.clearTimeout.bind(_globals);
    exports.setInterval = _globals.setInterval.bind(_globals);
    exports.clearInterval = _globals.clearInterval.bind(_globals);
});

define("vs/base/common/uri", ["require", "exports", 'vs/base/common/platform'], function (require, exports, platform) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    // see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent
    function fixedEncodeURIComponent(str) {
        return encodeURIComponent(str).replace(/[!'()*]/g, function (c) { return '%' + c.charCodeAt(0).toString(16).toUpperCase(); });
    }
    /**
     * Uniform Resource Identifier (URI) http://tools.ietf.org/html/rfc3986.
     * This class is a simple parser which creates the basic component paths
     * (http://tools.ietf.org/html/rfc3986#section-3) with minimal validation
     * and encoding.
     *
     *       foo://example.com:8042/over/there?name=ferret#nose
     *       \_/   \______________/\_________/ \_________/ \__/
     *        |           |            |            |        |
     *     scheme     authority       path        query   fragment
     *        |   _____________________|__
     *       / \ /                        \
     *       urn:example:animal:ferret:nose
     *
     *
     */
    var URI = (function () {
        function URI() {
            this._scheme = URI._empty;
            this._authority = URI._empty;
            this._path = URI._empty;
            this._query = URI._empty;
            this._fragment = URI._empty;
        }
        Object.defineProperty(URI.prototype, "scheme", {
            /**
             * scheme is the 'http' part of 'http://www.msft.com/some/path?query#fragment'.
             * The part before the first colon.
             */
            get: function () {
                return this._scheme;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(URI.prototype, "authority", {
            /**
             * authority is the 'www.msft.com' part of 'http://www.msft.com/some/path?query#fragment'.
             * The part between the first double slashes and the next slash.
             */
            get: function () {
                return this._authority;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(URI.prototype, "path", {
            /**
             * path is the '/some/path' part of 'http://www.msft.com/some/path?query#fragment'.
             */
            get: function () {
                return this._path;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(URI.prototype, "query", {
            /**
             * query is the 'query' part of 'http://www.msft.com/some/path?query#fragment'.
             */
            get: function () {
                return this._query;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(URI.prototype, "fragment", {
            /**
             * fragment is the 'fragment' part of 'http://www.msft.com/some/path?query#fragment'.
             */
            get: function () {
                return this._fragment;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(URI.prototype, "fsPath", {
            /**
             * Returns a string representing the corresponding file system path of this URI.
             * Will handle UNC paths and normalize windows drive letters to lower-case. Also
             * uses the platform specific path separator. Will *not* validate the path for
             * invalid characters and semantics. Will *not* look at the scheme of this URI.
             */
            get: function () {
                if (!this._fsPath) {
                    var value;
                    if (this._authority && this.scheme === 'file') {
                        // unc path: file://shares/c$/far/boo
                        value = "//" + this._authority + this._path;
                    }
                    else if (URI._driveLetterPath.test(this._path)) {
                        // windows drive letter: file:///c:/far/boo
                        value = this._path[1].toLowerCase() + this._path.substr(2);
                    }
                    else {
                        // other path
                        value = this._path;
                    }
                    if (platform.isWindows) {
                        value = value.replace(/\//g, '\\');
                    }
                    this._fsPath = value;
                }
                return this._fsPath;
            },
            enumerable: true,
            configurable: true
        });
        // ---- modify to new -------------------------
        URI.prototype.with = function (scheme, authority, path, query, fragment) {
            var ret = new URI();
            ret._scheme = scheme || this.scheme;
            ret._authority = authority || this.authority;
            ret._path = path || this.path;
            ret._query = query || this.query;
            ret._fragment = fragment || this.fragment;
            URI._validate(ret);
            return ret;
        };
        URI.prototype.withScheme = function (value) {
            return this.with(value, undefined, undefined, undefined, undefined);
        };
        URI.prototype.withAuthority = function (value) {
            return this.with(undefined, value, undefined, undefined, undefined);
        };
        URI.prototype.withPath = function (value) {
            return this.with(undefined, undefined, value, undefined, undefined);
        };
        URI.prototype.withQuery = function (value) {
            return this.with(undefined, undefined, undefined, value, undefined);
        };
        URI.prototype.withFragment = function (value) {
            return this.with(undefined, undefined, undefined, undefined, value);
        };
        // ---- parse & validate ------------------------
        URI.parse = function (value) {
            var ret = new URI();
            var data = URI._parseComponents(value);
            ret._scheme = data.scheme;
            ret._authority = decodeURIComponent(data.authority);
            ret._path = decodeURIComponent(data.path);
            ret._query = decodeURIComponent(data.query);
            ret._fragment = decodeURIComponent(data.fragment);
            URI._validate(ret);
            return ret;
        };
        URI.file = function (path) {
            path = path.replace(/\\/g, '/');
            path = path.replace(/%/g, '%25');
            path = path.replace(/#/g, '%23');
            path = path.replace(/\?/g, '%3F');
            // makes sure something like 'C:/Users' isn't
            // parsed as scheme='C', path='Users'
            path = URI._driveLetter.test(path)
                ? '/' + path
                : path;
            var data = URI._parseComponents(path);
            if (data.scheme || data.fragment || data.query) {
                throw new Error('Path contains a scheme, fragment or a query. Can not convert it to a file uri.');
            }
            var ret = new URI();
            ret._scheme = 'file';
            ret._authority = data.authority;
            ret._path = decodeURIComponent(data.path[0] === '/' ? data.path : '/' + data.path); // path starts with slash
            ret._query = data.query;
            ret._fragment = data.fragment;
            URI._validate(ret);
            return ret;
        };
        URI._parseComponents = function (value) {
            var ret = {
                scheme: URI._empty,
                authority: URI._empty,
                path: URI._empty,
                query: URI._empty,
                fragment: URI._empty,
            };
            var match = URI._regexp.exec(value);
            if (match) {
                ret.scheme = match[2] || ret.scheme;
                ret.authority = match[4] || ret.authority;
                ret.path = match[5] || ret.path;
                ret.query = match[7] || ret.query;
                ret.fragment = match[9] || ret.fragment;
            }
            return ret;
        };
        URI.create = function (scheme, authority, path, query, fragment) {
            return new URI().with(scheme, authority, path, query, fragment);
        };
        URI._validate = function (ret) {
            // validation
            // path, http://tools.ietf.org/html/rfc3986#section-3.3
            // If a URI contains an authority component, then the path component
            // must either be empty or begin with a slash ("/") character.  If a URI
            // does not contain an authority component, then the path cannot begin
            // with two slash characters ("//").
            if (ret.authority && ret.path && ret.path[0] !== '/') {
                throw new Error('[UriError]: If a URI contains an authority component, then the path component must either be empty or begin with a slash ("/") character');
            }
            if (!ret.authority && ret.path.indexOf('//') === 0) {
                throw new Error('[UriError]: If a URI does not contain an authority component, then the path cannot begin with two slash characters ("//")');
            }
        };
        URI.prototype.toString = function () {
            if (!this._formatted) {
                var parts = [];
                if (this._scheme) {
                    parts.push(this._scheme);
                    parts.push(':');
                }
                if (this._authority || this._scheme === 'file') {
                    parts.push('//');
                }
                if (this._authority) {
                    var authority = this._authority, idx;
                    authority = authority.toLowerCase();
                    idx = authority.indexOf(':');
                    if (idx === -1) {
                        parts.push(fixedEncodeURIComponent(authority));
                    }
                    else {
                        parts.push(fixedEncodeURIComponent(authority.substr(0, idx)));
                        parts.push(authority.substr(idx));
                    }
                }
                if (this._path) {
                    // encode every segment of the path
                    var path = this._path, segments;
                    // lower-case win drive letters in /C:/fff
                    if (URI._driveLetterPath.test(path)) {
                        path = '/' + path[1].toLowerCase() + path.substr(2);
                    }
                    else if (URI._driveLetter.test(path)) {
                        path = path[0].toLowerCase() + path.substr(1);
                    }
                    segments = path.split('/');
                    for (var i = 0, len = segments.length; i < len; i++) {
                        segments[i] = fixedEncodeURIComponent(segments[i]);
                    }
                    parts.push(segments.join('/'));
                }
                if (this._query) {
                    // in http(s) querys often use 'key=value'-pairs and
                    // ampersand characters for multiple pairs
                    var encoder = /https?/i.test(this.scheme)
                        ? encodeURI
                        : fixedEncodeURIComponent;
                    parts.push('?');
                    parts.push(encoder(this._query));
                }
                if (this._fragment) {
                    parts.push('#');
                    parts.push(fixedEncodeURIComponent(this._fragment));
                }
                this._formatted = parts.join('');
            }
            return this._formatted;
        };
        URI.prototype.toJSON = function () {
            return {
                scheme: this.scheme,
                authority: this.authority,
                path: this.path,
                fsPath: this.fsPath,
                query: this.query,
                fragment: this.fragment.replace(/URL_MARSHAL_REMOVE.*$/, ''),
                external: this.toString().replace(/#?URL_MARSHAL_REMOVE.*$/, ''),
                $mid: 1
            };
        };
        URI.revive = function (data) {
            var result = new URI();
            result._scheme = data.scheme;
            result._authority = data.authority;
            result._path = data.path;
            result._query = data.query;
            result._fragment = data.fragment;
            result._fsPath = data.fsPath;
            result._formatted = data.external;
            URI._validate(result);
            return result;
        };
        URI._empty = '';
        URI._regexp = /^(([^:/?#]+?):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/;
        URI._driveLetterPath = /^\/[a-zA-z]:/;
        URI._driveLetter = /^[a-zA-z]:/;
        return URI;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = URI;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define("vs/workbench/electron-main/cli", ["require", "exports", 'path', 'fs', 'os', 'child_process', 'vs/base/common/uri'], function (require, exports, path, fs, os, child_process_1, uri_1) {
    "use strict";
    var rootPath = path.dirname(uri_1.default.parse(require.toUrl('')).fsPath);
    var packageJsonPath = path.join(rootPath, 'package.json');
    var packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    var ArgParser = (function () {
        function ArgParser(argv) {
            this.argv = argv;
        }
        ArgParser.prototype.hasFlag = function (flag, alias) {
            return (flag && this.argv.indexOf('--' + flag) >= 0)
                || (alias && this.argv.indexOf('-' + alias) >= 0);
        };
        ArgParser.prototype.help = function () {
            var executable = 'code' + (os.platform() === 'win32' ? '.exe' : '');
            var indent = '  ';
            return "Visual Studio Code v" + packageJson.version + "\n\nUsage: " + executable + " [arguments] [paths...]\n\nOptions:\n" + indent + "-d, --diff            Open a diff editor. Requires to pass two file paths\n" + indent + "                      as arguments.\n" + indent + "--disable-extensions  Disable all installed extensions.\n" + indent + "-g, --goto            Open the file at path at the line and column (add\n" + indent + "                      :line[:column] to path).\n" + indent + "-h, --help            Print usage.\n" + indent + "--locale=LOCALE       The locale to use (e.g. en-US or zh-TW).\n" + indent + "-n, --new-window      Force a new instance of Code.\n" + indent + "-r, --reuse-window    Force opening a file or folder in the last active\n" + indent + "                      window.\n" + indent + "-v, --version         Print version.\n" + indent + "-w, --wait            Wait for the window to be closed before returning.";
        };
        return ArgParser;
    }());
    function main(argv) {
        var argParser = new ArgParser(argv);
        var exit = true;
        if (argParser.hasFlag('help', 'h')) {
            console.log(argParser.help());
        }
        else if (argParser.hasFlag('version', 'v')) {
            console.log(packageJson.version);
        }
        else {
            delete process.env['ATOM_SHELL_INTERNAL_RUN_AS_NODE'];
            if (argParser.hasFlag('wait', 'w')) {
                exit = false;
                var child = child_process_1.spawn(process.execPath, process.argv.slice(2), { stdio: 'ignore' });
                child.on('exit', process.exit);
            }
            else {
                child_process_1.spawn(process.execPath, process.argv.slice(2), { detached: true, stdio: 'ignore' });
            }
        }
        if (exit) {
            process.exit(0);
        }
    }
    exports.main = main;
    main(process.argv.slice(2));
});

//# sourceMappingURL=cli.js.map
