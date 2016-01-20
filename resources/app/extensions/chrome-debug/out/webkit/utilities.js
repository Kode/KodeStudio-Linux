/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
var http = require('http');
var os = require('os');
var fs = require('fs');
var url = require('url');
var path = require('path');
var DEFAULT_CHROME_PATH = {
    OSX: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    WIN: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    WINx86: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    LINUX: '/usr/bin/google-chrome'
};
function getBrowserPath() {
    var platform = getPlatform();
    if (platform === 1 /* OSX */) {
        return existsSync(DEFAULT_CHROME_PATH.OSX) ? DEFAULT_CHROME_PATH.OSX : null;
    }
    else if (platform === 0 /* Windows */) {
        if (existsSync(DEFAULT_CHROME_PATH.WINx86)) {
            return DEFAULT_CHROME_PATH.WINx86;
        }
        else if (existsSync(DEFAULT_CHROME_PATH.WIN)) {
            return DEFAULT_CHROME_PATH.WIN;
        }
        else {
            return null;
        }
    }
    else {
        return existsSync(DEFAULT_CHROME_PATH.LINUX) ? DEFAULT_CHROME_PATH.LINUX : null;
    }
}
exports.getBrowserPath = getBrowserPath;
function getPlatform() {
    var platform = os.platform();
    return platform === 'darwin' ? 1 /* OSX */ :
        platform === 'win32' ? 0 /* Windows */ :
            2 /* Linux */;
}
exports.getPlatform = getPlatform;
/**
 * Node's fs.existsSync is deprecated, implement it in terms of statSync
 */
function existsSync(path) {
    try {
        fs.statSync(path);
        return true;
    }
    catch (e) {
        // doesn't exist
        return false;
    }
}
exports.existsSync = existsSync;
var DebounceHelper = (function () {
    function DebounceHelper(timeoutMs) {
        this.timeoutMs = timeoutMs;
    }
    /**
     * If not waiting already, call fn after the timeout
     */
    DebounceHelper.prototype.wait = function (fn) {
        var _this = this;
        if (!this.waitToken) {
            this.waitToken = setTimeout(function () {
                _this.waitToken = null;
                fn();
            }, this.timeoutMs);
        }
    };
    /**
     * If waiting for something, cancel it and call fn immediately
     */
    DebounceHelper.prototype.doAndCancel = function (fn) {
        if (this.waitToken) {
            clearTimeout(this.waitToken);
            this.waitToken = null;
        }
        fn();
    };
    return DebounceHelper;
})();
exports.DebounceHelper = DebounceHelper;
/**
 * Returns a reversed version of arr. Doesn't modify the input.
 */
function reversedArr(arr) {
    return arr.reduce(function (reversed, x) {
        reversed.unshift(x);
        return reversed;
    }, []);
}
exports.reversedArr = reversedArr;
function promiseTimeout(p, timeoutMs, timeoutMsg) {
    if (timeoutMs === void 0) { timeoutMs = 1000; }
    if (timeoutMsg === undefined) {
        timeoutMsg = "Promise timed out after " + timeoutMs + "ms";
    }
    return new Promise(function (resolve, reject) {
        if (p) {
            p.then(resolve, reject);
        }
        setTimeout(function () {
            if (p) {
                reject(timeoutMsg);
            }
            else {
                resolve();
            }
        }, timeoutMs);
    });
}
exports.promiseTimeout = promiseTimeout;
function retryAsync(fn, timeoutMs) {
    var startTime = Date.now();
    function tryUntilTimeout() {
        return fn().catch(function (e) {
            if (Date.now() - startTime < timeoutMs) {
                return tryUntilTimeout();
            }
            else {
                return errP(e);
            }
        });
    }
    return tryUntilTimeout();
}
exports.retryAsync = retryAsync;
/**
 * Holds a singleton to manage access to console.log.
 * Logging is only allowed when running in server mode, because otherwise it goes through the same channel that Code uses to
 * communicate with the adapter, which can cause communication issues.
 */
