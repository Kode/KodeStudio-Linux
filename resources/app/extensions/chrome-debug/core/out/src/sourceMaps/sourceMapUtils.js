/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
var path = require('path');
var url = require('url');
var utils = require('../utils');
var logger = require('../logger');
/**
 * Resolves a relative path in terms of another file
 */
function resolveRelativeToFile(absPath, relPath) {
    return path.resolve(path.dirname(absPath), relPath);
}
exports.resolveRelativeToFile = resolveRelativeToFile;
/**
 * Determine the absolute path to the sourceRoot.
 */
function getAbsSourceRoot(sourceRoot, webRoot, generatedPath) {
    var absSourceRoot;
    if (sourceRoot) {
        if (sourceRoot.startsWith('file:///')) {
            // sourceRoot points to a local path like "file:///c:/project/src", make it an absolute path
            absSourceRoot = utils.canonicalizeUrl(sourceRoot);
        }
        else if (sourceRoot.startsWith('/')) {
            // sourceRoot is like "/src", would be like http://localhost/src, resolve to a local path under webRoot
            // note that C:/src (or /src as an absolute local path) is not a valid sourceroot
            absSourceRoot = path.join(webRoot, sourceRoot);
        }
        else {
            // sourceRoot is like "src" or "../src", relative to the script
            if (path.isAbsolute(generatedPath)) {
                absSourceRoot = resolveRelativeToFile(generatedPath, sourceRoot);
            }
            else {
                // generatedPath is a URL so runtime script is not on disk, resolve the sourceRoot location on disk
                var genDirname = path.dirname(url.parse(generatedPath).pathname);
                absSourceRoot = path.join(webRoot, genDirname, sourceRoot);
            }
        }
        logger.log("SourceMap: resolved sourceRoot " + sourceRoot + " -> " + absSourceRoot);
    }
    else if (path.isAbsolute(generatedPath)) {
        absSourceRoot = path.dirname(generatedPath);
        logger.log("SourceMap: no sourceRoot specified, using script dirname: " + absSourceRoot);
    }
    else {
        // runtime script is not on disk, resolve the sourceRoot location on disk
        var scriptPathDirname = path.dirname(url.parse(generatedPath).pathname);
        absSourceRoot = path.join(webRoot, scriptPathDirname);
        logger.log("SourceMap: no sourceRoot specified, using webRoot + script path dirname: " + absSourceRoot);
    }
    absSourceRoot = utils.stripTrailingSlash(absSourceRoot);
    absSourceRoot = utils.fixDriveLetterAndSlashes(absSourceRoot);
    return absSourceRoot;
}
exports.getAbsSourceRoot = getAbsSourceRoot;

//# sourceMappingURL=sourceMapUtils.js.map
