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
            else {
                value = stringify ? JSON.stringify(object.value) : object.value;
            }
        }
    }
    return { value: value, variableHandleRef: variableHandleRef };
}
exports.remoteObjectToValue = remoteObjectToValue;
function getMatchingTargets(targets, targetUrl) {
    var standardizeUrl = function (aUrl) { return utils.canonicalizeUrl(aUrl).toLowerCase(); };
    // Look for an exact match
    targetUrl = standardizeUrl(targetUrl);
    var exactMatchTargets = targets.filter(function (target) { return standardizeUrl(target.url) === targetUrl; });
    if (exactMatchTargets.length) {
        targets = exactMatchTargets;
    }
    else {
        // Strip the protocol, if present. Don't try parsing this since it may not be an actual url, e.g., 'localhost'.
        // canonicalizeUrl would have already fixed file:/// or ?params
        if (targetUrl.indexOf('://') >= 0)
            targetUrl = targetUrl.split('://')[1];
        // Find targets that have the targetUrl as a substring
        targets = targets.filter(function (target) { return standardizeUrl(target.url).indexOf(targetUrl) >= 0; });
    }
    return targets;
}
exports.getMatchingTargets = getMatchingTargets;

//# sourceMappingURL=chromeUtils.js.map
