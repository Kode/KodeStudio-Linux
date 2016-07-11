/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
var source_map_1 = require('source-map');
var path = require('path');
var sourceMapUtils = require('./sourceMapUtils');
var utils = require('../utils');
var logger = require('../logger');
var SourceMap = (function () {
    /**
     * pathToGenerated - an absolute local path or a URL
     * json - sourcemap contents
     * webRoot - an absolute path
     */
    function SourceMap(generatedPath, json, webRoot) {
        var _this = this;
        this._authoredPathCaseMap = new Map(); // Maintain pathCase map because VSCode is case sensitive
        this._generatedPath = generatedPath;
        var sm = JSON.parse(json);
        logger.log("SourceMap: creating for " + generatedPath);
        logger.log("SourceMap: sourceRoot: " + sm.sourceRoot);
        if (sm.sourceRoot && sm.sourceRoot.toLowerCase() === '/source/') {
            logger.log('Warning: if you are using gulp-sourcemaps < 2.0 directly or indirectly, you may need to set sourceRoot manually in your build config, if your files are not actually under a directory called /source');
        }
        logger.log("SourceMap: sources: " + JSON.stringify(sm.sources));
        if (sm.sourcesContent && sm.sourcesContent.length) {
            logger.log("Warning: SourceMap sources are inlined. This extension ignores inlined sources. If the paths are not correct, sourcemap support won't work.");
        }
        logger.log("SourceMap: webRoot: " + webRoot);
        var absSourceRoot = sourceMapUtils.getAbsSourceRoot(sm.sourceRoot, webRoot, this._generatedPath);
        // Overwrite the sourcemap's sourceRoot with the version that's resolved to an absolute path,
        // so the work above only has to be done once
        sm.sourceRoot = null;
        // sm.sources are relative paths or file:/// urls - (or other URLs?) read the spec...
        // resolve them to file:/// urls, using absSourceRoot, to be simpler and unambiguous, since
        // it needs to look them up later in exactly the same format.
        // note - the source-map library doesn't like backslashes, but some tools output them.
        // Which is wrong? Consider filing issues on source-map or tools that output backslashes?
        // In either case, support whatever works
        this._sources = sm.sources.map(function (sourcePath) {
            // Special-case webpack:/// prefixed sources which is kind of meaningless
            sourcePath = utils.lstrip(sourcePath, 'webpack:///');
            sourcePath = utils.canonicalizeUrl(sourcePath);
            // If not already an absolute path, make it an absolute path with this._absSourceRoot. Also resolves '..' parts.
            if (!path.isAbsolute(sourcePath)) {
                sourcePath = path.resolve(absSourceRoot, sourcePath);
            }
            return sourcePath;
        });
        // Rewrite sm.sources to same as this._sources but forward slashes and file url
        sm.sources = this._sources.map(function (sourceAbsPath) {
            // Convert to file:/// url. After this, it's a file URL for an absolute path to a file on disk with forward slashes.
            // We lowercase so authored <-> generated mapping is not case sensitive.
            var lowerCaseSourceAbsPath = sourceAbsPath.toLowerCase();
            _this._authoredPathCaseMap.set(lowerCaseSourceAbsPath, sourceAbsPath);
            return utils.pathToFileURL(lowerCaseSourceAbsPath);
        });
        this._smc = new source_map_1.SourceMapConsumer(sm);
    }
    Object.defineProperty(SourceMap.prototype, "authoredSources", {
        /*
         * Return all mapped sources as absolute paths
         */
        get: function () {
            return this._sources;
        },
        enumerable: true,
        configurable: true
    });
    /*
     * The generated file of this source map.
     */
    SourceMap.prototype.generatedPath = function () {
        return this._generatedPath;
    };
    /*
     * Returns true if this source map originates from the given source.
     */
    SourceMap.prototype.doesOriginateFrom = function (absPath) {
        return this.authoredSources.some(function (path) { return path === absPath; });
    };
    /*
     * Finds the nearest source location for the given location in the generated file.
     * Will return null instead of a mapping on the next line (different from generatedPositionFor).
     */
    SourceMap.prototype.authoredPositionFor = function (line, column) {
        // source-map lib uses 1-indexed lines.
        line++;
        var lookupArgs = {
            line: line,
            column: column,
            bias: source_map_1.SourceMapConsumer.LEAST_UPPER_BOUND
        };
        var position = this._smc.originalPositionFor(lookupArgs);
        if (!position.source) {
            // If it can't find a match, it returns a mapping with null props. Try looking the other direction.
            lookupArgs.bias = source_map_1.SourceMapConsumer.GREATEST_LOWER_BOUND;
            position = this._smc.originalPositionFor(lookupArgs);
        }
        if (position.source) {
            // file:/// -> absolute path
            position.source = utils.canonicalizeUrl(position.source);
            // Convert back to original case
            position.source = this._authoredPathCaseMap.get(position.source) || position.source;
            // Back to 0-indexed lines
            position.line--;
            return position;
        }
        else {
            return null;
        }
    };
    /*
     * Finds the nearest location in the generated file for the given source location.
     * Will return a mapping on the next line, if there is no subsequent mapping on the expected line.
     */
    SourceMap.prototype.generatedPositionFor = function (source, line, column) {
        // source-map lib uses 1-indexed lines.
        line++;
        // sources in the sourcemap have been forced to file:///
        // Convert to lowerCase so search is case insensitive
        source = utils.pathToFileURL(source.toLowerCase());
        var lookupArgs = {
            line: line,
            column: column,
            source: source,
            bias: source_map_1.SourceMapConsumer.LEAST_UPPER_BOUND
        };
        var position = this._smc.generatedPositionFor(lookupArgs);
        if (position.line === null) {
            // If it can't find a match, it returns a mapping with null props. Try looking the other direction.
            lookupArgs.bias = source_map_1.SourceMapConsumer.GREATEST_LOWER_BOUND;
            position = this._smc.generatedPositionFor(lookupArgs);
        }
        if (position.line === null) {
            return null;
        }
        else {
            return {
                line: position.line - 1,
                column: position.column,
                source: this._generatedPath
            };
        }
    };
    return SourceMap;
}());
exports.SourceMap = SourceMap;

//# sourceMappingURL=sourceMap.js.map
