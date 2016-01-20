/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/nls'], function (require, exports, nls) {
    // Methods
    exports.GET = 'GET';
    exports.POST = 'POST';
    exports.PUT = 'PUT';
    exports.DELETE = 'DELETE';
    // Header
    var Header;
    (function (Header) {
        Header.CONTENT_TYPE = 'Content-Type';
        Header.CONTENT_LENGTH = 'Content-Length';
        Header.LAST_MODIFIED = 'Last-Modified';
        Header.LOCATION = 'Location';
        Header.ETAG = 'ETag';
        Header.X_CONTENT_CHARSET = 'X-Content-Charset';
        Header.X_CONTENT_TYPES = 'X-Content-Types';
        Header.X_CONTENT_HASH = 'X-Content-Hash';
        Header.X_FILEPATH = 'X-Filepath';
        Header.X_RESOURCE = 'X-Resource';
    })(Header = exports.Header || (exports.Header = {}));
    // Mime
    var Mime;
    (function (Mime) {
        Mime.RAW = 'application/octet-stream';
        Mime.JSON = 'application/json';
        Mime.TEXT = 'text/plain';
        Mime.HTML = 'text/html';
    })(Mime = exports.Mime || (exports.Mime = {}));
    // Charset
    var Charset;
    (function (Charset) {
        Charset.UTF8 = 'utf-8';
        Charset.UTF8_BOM = 'UTF8_BOM';
    })(Charset = exports.Charset || (exports.Charset = {}));
    function isRedirect(status) {
        return status >= 300 && status <= 303 || status === 307;
    }
    exports.isRedirect = isRedirect;
    var contentLengthPattern = /X-Chunk-Length:(\d+)\r\n\r\n/gi, headerPattern = /(.+?):(.+?)\r\n(\r\n)?/gm;
    function newDataChunk(responseText, headerStartOffset, headerEndOffset, contentLength) {
        var _value, _headers;
        return {
            header: function (name) {
                if (typeof _headers === 'undefined') {
                    _headers = Object.create(null);
                    headerPattern.lastIndex = headerStartOffset;
                    while (true) {
                        var match = headerPattern.exec(responseText);
                        if (!match) {
                            // no header found
                            break;
                        }
                        _headers[match[1].toLowerCase()] = match[2];
                        if (match[3]) {
                            // the last header found
                            break;
                        }
                    }
                }
                return _headers[name.toLowerCase()];
            },
            value: function () {
                if (typeof _value === 'undefined') {
                    _value = responseText.substr(headerEndOffset + 2 /*crlf*/, contentLength);
                }
                return _value;
            }
        };
    }
    /**
     * Parses the response text of the provided request into individual data chunks. The chunks
     * are filled into the provided array.
     */
    function parseChunkedData(request, collection, offset) {
        if (offset === void 0) { offset = 0; }
        var responseText = request.responseText;
        contentLengthPattern.lastIndex = offset;
        while (true) {
            var match = contentLengthPattern.exec(responseText);
            if (!match) {
                return offset;
            }
            var contentLength = parseInt(match[1], 10);
            if (responseText.length < contentLengthPattern.lastIndex + contentLength) {
                return offset;
            }
            collection.push(newDataChunk(responseText, offset, contentLengthPattern.lastIndex - 2, contentLength));
            offset = contentLengthPattern.lastIndex + contentLength;
        }
    }
    exports.parseChunkedData = parseChunkedData;
    function getErrorStatusDescription(status) {
        if (status < 400) {
            return void 0;
        }
        switch (status) {
            case 400: return nls.localize('status.400', 'Bad request. The request cannot be fulfilled due to bad syntax.');
            case 401: return nls.localize('status.401', 'Unauthorized. The server is refusing to respond.');
            case 403: return nls.localize('status.403', 'Forbidden. The server is refusing to respond.');
            case 404: return nls.localize('status.404', 'Not Found. The requested location could not be found.');
            case 405: return nls.localize('status.405', 'Method not allowed. A request was made using a request method not supported by that location.');
            case 406: return nls.localize('status.406', 'Not Acceptable. The server can only generate a response that is not accepted by the client.');
            case 407: return nls.localize('status.407', 'Proxy Authentication Required. The client must first authenticate itself with the proxy.');
            case 408: return nls.localize('status.408', 'Request Timeout. The server timed out waiting for the request.');
            case 409: return nls.localize('status.409', 'Conflict. The request could not be completed because of a conflict in the request.');
            case 410: return nls.localize('status.410', 'Gone. The requested page is no longer available.');
            case 411: return nls.localize('status.411', 'Length Required. The "Content-Length" is not defined.');
            case 412: return nls.localize('status.412', 'Precondition Failed. The precondition given in the request evaluated to false by the server.');
            case 413: return nls.localize('status.413', 'Request Entity Too Large. The server will not accept the request, because the request entity is too large.');
            case 414: return nls.localize('status.414', 'Request-URI Too Long. The server will not accept the request, because the URL is too long.');
            case 415: return nls.localize('status.415', 'Unsupported Media Type. The server will not accept the request, because the media type is not supported.');
            case 500: return nls.localize('status.500', 'Internal Server Error.');
            case 501: return nls.localize('status.501', 'Not Implemented. The server either does not recognize the request method, or it lacks the ability to fulfill the request.');
            case 503: return nls.localize('status.503', 'Service Unavailable. The server is currently unavailable (overloaded or down).');
            default: return nls.localize('status.416', 'HTTP status code {0}', status);
        }
    }
    exports.getErrorStatusDescription = getErrorStatusDescription;
});
//# sourceMappingURL=http.js.map