var Logger = (function () {
    function Logger(isServer) {
        this._isServer = isServer;
    }
    Logger.log = function (msg, forceDiagnosticLogging) {
        if (forceDiagnosticLogging === void 0) { forceDiagnosticLogging = false; }
        if (this._logger)
            this._logger._log(msg, forceDiagnosticLogging);
    };
    Logger.init = function (isServer, logCallback) {
        if (!this._logger) {
            this._logger = new Logger(isServer);
            this._logger._diagnosticLogCallback = logCallback;
            if (isServer) {
                Logger.logVersionInfo();
            }
        }
    };
    Logger.enableDiagnosticLogging = function () {
        if (this._logger) {
            this._logger._diagnosticLoggingEnabled = true;
            if (!this._logger._isServer) {
                Logger.logVersionInfo();
            }
        }
    };
    Logger.logVersionInfo = function () {
        Logger.log("OS: " + os.platform() + " " + os.arch());
        Logger.log('Node version: ' + process.version);
        Logger.log('Adapter version: ' + require('../../package.json').version);
    };
    Logger.prototype._log = function (msg, forceDiagnosticLogging) {
        if (this._isServer || this._diagnosticLoggingEnabled || forceDiagnosticLogging) {
            this._sendLog(msg);
        }
    };
    Logger.prototype._sendLog = function (msg) {
        if (this._isServer) {
            console.log(msg);
        }
        else if (this._diagnosticLogCallback) {
            this._diagnosticLogCallback(msg);
        }
    };
    return Logger;
})();
exports.Logger = Logger;
/**
 * Maps a url from webkit to an absolute local path.
 * If not given an absolute path (with file: prefix), searches the current working directory for a matching file.
 * http://localhost/scripts/code.js => d:/app/scripts/code.js
 * file:///d:/scripts/code.js => d:/scripts/code.js
 */
