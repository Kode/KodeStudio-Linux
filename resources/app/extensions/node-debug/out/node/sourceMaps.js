/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
"use strict";
var Path = require('path');
var FS = require('fs');
var URL = require('url');
var HTTP = require('http');
var source_map_1 = require('source-map');
var PathUtils = require('./pathUtilities');
var util = require('../../node_modules/source-map/lib/util.js');
var pathNormalize = (process.platform === 'win32' || process.platform === 'darwin') ? function (path) { return path.toLowerCase(); } : function (path) { return path; };
(function (Bias) {
    Bias[Bias["GREATEST_LOWER_BOUND"] = 1] = "GREATEST_LOWER_BOUND";
    Bias[Bias["LEAST_UPPER_BOUND"] = 2] = "LEAST_UPPER_BOUND";
})(exports.Bias || (exports.Bias = {}));
var Bias = exports.Bias;
var SourceMaps = (function () {
    function SourceMaps(session, generatedCodeDirectory) {
        this._allSourceMaps = {}; // map file path -> SourceMap
        this._generatedToSourceMaps = {}; // generated file -> SourceMap
        this._sourceToGeneratedMaps = {}; // source file -> SourceMap
        this._httpCache = new Map();
        this._session = session;
        this._generatedCodeDirectory = generatedCodeDirectory;
    }
    SourceMaps.prototype.MapPathFromSource = function (pathToSource) {
        return this._findSourceToGeneratedMapping(pathToSource).then(function (map) {
            return map ? map.generatedPath() : null;
        });
    };
    SourceMaps.prototype.MapFromSource = function (pathToSource, line, column, bias) {
        return this._findSourceToGeneratedMapping(pathToSource).then(function (map) {
            if (map) {
                line += 1; // source map impl is 1 based
                var mr = map.generatedPositionFor(pathToSource, line, column, bias);
                if (mr && typeof mr.line === 'number') {
                    return {
                        path: map.generatedPath(),
                        line: mr.line - 1,
                        column: mr.column
                    };
                }
            }
            return null;
        });
    };
    SourceMaps.prototype.MapToSource = function (pathToGenerated, content, line, column) {
        return this._findGeneratedToSourceMapping(pathToGenerated, content).then(function (map) {
            if (map) {
                line += 1; // source map impl is 1 based
                var mr = map.originalPositionFor(line, column, Bias.GREATEST_LOWER_BOUND);
                if (!mr) {
                    mr = map.originalPositionFor(line, column, Bias.LEAST_UPPER_BOUND);
                }
                if (mr && mr.source) {
                    return {
                        path: mr.source,
                        content: mr.content,
                        line: mr.line - 1,
                        column: mr.column
                    };
                }
            }
            return null;
        });
    };
    SourceMaps.prototype.HasSourceMap = function (content) {
        return this._findSourceMapUrlInFile(null, content) !== null;
    };
    SourceMaps.prototype.LoadSourceMap = function (content) {
        var uri = this._findSourceMapUrlInFile(null, content);
        if (uri) {
            return this._rawSourceMap(uri).then(function (sm) {
                if (sm) {
                    return new SourceMap('mapPath', 'getPath', sm);
                }
                else {
                    return null;
                }
            }).catch(function (err) {
                return null;
            });
        }
        else {
            return Promise.resolve(null);
        }
    };
    //---- private -----------------------------------------------------------------------
    /**
     * Tries to find a SourceMap for the given source.
     * This is difficult because the source does not contain any information about where
     * the generated code or the source map is located.
     * Our strategy is as follows:
     * - search in all known source maps whether if refers to this source in the sources array.
     * - ...
     */
    SourceMaps.prototype._findSourceToGeneratedMapping = function (pathToSource) {
        var _this = this;
        if (!pathToSource) {
            return Promise.resolve(null);
        }
        var pathToSourceKey = pathNormalize(pathToSource);
        // try to find in existing
        if (pathToSourceKey in this._sourceToGeneratedMaps) {
            return Promise.resolve(this._sourceToGeneratedMaps[pathToSourceKey]);
        }
        // a reverse lookup: in all source maps try to find pathToSource in the sources array
        for (var key in this._generatedToSourceMaps) {
            var m = this._generatedToSourceMaps[key];
            if (m.doesOriginateFrom(pathToSource)) {
                this._sourceToGeneratedMaps[pathToSourceKey] = m;
                return Promise.resolve(m);
            }
        }
        // search for all map files in generatedCodeDirectory
        if (this._generatedCodeDirectory) {
            try {
                var maps = FS.readdirSync(this._generatedCodeDirectory).filter(function (e) { return Path.extname(e.toLowerCase()) === '.map'; });
                for (var _i = 0, maps_1 = maps; _i < maps_1.length; _i++) {
                    var map_name = maps_1[_i];
                    var map_path = Path.join(this._generatedCodeDirectory, map_name);
                    var m = this._loadSourceMap(map_path);
                    if (m && m.doesOriginateFrom(pathToSource)) {
                        this._log("_findSourceToGeneratedMapping: found source map for source " + pathToSource + " in outDir");
                        this._sourceToGeneratedMaps[pathToSourceKey] = m;
                        return Promise.resolve(m);
                    }
                }
            }
            catch (e) {
            }
        }
        // no map found
        var pathToGenerated = pathToSource;
        var ext = Path.extname(pathToSource);
        if (ext !== '.js') {
            // use heuristic: change extension to ".js" and find a map for it
            var pos = pathToSource.lastIndexOf('.');
            if (pos >= 0) {
                pathToGenerated = pathToSource.substr(0, pos) + '.js';
            }
        }
        var map = null;
        return Promise.resolve(map).then(function (map) {
            // first look into the generated code directory
            if (_this._generatedCodeDirectory) {
                var promises = new Array();
                var rest = PathUtils.makeRelative(_this._generatedCodeDirectory, pathToGenerated);
                while (rest) {
                    var path = Path.join(_this._generatedCodeDirectory, rest);
                    promises.push(_this._findGeneratedToSourceMapping(path));
                    rest = PathUtils.removeFirstSegment(rest);
                }
                return Promise.all(promises).then(function (results) {
                    for (var _i = 0, results_1 = results; _i < results_1.length; _i++) {
                        var r = results_1[_i];
                        if (r) {
                            return r;
                        }
                    }
                    return null;
                });
            }
            return map;
        }).then(function (map) {
            // VSCode extension host support:
            // we know that the plugin has an "out" directory next to the "src" directory
            if (map === null) {
                var srcSegment = Path.sep + 'src' + Path.sep;
                if (pathToGenerated.indexOf(srcSegment) >= 0) {
                    var outSegment = Path.sep + 'out' + Path.sep;
                    return _this._findGeneratedToSourceMapping(pathToGenerated.replace(srcSegment, outSegment));
                }
            }
            return map;
        }).then(function (map) {
            if (map === null && pathNormalize(pathToGenerated) !== pathToSourceKey) {
                return _this._findGeneratedToSourceMapping(pathToGenerated);
            }
            return map;
        }).then(function (map) {
            if (map) {
                _this._sourceToGeneratedMaps[pathToSourceKey] = map;
            }
            return map;
        });
    };
    /**
     * Tries to find a SourceMap for the given path to a generated file.
     * This is simple if the generated file has the 'sourceMappingURL' at the end.
     * If not, we are using some heuristics...
     */
    SourceMaps.prototype._findGeneratedToSourceMapping = function (pathToGenerated, content) {
        var _this = this;
        if (!pathToGenerated) {
            return null;
        }
        var pathToGeneratedKey = pathNormalize(pathToGenerated);
        if (pathToGeneratedKey in this._generatedToSourceMaps) {
            return Promise.resolve(this._generatedToSourceMaps[pathToGeneratedKey]);
        }
        // try to find a source map URL in the generated file
        var uri = this._findSourceMapUrlInFile(pathToGenerated, content);
        if (uri) {
            return this._rawSourceMap(uri, pathToGenerated).then(function (rsm) {
                return _this._registerSourceMap(new SourceMap(pathToGenerated, pathToGenerated, rsm));
            }).catch(function (err) {
                return null;
            });
        }
        // try to find map file next to the generated source
        var map_path = pathToGenerated + '.map';
        if (FS.existsSync(map_path)) {
            var map = this._loadSourceMap(map_path, pathToGenerated);
            if (map) {
                return Promise.resolve(map);
            }
        }
        return Promise.resolve(null);
    };
    /**
     * Returns the string contents of a sourcemap specified via the given uri.
     */
    SourceMaps.prototype._rawSourceMap = function (uri, pathToGenerated) {
        var u = URL.parse(uri);
        if (u.protocol === 'file:' || u.protocol == null) {
            // a local file path
            var map_path = decodeURI(u.path);
            if (!map_path) {
                throw new Error("no path or empty path");
            }
            // if path is relative make it absolute
            if (!Path.isAbsolute(map_path)) {
                if (pathToGenerated) {
                    map_path = PathUtils.makePathAbsolute(pathToGenerated, map_path);
                }
                else {
                    throw new Error("relative path but no base given");
                }
            }
            return this._readFile(map_path);
        }
        if (u.protocol === 'data:' && u.host === 'application' && u.path.indexOf('/json;base64,') === 0) {
            // if uri is data url source map is inlined in generated file
            var pos = uri.lastIndexOf(',');
            if (pos > 0) {
                var data = uri.substr(pos + 1);
                try {
                    var buffer = new Buffer(data, 'base64');
                    var json = buffer.toString();
                    if (json) {
                        return Promise.resolve(json);
                    }
                }
                catch (e) {
                    throw new Error("exception while processing data url");
                }
            }
            throw new Error("exception while processing data url");
        }
        if (u.protocol === 'http:' || u.protocol === 'https:') {
            var p = this._httpCache.get(uri);
            if (!p) {
                p = new Promise(function (resolve, reject) {
                    var options = {
                        host: u.host,
                        path: u.path
                    };
                    var request = HTTP.request(options, function (res) {
                        var data = '';
                        res.on('data', function (chunk) {
                            data += chunk;
                        });
                        res.on('end', function () {
                            resolve(data);
                        });
                    });
                    request.on('error', function (err) {
                        reject(err);
                    });
                    request.end();
                });
                this._httpCache.set(uri, p);
            }
            return p;
        }
        throw new Error("url is not a valid source map");
    };
    /**
     * Try to find the 'sourceMappingURL' in the file with the given path.
     * Returns null if no source map url is found or if an error occured.
     */
    SourceMaps.prototype._findSourceMapUrlInFile = function (pathToGenerated, content) {
        try {
            var contents = content || FS.readFileSync(pathToGenerated).toString();
            var lines = contents.split('\n');
            for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
                var line = lines_1[_i];
                var matches = SourceMaps.SOURCE_MAPPING_MATCHER.exec(line);
                if (matches && matches.length === 2) {
                    var uri = matches[1].trim();
                    if (pathToGenerated) {
                        this._log("_findSourceMapUrlInFile: source map url found at end of generated file '" + pathToGenerated + "'");
                    }
                    else {
                        this._log("_findSourceMapUrlInFile: source map url found at end of generated content");
                    }
                    return uri;
                }
            }
        }
        catch (e) {
        }
        return null;
    };
    /**
     * Loads source map from file system.
     * If no generatedPath is given, the 'file' attribute of the source map is used.
     */
    SourceMaps.prototype._loadSourceMap = function (map_path, generatedPath) {
        var mapPathKey = pathNormalize(map_path);
        if (mapPathKey in this._allSourceMaps) {
            return this._allSourceMaps[mapPathKey];
        }
        try {
            var mp = Path.join(map_path);
            var contents = FS.readFileSync(mp).toString();
            var map = new SourceMap(mp, generatedPath, contents);
            this._allSourceMaps[mapPathKey] = map;
            this._registerSourceMap(map);
            this._log("_loadSourceMap: successfully loaded source map '" + map_path + "'");
            return map;
        }
        catch (e) {
            this._log("_loadSourceMap: loading source map '" + map_path + "' failed with exception: " + e);
        }
        return null;
    };
    SourceMaps.prototype._registerSourceMap = function (map) {
        var gp = map.generatedPath();
        if (gp) {
            this._generatedToSourceMaps[pathNormalize(gp)] = map;
        }
        return map;
    };
    SourceMaps.prototype._readFile = function (path, encoding) {
        if (encoding === void 0) { encoding = 'utf8'; }
        return new Promise(function (resolve, reject) {
            FS.readFile(path, encoding, function (err, fileContents) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(fileContents);
                }
            });
        });
    };
    SourceMaps.prototype._log = function (message) {
        this._session.log('sm', message);
    };
    SourceMaps.SOURCE_MAPPING_MATCHER = new RegExp('//[#@] ?sourceMappingURL=(.+)$');
    return SourceMaps;
}());
exports.SourceMaps = SourceMaps;
var SourceMap = (function () {
    function SourceMap(mapPath, generatedPath, json) {
        var _this = this;
        this._sourcemapLocation = this.fixPath(Path.dirname(mapPath));
        var sm = JSON.parse(json);
        if (!generatedPath) {
            var file = sm.file;
            if (!PathUtils.isAbsolutePath(file)) {
                generatedPath = PathUtils.makePathAbsolute(mapPath, file);
            }
        }
        this._generatedFile = generatedPath;
        // fix all paths for use with the source-map npm module.
        sm.sourceRoot = this.fixPath(sm.sourceRoot, '');
        for (var i = 0; i < sm.sources.length; i++) {
            sm.sources[i] = this.fixPath(sm.sources[i]);
        }
        this._sourceRoot = sm.sourceRoot;
        // use source-map utilities to normalize sources entries
        this._sources = sm.sources
            .map(util.normalize)
            .map(function (source) {
            return _this._sourceRoot && util.isAbsolute(_this._sourceRoot) && util.isAbsolute(source)
                ? util.relative(_this._sourceRoot, source)
                : source;
        });
        try {
            this._smc = new source_map_1.SourceMapConsumer(sm);
        }
        catch (e) {
        }
    }
    /**
     * fix a path for use with the source-map npm module because:
     * - source map sources are URLs, so even on Windows they should be using forward slashes.
     * - the source-map library expects forward slashes and their relative path logic
     *   (specifically the "normalize" function) gives incorrect results when passing in backslashes.
     * - paths starting with drive letters are not recognized as absolute by the source-map library.
     */
    SourceMap.prototype.fixPath = function (path, dflt) {
        if (path) {
            path = path.replace(/\\/g, '/');
            // if path starts with a drive letter convert path to a file url so that the source-map library can handle it
            if (/^[a-zA-Z]\:\//.test(path)) {
                // Windows drive letter must be prefixed with a slash
                path = encodeURI('file:///' + path);
            }
            return path;
        }
        return dflt;
    };
    /**
     * undo the fix
     */
    SourceMap.prototype.unfixPath = function (path) {
        var prefix = 'file://';
        if (path.indexOf(prefix) === 0) {
            path = path.substr(prefix.length);
            path = decodeURI(path);
            if (/^\/[a-zA-Z]\:\//.test(path)) {
                path = path.substr(1); // remove additional '/'
            }
        }
        return path;
    };
    /*
     * The generated file this source map belongs to.
     */
    SourceMap.prototype.generatedPath = function () {
        return this._generatedFile;
    };
    SourceMap.prototype.sources = function () {
        return this._sources;
    };
    /*
     * Returns true if this source map originates from the given source.
     */
    SourceMap.prototype.doesOriginateFrom = function (absPath) {
        return this.findSource(absPath) !== null;
    };
    /**
     * returns the first entry from the sources array that matches the given absPath
     * or null otherwise.
     */
    SourceMap.prototype.findSource = function (absPath) {
        // on Windows change back slashes to forward slashes because the source-map library requires this
        if (process.platform === 'win32') {
            absPath = absPath.replace(/\\/g, '/');
        }
        absPath = pathNormalize(absPath);
        for (var _i = 0, _a = this._sources; _i < _a.length; _i++) {
            var name_1 = _a[_i];
            if (!util.isAbsolute(name_1)) {
                name_1 = util.join(this._sourceRoot, name_1);
            }
            var path = this.absolutePath(name_1);
            path = pathNormalize(path);
            if (absPath === path) {
                return name_1;
            }
        }
        return null;
    };
    /**
     * Tries to make the given path absolute by prefixing it with the source maps location.
     * Any url schemes are removed.
     */
    SourceMap.prototype.absolutePath = function (path) {
        if (!util.isAbsolute(path)) {
            path = util.join(this._sourcemapLocation, path);
        }
        return this.unfixPath(path);
    };
    /*
     * Finds the nearest source location for the given location in the generated file.
     * Returns null if sourcemap is invalid.
     */
    SourceMap.prototype.originalPositionFor = function (line, column, bias) {
        if (!this._smc) {
            return null;
        }
        var needle = {
            line: line,
            column: column,
            bias: bias || Bias.LEAST_UPPER_BOUND
        };
        var mp = this._smc.originalPositionFor(needle);
        if (mp.source) {
            // if source map has inlined source, return it
            var src = this._smc.sourceContentFor(mp.source);
            if (src) {
                mp.content = src;
            }
            // map result back to absolute path
            mp.source = this.absolutePath(mp.source);
            // on Windows change forward slashes back to back slashes
            if (process.platform === 'win32') {
                mp.source = mp.source.replace(/\//g, '\\');
            }
        }
        return mp;
    };
    /*
     * Finds the nearest location in the generated file for the given source location.
     * Returns null if sourcemap is invalid.
     */
    SourceMap.prototype.generatedPositionFor = function (absPath, line, column, bias) {
        if (!this._smc) {
            return null;
        }
        // make sure that we use an entry from the "sources" array that matches the passed absolute path
        var source = this.findSource(absPath);
        if (source) {
            var needle = {
                source: source,
                line: line,
                column: column,
                bias: bias || Bias.LEAST_UPPER_BOUND
            };
            return this._smc.generatedPositionFor(needle);
        }
        return null;
    };
    return SourceMap;
}());
exports.SourceMap = SourceMap;

//# sourceMappingURL=../../out/node/sourceMaps.js.map
