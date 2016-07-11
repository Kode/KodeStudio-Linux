/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
var path = require('path');
var url = require('url');
var fs = require('fs');
var sourceMapUtils = require('./sourceMapUtils');
var utils = require('../utils');
var logger = require('../logger');
var sourceMap_1 = require('./sourceMap');
/**
 * pathToGenerated - an absolute local path or a URL.
 * mapPath - a path relative to pathToGenerated.
 */
function getMapForGeneratedPath(pathToGenerated, mapPath, webRoot) {
    logger.log("SourceMaps.getMapForGeneratedPath: Finding SourceMap for " + pathToGenerated + " by URI: " + mapPath + " and webRoot: " + webRoot);
    // For an inlined sourcemap, mapPath is a data URI containing a blob of base64 encoded data, starting
    // with a tag like "data:application/json;charset:utf-8;base64,". The data should start after the last comma.
    var sourceMapContentsP;
    if (mapPath.indexOf('data:application/json') >= 0) {
        // Sourcemap is inlined
        logger.log("SourceMaps.getMapForGeneratedPath: Using inlined sourcemap in " + pathToGenerated);
        sourceMapContentsP = Promise.resolve(getInlineSourceMapContents(mapPath));
    }
    else {
        sourceMapContentsP = getSourceMapContent(pathToGenerated, mapPath);
    }
    return sourceMapContentsP.then(function (contents) {
        if (contents) {
            try {
                // Throws for invalid JSON
                return new sourceMap_1.SourceMap(pathToGenerated, contents, webRoot);
            }
            catch (e) {
                logger.error("SourceMaps.getMapForGeneratedPath: exception while processing sourcemap: " + e.stack);
                return null;
            }
        }
        else {
            return null;
        }
    });
}
exports.getMapForGeneratedPath = getMapForGeneratedPath;
/**
 * Parses sourcemap contents from inlined base64-encoded data
 */
function getInlineSourceMapContents(sourceMapData) {
    var lastCommaPos = sourceMapData.lastIndexOf(',');
    if (lastCommaPos < 0) {
        logger.log("SourceMaps.getInlineSourceMapContents: Inline sourcemap is malformed. Starts with: " + sourceMapData.substr(0, 200));
        return null;
    }
    var data = sourceMapData.substr(lastCommaPos + 1);
    try {
        var buffer = new Buffer(data, 'base64');
        return buffer.toString();
    }
    catch (e) {
        logger.error("SourceMaps.getInlineSourceMapContents: exception while processing data uri (" + e.stack + ")");
    }
    return null;
}
/**
 * Resolves a sourcemap's path and loads the data
 */
function getSourceMapContent(pathToGenerated, mapPath) {
    if (!path.isAbsolute(mapPath)) {
        // mapPath needs to be resolved to an absolute path or a URL
        if (path.isAbsolute(pathToGenerated)) {
            // runtime script is on disk, so map should be too
            mapPath = sourceMapUtils.resolveRelativeToFile(pathToGenerated, mapPath);
        }
        else {
            // runtime script is not on disk, resolve a URL for the map relative to the script
            var scriptUrl = url.parse(pathToGenerated);
            mapPath = scriptUrl.protocol + "//" + scriptUrl.host + path.dirname(scriptUrl.pathname) + "/" + mapPath;
        }
    }
    return loadSourceMapContents(mapPath).then(function (contents) {
        if (!contents) {
            // Last ditch effort - just look for a .js.map next to the script
            var mapPathNextToSource = pathToGenerated + '.map';
            if (mapPathNextToSource !== mapPath) {
                return loadSourceMapContents(mapPathNextToSource);
            }
        }
        return contents;
    });
}
function loadSourceMapContents(mapPathOrURL) {
    var contentsP;
    if (utils.isURL(mapPathOrURL)) {
        logger.log("SourceMaps.loadSourceMapContents: Downloading sourcemap file from " + mapPathOrURL);
        contentsP = utils.getURL(mapPathOrURL).catch(function (e) {
            logger.error("SourceMaps.loadSourceMapContents: Could not download sourcemap from " + mapPathOrURL);
            return null;
        });
    }
    else {
        contentsP = new Promise(function (resolve, reject) {
            logger.log("SourceMaps.loadSourceMapContents: Reading local sourcemap file from " + mapPathOrURL);
            fs.readFile(mapPathOrURL, function (err, data) {
                if (err) {
                    logger.error("SourceMaps.loadSourceMapContents: Could not read sourcemap from " + mapPathOrURL);
                    resolve(null);
                }
                else {
                    resolve(data);
                }
            });
        });
    }
    return contentsP;
}

//# sourceMappingURL=sourceMapFactory.js.map
