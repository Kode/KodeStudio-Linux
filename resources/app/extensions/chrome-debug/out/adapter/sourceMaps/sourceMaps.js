/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
/* tslint:disable */
var Path = require('path');
var URL = require('url');
var FS = require('fs');
var source_map_1 = require('source-map');
var PathUtils = require('./pathUtilities');
var utils = require('../../webkit/utilities');
var utilities_1 = require('../../webkit/utilities');
var SourceMaps = (function () {
    function SourceMaps(webRoot) {
        this._generatedToSourceMaps = {}; // generated -> source file
        this._sourceToGeneratedMaps = {}; // source file -> generated
        this._webRoot = webRoot;
    }
    SourceMaps.prototype.MapPathFromSource = function (pathToSource) {
        var map = this._findSourceToGeneratedMapping(pathToSource);
        if (map)
            return map.generatedPath();
        return null;
        ;
    };
    SourceMaps.prototype.MapFromSource = function (pathToSource, line, column) {
        var map = this._findSourceToGeneratedMapping(pathToSource);
        if (map) {
            line += 1; // source map impl is 1 based
            var mr = map.generatedPositionFor(pathToSource, line, column);
            if (typeof mr.line === 'number') {
                if (SourceMaps.TRACE)
                    console.error(Path.basename(pathToSource) + " " + line + ":" + column + " -> " + mr.line + ":" + mr.column);
                return { path: map.generatedPath(), line: mr.line - 1, column: mr.column };
            }
        }
        return null;
    };
    SourceMaps.prototype.MapToSource = function (pathToGenerated, line, column) {
        var map = this._generatedToSourceMaps[pathToGenerated];
        if (map) {
            line += 1; // source map impl is 1 based
            var mr = map.originalPositionFor(line, column);
            if (mr.source) {
                if (SourceMaps.TRACE)
                    console.error(Path.basename(pathToGenerated) + " " + line + ":" + column + " -> " + mr.line + ":" + mr.column);
                return { path: mr.source, line: mr.line - 1, column: mr.column };
            }
        }
        return null;
    };
    SourceMaps.prototype.AllMappedSources = function (pathToGenerated) {
        var map = this._generatedToSourceMaps[pathToGenerated];
        return map ? map.sources : null;
    };
    SourceMaps.prototype.ProcessNewSourceMap = function (pathToGenerated, sourceMapURL) {
        return this._findGeneratedToSourceMapping(pathToGenerated, sourceMapURL).then(function () { });
    };
    //---- private -----------------------------------------------------------------------
    SourceMaps.prototype._findSourceToGeneratedMapping = function (pathToSource) {
        if (pathToSource) {
            if (pathToSource in this._sourceToGeneratedMaps) {
                return this._sourceToGeneratedMaps[pathToSource];
            }
            for (var key in this._generatedToSourceMaps) {
                var m = this._generatedToSourceMaps[key];
                if (m.doesOriginateFrom(pathToSource)) {
                    this._sourceToGeneratedMaps[pathToSource] = m;
                    return m;
                }
            }
        }
        return null;
    };
    /**
     * pathToGenerated - an absolute local path or a URL.
     * mapPath - a path relative to pathToGenerated.
     */
    SourceMaps.prototype._findGeneratedToSourceMapping = function (pathToGenerated, mapPath) {
        var _this = this;
        if (!pathToGenerated) {
            return Promise.resolve(null);
        }
        if (pathToGenerated in this._generatedToSourceMaps) {
            return Promise.resolve(this._generatedToSourceMaps[pathToGenerated]);
        }
        if (mapPath.indexOf("data:application/json;base64,") >= 0) {
            utilities_1.Logger.log("SourceMaps.findGeneratedToSourceMapping: Using inlined sourcemap in " + pathToGenerated);
            // sourcemap is inlined
            var pos = mapPath.indexOf(',');
            var data = mapPath.substr(pos + 1);
            try {
                var buffer = new Buffer(data, 'base64');
                var json = buffer.toString();
                if (json) {
                    var map = new SourceMap(pathToGenerated, json, this._webRoot);
                    this._generatedToSourceMaps[pathToGenerated] = map;
                    return Promise.resolve(map);
                }
            }
            catch (e) {
                utilities_1.Logger.log("SourceMaps.findGeneratedToSourceMapping: exception while processing data url (" + e.stack + ")");
            }
            return null;
        }
        // if path is relative make it absolute
        if (!Path.isAbsolute(mapPath)) {
            if (Path.isAbsolute(pathToGenerated)) {
                // runtime script is on disk, so map should be too
                mapPath = PathUtils.makePathAbsolute(pathToGenerated, mapPath);
            }
            else {
                // runtime script is not on disk, construct the full url for the source map
                var scriptUrl = URL.parse(pathToGenerated);
                mapPath = scriptUrl.protocol + "//" + scriptUrl.host + Path.dirname(scriptUrl.pathname) + "/" + mapPath;
            }
        }
        return this._createSourceMap(mapPath, pathToGenerated).then(function (map) {
            if (!map) {
                var mapPathNextToSource = pathToGenerated + ".map";
                if (mapPathNextToSource !== mapPath) {
                    return _this._createSourceMap(mapPathNextToSource, pathToGenerated);
                }
            }
            return map;
        }).then(function (map) {
            if (map) {
                _this._generatedToSourceMaps[pathToGenerated] = map;
            }
            return map || null;
        });
    };
    SourceMaps.prototype._createSourceMap = function (mapPath, pathToGenerated) {
        var _this = this;
        var contentsP;
        if (utils.isURL(mapPath)) {
            utilities_1.Logger.log("SourceMaps.createSourceMap: Downloading sourcemap file from " + mapPath);
            contentsP = utils.getURL(mapPath).catch(function (e) {
                utilities_1.Logger.log("SourceMaps.createSourceMap: Could not download map from " + mapPath);
                return null;
            });
        }
        else {
            contentsP = new Promise(function (resolve, reject) {
                utilities_1.Logger.log("SourceMaps.createSourceMap: Reading local sourcemap file from " + mapPath);
                FS.readFile(mapPath, function (err, data) {
                    if (err) {
                        utilities_1.Logger.log("SourceMaps.createSourceMap: Could not read map from " + mapPath);
                        resolve(null);
                    }
                    else {
                        resolve(data);
                    }
                });
            });
        }
        return contentsP.then(function (contents) {
            if (contents) {
                try {
                    // Throws for invalid contents JSON
                    return new SourceMap(pathToGenerated, contents, _this._webRoot);
                }
                catch (e) {
                    utilities_1.Logger.log("SourceMaps.createSourceMap: exception while processing sourcemap: " + e.stack);
                    return null;
                }
            }
            else {
                return null;
            }
        });
    };
    SourceMaps.TRACE = false;
    SourceMaps.SOURCE_MAPPING_MATCHER = new RegExp("//[#@] ?sourceMappingURL=(.+)$");
    return SourceMaps;
})();
exports.SourceMaps = SourceMaps;
var Bias;
(function (Bias) {
    Bias[Bias["GREATEST_LOWER_BOUND"] = 1] = "GREATEST_LOWER_BOUND";
    Bias[Bias["LEAST_UPPER_BOUND"] = 2] = "LEAST_UPPER_BOUND";
})(Bias || (Bias = {}));
var SourceMap = (function () {
    /**
     * pathToGenerated - an absolute local path or a URL
     * json - sourcemap contents
     * webRoot - an absolute path
     */
    function SourceMap(generatedPath, json, webRoot) {
        var _this = this;
        utilities_1.Logger.log("SourceMap: creating SM for " + generatedPath);
        this._generatedPath = generatedPath;
        this._webRoot = webRoot;
        var sm = JSON.parse(json);
        this._absSourceRoot = PathUtils.getAbsSourceRoot(sm.sourceRoot, this._webRoot, this._generatedPath);
        // Overwrite the sourcemap's sourceRoot with the version that's resolved to an absolute path,
        // so the work above only has to be done once
        sm.sourceRoot = utils.pathToFileURL(this._absSourceRoot);
        sm.sources = sm.sources.map(function (sourcePath) {
            // special-case webpack:/// prefixed sources which is kind of meaningless
            sourcePath = utils.lstrip(sourcePath, 'webpack:///');
            // Force correct format for sanity
            return utils.fixDriveLetterAndSlashes(sourcePath);
        });
        this._smc = new source_map_1.SourceMapConsumer(sm);
        // rewrite sources as absolute paths
        this._sources = sm.sources.map(function (sourcePath) {
            if (sourcePath.startsWith('file:///')) {
                // If one source is a URL, assume all are
                _this._sourcesAreURLs = true;
            }
            sourcePath = utils.lstrip(sourcePath, 'webpack:///');
            sourcePath = PathUtils.canonicalizeUrl(sourcePath);
            if (Path.isAbsolute(sourcePath)) {
                return utils.fixDriveLetterAndSlashes(sourcePath);
            }
            else {
                return Path.join(_this._absSourceRoot, sourcePath);
            }
        });
    }
    Object.defineProperty(SourceMap.prototype, "sources", {
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
     * the generated file of this source map.
     */
    SourceMap.prototype.generatedPath = function () {
        return this._generatedPath;
    };
    /*
     * returns true if this source map originates from the given source.
     */
    SourceMap.prototype.doesOriginateFrom = function (absPath) {
        //return this.sources.some(path => path === absPath);
        return true; // Haxe creates just one JavaScript file
    };
    /*
     * finds the nearest source location for the given location in the generated file.
     */
    SourceMap.prototype.originalPositionFor = function (line, column, bias) {
        if (bias === void 0) { bias = Bias.GREATEST_LOWER_BOUND; }
        var mp = this._smc.originalPositionFor({
            line: line,
            column: column,
            bias: bias
        });
        if (mp.source) {
            mp.source = PathUtils.canonicalizeUrl(mp.source);
        }
        return mp;
    };
    /*
     * finds the nearest location in the generated file for the given source location.
     */
    SourceMap.prototype.generatedPositionFor = function (src, line, column, bias) {
        if (bias === void 0) { bias = Bias.GREATEST_LOWER_BOUND; }
        if (this._sourcesAreURLs) {
            src = utils.pathToFileURL(src);
        }
        else if (this._absSourceRoot) {
            // make input path relative to sourceRoot
            src = Path.relative(this._absSourceRoot, src);
            // source-maps use forward slashes unless the source is specified with file:///
            if (process.platform === 'win32') {
                src = src.replace(/\\/g, '/');
            }
        }
        var needle = {
            source: src,
            line: line,
            column: column,
            bias: bias
        };
        return this._smc.generatedPositionFor(needle);
    };
    return SourceMap;
})();

//# sourceMappingURL=sourceMaps.js.map