function webkitUrlToClientPath(webRoot, aUrl) {
    if (!aUrl) {
        return '';
    }
    aUrl = decodeURI(aUrl);
    // If the url is an absolute path to a file that exists, return it without file:///.
    // A remote absolute url (cordova) will still need the logic below.
    if (aUrl.startsWith('file:///') && existsSync(aUrl.replace(/^file:\/\/\//, ''))) {
        return canonicalizeUrl(aUrl);
    }
    // If we don't have the client workingDirectory for some reason, don't try to map the url to a client path
    if (!webRoot) {
        return '';
    }
    // Search the filesystem under the webRoot for the file that best matches the given url
    var pathName = decodeURIComponent(url.parse(canonicalizeUrl(aUrl)).pathname);
    if (!pathName || pathName === '/') {
        return '';
    }
    // Dealing with the path portion of either a url or an absolute path to remote file.
    // Need to force path.sep separator
    pathName = pathName.replace(/\//g, path.sep);
    var pathParts = pathName.split(path.sep);
    while (pathParts.length > 0) {
        var clientPath = path.join(webRoot, pathParts.join(path.sep));
        if (existsSync(clientPath)) {
            return canonicalizeUrl(clientPath);
        }
        pathParts.shift();
    }
    return '';
}
exports.webkitUrlToClientPath = webkitUrlToClientPath;
/**
 * Modify a url either from the client or the webkit target to a common format for comparing.
 * The client can handle urls in this format too.
 * file:///D:\\scripts\\code.js => d:/scripts/code.js
 * file:///Users/me/project/code.js => /Users/me/project/code.js
 * c:\\scripts\\code.js => c:/scripts/code.js
 * http://site.com/scripts/code.js => (no change)
 * http://site.com/ => http://site.com
 */
function canonicalizeUrl(aUrl) {
    aUrl = aUrl.replace('file:///', '');
    aUrl = stripTrailingSlash(aUrl);
    aUrl = fixDriveLetterAndSlashes(aUrl);
    if (aUrl[0] !== '/' && aUrl.indexOf(':') < 0 && getPlatform() === 1 /* OSX */) {
        // Ensure osx path starts with /, it can be removed when file:/// was stripped.
        // Don't add if the url still has a protocol
        aUrl = '/' + aUrl;
    }
    return aUrl;
}
exports.canonicalizeUrl = canonicalizeUrl;
/**
 * Ensure lower case drive letter and \ on Windows
 */
function fixDriveLetterAndSlashes(aPath) {
    if (getPlatform() === 0 /* Windows */) {
        if (aPath.match(/file:\/\/\/[A-Za-z]:/)) {
            var prefixLen = 'file:///'.length;
            aPath =
                'file:///' +
                    aPath[prefixLen].toLowerCase() +
                    aPath.substr(prefixLen + 1).replace(/\//g, path.sep);
        }
        else if (aPath.match(/^[A-Za-z]:/)) {
            // If this is Windows and the path starts with a drive letter, ensure lowercase. VS Code uses a lowercase drive letter
            aPath = aPath[0].toLowerCase() + aPath.substr(1);
            aPath = aPath.replace(/\//g, path.sep);
        }
    }
    return aPath;
}
exports.fixDriveLetterAndSlashes = fixDriveLetterAndSlashes;
/**
 * Remove a slash of any flavor from the end of the path
 */
function stripTrailingSlash(aPath) {
    return aPath
        .replace(/\/$/, '')
        .replace(/\\$/, '');
}
exports.stripTrailingSlash = stripTrailingSlash;
function remoteObjectToValue(object, stringify) {
    if (stringify === void 0) { stringify = true; }
    var value = '';
    var variableHandleRef;
    if (object) {
        if (object.type === 'object') {
            if (object.subtype === 'null') {
                value = 'null';
            }
            else {
                // If it's a non-null object, create a variable reference so the client can ask for its props
                variableHandleRef = object.objectId;
                value = object.description;
            }
        }
        else if (object.type === 'undefined') {
            value = 'undefined';
        }
        else if (object.type === 'function') {
            var firstBraceIdx = object.description.indexOf('{');
            if (firstBraceIdx >= 0) {
                value = object.description.substring(0, firstBraceIdx) + '{ … }';
            }
            else {
                var firstArrowIdx = object.description.indexOf('=>');
                value = firstArrowIdx >= 0 ?
                    object.description.substring(0, firstArrowIdx + 2) + ' …' :
                    object.description;
            }
        }
        else {
            // The value is a primitive value, or something that has a description (not object, primitive, or undefined). And force to be string
            if (typeof object.value === 'undefined') {
                value = object.description;
            }
            else {
                value = stringify ? JSON.stringify(object.value) : object.value;
            }
        }
    }
    return { value: value, variableHandleRef: variableHandleRef };
}
exports.remoteObjectToValue = remoteObjectToValue;
/**
 * A helper for returning a rejected promise with an Error object. Avoids double-wrapping an Error, which could happen
 * when passing on a failure from a Promise error handler.
 * @param msg - Should be either a string or an Error
 */
function errP(msg) {
    var e;
    if (!msg) {
        e = new Error('Unknown error');
    }
    else if (msg.message) {
        // msg is already an Error object
        e = msg;
    }
    else {
        e = new Error(msg);
    }
    return Promise.reject(e);
}
exports.errP = errP;
/**
 * Calculates the webRoot from a launch/attach request. The webRoot is the directory that the
 * files are served from by a web server, (or the directory that they would be served from, and which
 * sourceRoot may be relative to).
 */
function getWebRoot(args) {
    var webRoot;
    if (args.webRoot) {
        webRoot = args.webRoot;
        if (!path.isAbsolute(webRoot)) {
            webRoot = path.resolve(args.cwd, webRoot);
        }
    }
    else {
        webRoot = args.cwd;
    }
    return webRoot;
}
exports.getWebRoot = getWebRoot;
/**
 * Helper function to GET the contents of a url
 */
function getURL(aUrl) {
    return new Promise(function (resolve, reject) {
        http.get(aUrl, function (response) {
            var responseData = '';
            response.on('data', function (chunk) { return responseData += chunk; });
            response.on('end', function () {
                // Sometimes the 'error' event is not fired. Double check here.
                if (response.statusCode === 200) {
                    resolve(responseData);
                }
                else {
                    reject(responseData);
                }
            });
        }).on('error', function (e) {
            reject(e);
        });
    });
}
exports.getURL = getURL;
/**
 * Returns true if urlOrPath is like "http://localhost" and not like "c:/code/file.js" or "/code/file.js"
 */
function isURL(urlOrPath) {
    return urlOrPath && !path.isAbsolute(urlOrPath) && !!url.parse(urlOrPath).protocol;
}
exports.isURL = isURL;
/**
 * Strip a string from the left side of a string
 */
function lstrip(s, lStr) {
    return s.startsWith(lStr) ?
        s.substr(lStr.length) :
        s;
}
exports.lstrip = lstrip;
/**
 * Convert a local path to a file URL, like
 * C:/code/app.js => file:///C:/code/app.js
 * /code/app.js => file:///code/app.js
 */
function pathToFileURL(path) {
    return (path.startsWith('/') ? 'file://' : 'file:///') +
        path;
}
exports.pathToFileURL = pathToFileURL;

//# sourceMappingURL=utilities.js.map
