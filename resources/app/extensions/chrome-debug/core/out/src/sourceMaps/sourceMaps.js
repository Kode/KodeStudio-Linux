/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
var sourceMapFactory_1 = require('./sourceMapFactory');
var SourceMaps = (function () {
    function SourceMaps(webRoot) {
        // Maps absolute paths to generated/authored source files to their corresponding SourceMap object
        this._generatedPathToSourceMap = new Map();
        this._authoredPathToSourceMap = new Map();
        this._webRoot = webRoot;
    }
    /**
     * Returns the generated script path for an authored source path
     * @param pathToSource - The absolute path to the authored file
     */
    SourceMaps.prototype.getGeneratedPathFromAuthoredPath = function (authoredPath) {
        authoredPath = authoredPath.toLowerCase();
        return this._authoredPathToSourceMap.has(authoredPath) ?
            this._authoredPathToSourceMap.get(authoredPath).generatedPath() :
            null;
    };
    SourceMaps.prototype.mapToGenerated = function (authoredPath, line, column) {
        authoredPath = authoredPath.toLowerCase();
        return this._authoredPathToSourceMap.has(authoredPath) ?
            this._authoredPathToSourceMap.get(authoredPath)
                .generatedPositionFor(authoredPath, line, column) :
            null;
    };
    SourceMaps.prototype.mapToAuthored = function (pathToGenerated, line, column) {
        pathToGenerated = pathToGenerated.toLowerCase();
        return this._generatedPathToSourceMap.has(pathToGenerated) ?
            this._generatedPathToSourceMap.get(pathToGenerated)
                .authoredPositionFor(line, column) :
            null;
    };
    SourceMaps.prototype.allMappedSources = function (pathToGenerated) {
        pathToGenerated = pathToGenerated.toLowerCase();
        return this._generatedPathToSourceMap.has(pathToGenerated) ?
            this._generatedPathToSourceMap.get(pathToGenerated).authoredSources :
            null;
    };
    /**
     * Given a new path to a new script file, finds and loads the sourcemap for that file
     */
    SourceMaps.prototype.processNewSourceMap = function (pathToGenerated, sourceMapURL) {
        var _this = this;
        return this._generatedPathToSourceMap.has(pathToGenerated.toLowerCase()) ?
            Promise.resolve(null) :
            sourceMapFactory_1.getMapForGeneratedPath(pathToGenerated, sourceMapURL, this._webRoot).then(function (sourceMap) {
                if (sourceMap) {
                    _this._generatedPathToSourceMap.set(pathToGenerated.toLowerCase(), sourceMap);
                    sourceMap.authoredSources.forEach(function (authoredSource) { return _this._authoredPathToSourceMap.set(authoredSource.toLowerCase(), sourceMap); });
                }
            });
    };
    return SourceMaps;
}());
exports.SourceMaps = SourceMaps;

//# sourceMappingURL=sourceMaps.js.map
