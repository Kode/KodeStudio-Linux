/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'vs/base/common/assert', 'vs/base/common/strings', 'vs/base/common/hash', 'vs/base/common/paths', 'vs/base/common/uri'], function (require, exports, assert, strings, hash, paths, uri_1) {
    var _colon = ':'.charCodeAt(0), _slash = '/'.charCodeAt(0), _questionMark = '?'.charCodeAt(0), _hash = '#'.charCodeAt(0);
    var ParsedUrl = (function () {
        function ParsedUrl(spec) {
            this.spec = spec || strings.empty;
            this.specLength = this.spec.length;
            this.parse();
        }
        ParsedUrl.prototype.forwardSubstring = function (startIndex, endIndex) {
            if (startIndex < endIndex) {
                return this.spec.substring(startIndex, endIndex);
            }
            return strings.empty;
        };
        /**
         * http for http://www.test.com:8000/this/that/theother.html?query=foo#hash
         */
        ParsedUrl.prototype.getScheme = function () {
            return this.forwardSubstring(this.schemeStart, this.domainStart - 1);
        };
        /**
         * http: for http://www.test.com:8000/this/that/theother.html?query=foo#hash
         */
        ParsedUrl.prototype.getProtocol = function () {
            return this.forwardSubstring(this.schemeStart, this.domainStart);
        };
        /**
         * www.test.com for http://www.test.com:8000/this/that/theother.html?query=foo#hash
         */
        ParsedUrl.prototype.getDomain = function () {
            return this.forwardSubstring(this.domainStart + 2, this.portStart);
        };
        /**
         * 8000 for http://www.test.com:8000/this/that/theother.html?query=foo#hash
         */
        ParsedUrl.prototype.getPort = function () {
            return this.forwardSubstring(this.portStart + 1, this.pathStart);
        };
        /**
         * www.test.com:8000 for http://www.test.com:8000/this/that/theother.html?query=foo#hash
         */
        ParsedUrl.prototype.getHost = function () {
            return this.forwardSubstring(this.domainStart + 2, this.pathStart);
        };
        /**
         * /this/that/theother.html for http://www.test.com:8000/this/that/theother.html?query=foo#hash
         */
        ParsedUrl.prototype.getPath = function () {
            return this.forwardSubstring(this.pathStart, this.queryStringStart);
        };
        /**
         * query=foo for http://www.test.com:8000/this/that/theother.html?query=foo#hash
         */
        ParsedUrl.prototype.getQueryString = function () {
            return this.forwardSubstring(this.queryStringStart + 1, this.fragmentIdStart);
        };
        /**
         * hash for http://www.test.com:8000/this/that/theother.html?query=foo#hash
         */
        ParsedUrl.prototype.getFragmentId = function () {
            return this.forwardSubstring(this.fragmentIdStart + 1, this.specLength);
        };
        /**
         * http://www.test.com:8000 for http://www.test.com:8000/this/that/theother.html?query=foo#hash
         */
        ParsedUrl.prototype.getAllBeforePath = function () {
            return this.forwardSubstring(0, this.pathStart);
        };
        /**
         * http://www.test.com:8000/this/that/theother.html?query=foo for http://www.test.com:8000/this/that/theother.html?query=foo#hash
         */
        ParsedUrl.prototype.getAllBeforeFragmentId = function () {
            return this.forwardSubstring(0, this.fragmentIdStart);
        };
        /**
         * Combine with a relative url, returns absolute url
         * e.g.
         * http://www.test.com/this/that/theother.html?query=foo#hash=hash
         * combined with ../test.js?query=foo#hash
         * results in http://www.test.com/this/test.js?query=foo#hash
         */
        ParsedUrl.prototype.combine = function (relativeUrl) {
            var questionMarkIndex = relativeUrl.indexOf('?');
            var hashIndex = relativeUrl.indexOf('#');
            var suffixIndex = relativeUrl.length;
            if (questionMarkIndex !== -1 && questionMarkIndex < suffixIndex) {
                suffixIndex = questionMarkIndex;
            }
            if (hashIndex !== -1 && hashIndex < suffixIndex) {
                suffixIndex = hashIndex;
            }
            var relativeUrlPath = relativeUrl.substring(0, suffixIndex);
            var relativeUrlSuffix = relativeUrl.substring(suffixIndex);
            relativeUrlPath = relativeUrlPath.replace('\\', '/');
            var resultPath;
            if (strings.startsWith(relativeUrlPath, '/')) {
                // Looks like an absolute URL
                resultPath = paths.join(relativeUrlPath);
            }
            else {
                resultPath = paths.join(paths.dirname(this.getPath()), relativeUrlPath);
            }
            while (resultPath.charAt(0) === '/') {
                resultPath = resultPath.substr(1);
            }
            while (resultPath.indexOf('../') === 0) {
                resultPath = resultPath.substr(3);
            }
            return this.getAllBeforePath() + '/' + resultPath + relativeUrlSuffix;
        };
        // scheme://domain:port/path?query_string#fragment_id
        ParsedUrl.prototype.parse = function () {
            var IN_SCHEME = 0, IN_DOMAIN = 1, IN_PORT = 2, IN_PATH = 3, IN_QUERY_STRING = 4, state = IN_SCHEME, spec = this.spec, length = this.specLength, i, prevChCode = -1, prevPrevChCode = -1, chCode;
            this.schemeStart = 0;
            this.domainStart = this.specLength;
            this.portStart = this.specLength;
            this.pathStart = this.specLength;
            this.queryStringStart = this.specLength;
            this.fragmentIdStart = this.specLength;
            for (i = 0; i < length; i++) {
                chCode = spec.charCodeAt(i);
                switch (state) {
                    case IN_SCHEME:
                        if (prevChCode === _slash && chCode === _slash) {
                            // going into the domain
                            state = IN_DOMAIN;
                            this.domainStart = i - 1;
                        }
                        break;
                    case IN_DOMAIN:
                        if (chCode === _colon) {
                            // going into the port
                            state = IN_PORT;
                            this.portStart = i;
                        }
                        else if (chCode === _slash) {
                            // skipping the port, going straight to the path
                            state = IN_PATH;
                            this.portStart = i;
                            this.pathStart = i;
                        }
                        else if (chCode === _hash) {
                            // skipping the port, path & query string, going straight to the fragment, we can halt now
                            this.portStart = i;
                            this.pathStart = i;
                            this.queryStringStart = i;
                            this.fragmentIdStart = i;
                            i = length;
                        }
                        break;
                    case IN_PORT:
                        if (chCode === _slash) {
                            // going into the path
                            state = IN_PATH;
                            this.pathStart = i;
                        }
                        else if (chCode === _hash) {
                            // skipping the path & query string, going straight to the fragment, we can halt now
                            this.pathStart = i;
                            this.queryStringStart = i;
                            this.fragmentIdStart = i;
                            i = length;
                        }
                        break;
                    case IN_PATH:
                        if (chCode === _questionMark) {
                            // going in to the query string
                            state = IN_QUERY_STRING;
                            this.queryStringStart = i;
                        }
                        else if (chCode === _hash) {
                            // skipping the query string, going straight to the fragment, we can halt now
                            this.queryStringStart = i;
                            this.fragmentIdStart = i;
                            i = length;
                        }
                        break;
                    case IN_QUERY_STRING:
                        if (chCode === _hash) {
                            // going into the hash, we can halt now
                            this.fragmentIdStart = i;
                            i = length;
                        }
                        break;
                }
                prevPrevChCode = prevChCode;
                prevChCode = chCode;
            }
            if (state === IN_SCHEME) {
                // Looks like we had a very bad url
                this.schemeStart = this.specLength;
            }
        };
        return ParsedUrl;
    })();
    exports.ParsedUrl = ParsedUrl;
    var URL = (function (_super) {
        __extends(URL, _super);
        function URL(stringOrURI) {
            _super.call(this);
            assert.ok(!!stringOrURI, 'spec must not be null');
            if (typeof stringOrURI === 'string') {
                this._uri = uri_1.default.parse(stringOrURI);
            }
            else {
                this._uri = stringOrURI;
            }
            this._spec = this._uri.toString(); // make sure spec is normalized
            this._parsed = null;
        }
        /**
         * Creates a new URL from the provided value
         * by decoding it first.
         * @param value An encoded url value.
         */
        URL.fromEncoded = function (value) {
            return new URL(decodeURIComponent(value));
        };
        URL.fromValue = function (value) {
            return new URL(value);
        };
        URL.fromUri = function (value) {
            if (!value) {
                return value;
            }
            else if (value instanceof URL) {
                return value;
            }
            else {
                return new URL(value);
            }
        };
        URL.prototype.equals = function (other) {
            if (this.toString() !== String(other)) {
                return false;
            }
            return ((other instanceof URL) || uri_1.default.isURI(other));
        };
        URL.prototype.hashCode = function () {
            return hash.computeMurmur2StringHashCode(this._spec);
        };
        URL.prototype.isInMemory = function () {
            return this.scheme === schemas.inMemory;
        };
        /**
         * http for http://www.test.com:8000/this/that/theother.html?query=foo#hash
         */
        URL.prototype.getScheme = function () {
            this._ensureParsedUrl();
            return this._parsed.getScheme();
        };
        /**
         * /this/that/theother.html for http://www.test.com:8000/this/that/theother.html?query=foo#hash
         */
        URL.prototype.getPath = function () {
            this._ensureParsedUrl();
            return this._parsed.getPath();
        };
        /**
         * Strips out the hash part of the URL.
         * http://www.test.com:8000/this/that/theother.html?query=foo for http://www.test.com:8000/this/that/theother.html?query=foo#hash
         */
        URL.prototype.toUnique = function () {
            this._ensureParsedUrl();
            return this._parsed.getAllBeforeFragmentId();
        };
        URL.prototype.startsWith = function (other) {
            return strings.startsWith(this._spec, other._spec);
        };
        /**
         * Combine with a relative url, returns absolute url
         * e.g.
         * http://www.test.com/this/that/theother.html?query=foo#hash=hash
         * combined with ../test.js?query=foo#hash
         * results in http://www.test.com/this/test.js?query=foo#hash
         */
        URL.prototype.combine = function (relativeUrl) {
            this._ensureParsedUrl();
            return new URL(this._parsed.combine(relativeUrl));
        };
        URL.prototype._ensureParsedUrl = function () {
            if (this._parsed === null) {
                this._parsed = new ParsedUrl(this._spec);
            }
        };
        Object.defineProperty(URL.prototype, "scheme", {
            // ----- URI implementation -------------------------
            get: function () {
                return this._uri.scheme;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(URL.prototype, "authority", {
            get: function () {
                return this._uri.authority;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(URL.prototype, "path", {
            get: function () {
                return this._uri.path;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(URL.prototype, "fsPath", {
            get: function () {
                return this._uri.fsPath;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(URL.prototype, "query", {
            get: function () {
                return this._uri.query;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(URL.prototype, "fragment", {
            get: function () {
                return this._uri.fragment;
            },
            enumerable: true,
            configurable: true
        });
        URL.prototype.withScheme = function (value) {
            return uri_1.default.create(value, this.authority, this.fsPath, this.query, this.fragment);
        };
        URL.prototype.withAuthority = function (value) {
            return uri_1.default.create(this.scheme, value, this.fsPath, this.query, this.fragment);
        };
        URL.prototype.withPath = function (value) {
            return uri_1.default.create(this.scheme, this.authority, value, this.query, this.fragment);
        };
        URL.prototype.withQuery = function (value) {
            return uri_1.default.create(this.scheme, this.authority, this.fsPath, value, this.fragment);
        };
        URL.prototype.withFragment = function (value) {
            return uri_1.default.create(this.scheme, this.authority, this.fsPath, this.query, value);
        };
        URL.prototype.with = function (scheme, authority, path, query, fragment) {
            return uri_1.default.create(scheme, authority, path, query, fragment);
        };
        URL.prototype.toString = function () {
            return this._spec;
        };
        URL.prototype.toJSON = function () {
            return this.toString();
        };
        return URL;
    })(uri_1.default);
    exports.URL = URL;
    var schemas;
    (function (schemas) {
        /**
         * A schema that is used for models that exist in memory
         * only and that have no correspondence on a server or such.
         */
        schemas.inMemory = 'inmemory';
        schemas.http = 'http';
        schemas.https = 'https';
        schemas.file = 'file';
    })(schemas = exports.schemas || (exports.schemas = {}));
});
//# sourceMappingURL=network.js.map