/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
var url = require('url');
var path = require('path');
var utils = require('../utils');
/**
 * Maps a url from target to an absolute local path.
 * If not given an absolute path (with file: prefix), searches the current working directory for a matching file.
 * http://localhost/scripts/code.js => d:/app/scripts/code.js
 * file:///d:/scripts/code.js => d:/scripts/code.js
 */
function targetUrlToClientPath(webRoot, aUrl) {
    if (!aUrl) {
        return '';
    }
    // If the url is an absolute path to a file that exists, return it without file:///.
    // A remote absolute url (cordova) will still need the logic below.
    var canonicalUrl = utils.canonicalizeUrl(aUrl);
    if (aUrl.startsWith('file:///') && utils.existsSync(canonicalUrl)) {
        return canonicalUrl;
    }
    // If we don't have the client workingDirectory for some reason, don't try to map the url to a client path
    if (!webRoot) {
        return '';
    }
    // Search the filesystem under the webRoot for the file that best matches the given url
    var pathName = decodeURIComponent(url.parse(canonicalUrl).pathname);
    if (!pathName || pathName === '/') {
        return '';
    }
    // Dealing with the path portion of either a url or an absolute path to remote file.
    // Need to force path.sep separator
    pathName = pathName.replace(/\//g, path.sep);
    var pathParts = pathName.split(path.sep);
    while (pathParts.length > 0) {
        var clientPath = path.join(webRoot, pathParts.join(path.sep));
        if (utils.existsSync(clientPath)) {
            return utils.canonicalizeUrl(clientPath);
        }
        pathParts.shift();
    }
    return '';
}
exports.targetUrlToClientPath = targetUrlToClientPath;
/**
 * Convert a RemoteObject to a value+variableHandleRef for the client.
 */
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
            else if (object.type === 'number') {
                // 3 => "3"
                // "Infinity" => "Infinity" (not stringified)
                value = object.value + '';
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
 * Returns the targets from the given list that match the targetUrl, which may have * wildcards.
 * Ignores the protocol and is case-insensitive.
 */
function getMatchingTargets(targets, targetUrlPattern) {
    var standardizeMatch = function (aUrl) {
        // Strip file:///, if present
        aUrl = utils.fileUrlToPath(aUrl).toLowerCase();
        // Strip the protocol, if present
        if (aUrl.indexOf('://') >= 0)
            aUrl = aUrl.split('://')[1];
        // Need to do a regex match, but URLs can have special regex chars. Escape those.
        return encodeURIComponent(aUrl);
    };
    targetUrlPattern = standardizeMatch(targetUrlPattern).replace(/\*/g, '.*');
    var encodedSlash = encodeURIComponent('/');
    if (!targetUrlPattern.endsWith(encodedSlash)) {
        // Add optional ending slash - so "localhost:3000" will match "localhost:3000/"
        targetUrlPattern += "(" + encodedSlash + ")?";
    }
    var targetUrlRegex = new RegExp('^' + targetUrlPattern + '$', 'g');
    return targets.filter(function (target) { return !!standardizeMatch(target.url).match(targetUrlRegex); });
}
exports.getMatchingTargets = getMatchingTargets;
var PROTO_NAME = '__proto__';
var NUM_REGEX = /^[0-9]+$/;
function compareVariableNames(var1, var2) {
    // __proto__ at the end
    if (var1 === PROTO_NAME) {
        return 1;
    }
    else if (var2 === PROTO_NAME) {
        return -1;
    }
    var isNum1 = !!var1.match(NUM_REGEX);
    var isNum2 = !!var2.match(NUM_REGEX);
    if (isNum1 && !isNum2) {
        // Numbers after names
        return 1;
    }
    else if (!isNum1 && isNum2) {
        // Names before numbers
        return -1;
    }
    else if (isNum1 && isNum2) {
        // Compare numbers as numbers
        var int1 = parseInt(var1, 10);
        var int2 = parseInt(var2, 10);
        return int1 - int2;
    }
    // Compare strings as strings
    return var1.localeCompare(var2);
}
exports.compareVariableNames = compareVariableNames;
//# sourceMappingURL=chromeUtils.js.map