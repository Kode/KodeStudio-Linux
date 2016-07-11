/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
"use strict";
var Path = require('path');
var FS = require('fs');
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
        this._session = session;
        this._generatedCodeDirectory = generatedCodeDirectory;
    }
    SourceMaps.prototype.MapPathFromSource = function (pathToSource) {
        var map = this._findSourceToGeneratedMapping(pathToSource);
        if (map) {
            return map.generatedPath();
        }
        return null;
    };
    SourceMaps.prototype.MapPathToSource = function (pathToGenerated, content) {
        var map = this._findGeneratedToSourceMapping(pathToGenerated, content);
        if (map) {
            return map.sources();
        }
        return null;
    };
    SourceMaps.prototype.MapFromSource = function (pathToSource, line, column, bias) {
        var map = this._findSourceToGeneratedMapping(pathToSource);
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
    };
    SourceMaps.prototype.MapToSource = function (pathToGenerated, content, line, column, bias) {
        var map = this._findGeneratedToSourceMapping(pathToGenerated, content);
        if (map) {
            line += 1; // source map impl is 1 based
            var mr = map.originalPositionFor(line, column, bias);
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
    };
    SourceMaps.prototype.HasSourceMap = function (content) {
        return this._findSourceMapUrlInFile(null, content) !== null;
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
        if (!pathToSource) {
            return null;
        }
        var pathToSourceKey = pathNormalize(pathToSource);
        // try to find in existing
        if (pathToSourceKey in this._sourceToGeneratedMaps) {
            return this._sourceToGeneratedMaps[pathToSourceKey];
        }
        // a reverse lookup: in all source maps try to find pathToSource in the sources array
        for (var key in this._generatedToSourceMaps) {
            var m = this._generatedToSourceMaps[key];
            if (m.doesOriginateFrom(pathToSource)) {
                this._sourceToGeneratedMaps[pathToSourceKey] = m;
                return m;
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
                        return m;
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
        // first look into the generated code directory
        if (this._generatedCodeDirectory) {
            var rest = PathUtils.makeRelative(this._generatedCodeDirectory, pathToGenerated);
            while (rest) {
                var path = Path.join(this._generatedCodeDirectory, rest);
                map = this._findGeneratedToSourceMapping(path);
                if (map) {
                    break;
                }
                rest = PathUtils.removeFirstSegment(rest);
            }
        }
        // VSCode extension host support:
        // we know that the plugin has an "out" directory next to the "src" directory
        if (map === null) {
            var srcSegment = Path.sep + 'src' + Path.sep;
            if (pathToGenerated.indexOf(srcSegment) >= 0) {
                var outSegment = Path.sep + 'out' + Path.sep;
                map = this._findGeneratedToSourceMapping(pathToGenerated.replace(srcSegment, outSegment));
            }
        }
        // if not found look in the same directory as the source
        if (map === null && pathNormalize(pathToGenerated) !== pathToSourceKey) {
            map = this._findGeneratedToSourceMapping(pathToGenerated);
        }
        if (map) {
            this._sourceToGeneratedMaps[pathToSourceKey] = map;
            return map;
        }
        // nothing found
        return null;
    };
    /**
     * Tries to find a SourceMap for the given path to a generated file.
     * This is simple if the generated file has the 'sourceMappingURL' at the end.
     * If not, we are using some heuristics...
     */
    SourceMaps.prototype._findGeneratedToSourceMapping = function (pathToGenerated, content) {
        if (!pathToGenerated) {
            return null;
        }
        var pathToGeneratedKey = pathNormalize(pathToGenerated);
        if (pathToGeneratedKey in this._generatedToSourceMaps) {
            return this._generatedToSourceMaps[pathToGeneratedKey];
        }
        // try to find a source map URL in the generated file
        var map_path = null;
        var uri = this._findSourceMapUrlInFile(pathToGenerated, content);
        if (uri) {
            // if uri is data url source map is inlined in generated file
            if (uri.indexOf('data:application/json') >= 0) {
                var pos = uri.lastIndexOf(',');
                if (pos > 0) {
                    var data = uri.substr(pos + 1);
                    try {
                        var buffer = new Buffer(data, 'base64');
                        var json = buffer.toString();
                        if (json) {
                            this._log("_findGeneratedToSourceMapping: successfully read inlined source map in '" + pathToGenerated + "'");
                            return this._registerSourceMap(new SourceMap(pathToGenerated, pathToGenerated, json));
                        }
                    }
                    catch (e) {
                        this._log("_findGeneratedToSourceMapping: exception while processing data url '" + e + "'");
                    }
                }
            }
            else {
                map_path = uri;
            }
        }
        // if path is relative make it absolute
        if (map_path && !Path.isAbsolute(map_path)) {
            map_path = PathUtils.makePathAbsolute(pathToGenerated, map_path);
        }
        if (!map_path || !FS.existsSync(map_path)) {
            // try to find map file next to the generated source
            map_path = pathToGenerated + '.map';
        }
        if (map_path && FS.existsSync(map_path)) {
            var map = this._loadSourceMap(map_path, pathToGenerated);
            if (map) {
                return map;
            }
        }
        return null;
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

//# sourceMappingURL=data:application/json;base64,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QUM7SUFDWCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0ksd0NBQW9CLEdBQTNCLFVBQTRCLE9BQWUsRUFBRSxJQUFZLEVBQUUsTUFBYyxFQUFFLElBQVU7UUFFcEYsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNoQixNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2IsQ0FBQztRQUVELGdHQUFnRztRQUNoRyxJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3hDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDWixJQUFNLE1BQU0sR0FBRztnQkFDZCxNQUFNLEVBQUUsTUFBTTtnQkFDZCxJQUFJLEVBQUUsSUFBSTtnQkFDVixNQUFNLEVBQUUsTUFBTTtnQkFDZCxJQUFJLEVBQUUsSUFBSSxJQUFJLElBQUksQ0FBQyxpQkFBaUI7YUFDcEMsQ0FBQztZQUVGLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQy9DLENBQUM7UUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2IsQ0FBQztJQUNGLGdCQUFDO0FBQUQsQ0F0TUEsQUFzTUMsSUFBQSIsImZpbGUiOiJub2RlL3NvdXJjZU1hcHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS4gU2VlIExpY2Vuc2UudHh0IGluIHRoZSBwcm9qZWN0IHJvb3QgZm9yIGxpY2Vuc2UgaW5mb3JtYXRpb24uXG4gKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuaW1wb3J0ICogYXMgUGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIEZTIGZyb20gJ2ZzJztcbmltcG9ydCB7U291cmNlTWFwQ29uc3VtZXJ9IGZyb20gJ3NvdXJjZS1tYXAnO1xuaW1wb3J0ICogYXMgUGF0aFV0aWxzIGZyb20gJy4vcGF0aFV0aWxpdGllcyc7XG5pbXBvcnQge05vZGVEZWJ1Z1Nlc3Npb259IGZyb20gJy4vbm9kZURlYnVnJztcblxuY29uc3QgdXRpbCA9IHJlcXVpcmUoJy4uLy4uL25vZGVfbW9kdWxlcy9zb3VyY2UtbWFwL2xpYi91dGlsLmpzJyk7XG5cbmNvbnN0IHBhdGhOb3JtYWxpemUgPSAocHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ3dpbjMyJyB8fCBwcm9jZXNzLnBsYXRmb3JtID09PSAnZGFyd2luJykgPyBwYXRoID0+IHBhdGgudG9Mb3dlckNhc2UoKSA6IHBhdGggPT4gcGF0aDtcblxuZXhwb3J0IGludGVyZmFjZSBNYXBwaW5nUmVzdWx0IHtcblx0cGF0aDogc3RyaW5nO1x0XHQvLyBhYnNvbHV0ZSBwYXRoXG5cdGNvbnRlbnQ/OiBzdHJpbmc7XHQvLyBvcHRpb25hbCBjb250ZW50IG9mIHNvdXJjZSAoc291cmNlIGlubGluZWQgaW4gc291cmNlIG1hcClcblx0bGluZTogbnVtYmVyO1xuXHRjb2x1bW46IG51bWJlcjtcbn1cblxuZXhwb3J0IGVudW0gQmlhcyB7XG5cdEdSRUFURVNUX0xPV0VSX0JPVU5EID0gMSxcblx0TEVBU1RfVVBQRVJfQk9VTkQgPSAyXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVNvdXJjZU1hcHMge1xuXHQvKlxuXHQgKiBNYXAgc291cmNlIGxhbmd1YWdlIHBhdGggdG8gZ2VuZXJhdGVkIHBhdGguXG5cdCAqIFJldHVybnMgbnVsbCBpZiBub3QgZm91bmQuXG5cdCAqL1xuXHRNYXBQYXRoRnJvbVNvdXJjZShwYXRoOiBzdHJpbmcpOiBzdHJpbmc7XG5cblx0Lypcblx0ICogTWFwIGdlbmVyYXRlZCBwYXRoIHRvIHNvdXJjZSBwYXRoLlxuXHQgKiBSZXR1cm5zIG51bGwgaWYgbm90IGZvdW5kLlxuXHQgKi9cblx0TWFwUGF0aFRvU291cmNlKHBhdGg6IHN0cmluZywgY29udGVudDogc3RyaW5nKTogc3RyaW5nW107XG5cblx0Lypcblx0ICogTWFwIGxvY2F0aW9uIGluIHNvdXJjZSBsYW5ndWFnZSB0byBsb2NhdGlvbiBpbiBnZW5lcmF0ZWQgY29kZS5cblx0ICogbGluZSBhbmQgY29sdW1uIGFyZSAwIGJhc2VkLlxuXHQgKi9cblx0TWFwRnJvbVNvdXJjZShwYXRoOiBzdHJpbmcsIGxpbmU6IG51bWJlciwgY29sdW1uOiBudW1iZXIsIGJpYXM/OiBCaWFzKTogTWFwcGluZ1Jlc3VsdDtcblxuXHQvKlxuXHQgKiBNYXAgbG9jYXRpb24gaW4gZ2VuZXJhdGVkIGNvZGUgdG8gbG9jYXRpb24gaW4gc291cmNlIGxhbmd1YWdlLlxuXHQgKiBsaW5lIGFuZCBjb2x1bW4gYXJlIDAgYmFzZWQuXG5cdCAqL1xuXHRNYXBUb1NvdXJjZShwYXRoOiBzdHJpbmcsIGNvbnRlbnQ6IHN0cmluZywgbGluZTogbnVtYmVyLCBjb2x1bW46IG51bWJlciwgYmlhcz86IEJpYXMpOiBNYXBwaW5nUmVzdWx0O1xuXG5cdC8qXG5cdCAqIFJldHVybnMgdHJ1ZSBpZiBjb250ZW50IGNvbnRhaW5zIGEgcmVmZXJlbmNlIHRvIGEgc291cmNlIG1hcCAob3IgYSBkYXRhIHVybCB3aXRoIGFuIGlubGluZWQgc291cmNlIG1hcCkuXG5cdCAqL1xuXHRIYXNTb3VyY2VNYXAoY29udGVudDogc3RyaW5nKSA6IGJvb2xlYW47XG59XG5cblxuZXhwb3J0IGNsYXNzIFNvdXJjZU1hcHMgaW1wbGVtZW50cyBJU291cmNlTWFwcyB7XG5cblx0cHJpdmF0ZSBzdGF0aWMgU09VUkNFX01BUFBJTkdfTUFUQ0hFUiA9IG5ldyBSZWdFeHAoJy8vWyNAXSA/c291cmNlTWFwcGluZ1VSTD0oLispJCcpO1xuXG5cdHByaXZhdGUgX3Nlc3Npb246IE5vZGVEZWJ1Z1Nlc3Npb247XG5cdHByaXZhdGUgX2FsbFNvdXJjZU1hcHM6IHsgW2lkOiBzdHJpbmddIDogU291cmNlTWFwOyB9ID0ge307XHRcdFx0Ly8gbWFwIGZpbGUgcGF0aCAtPiBTb3VyY2VNYXBcblx0cHJpdmF0ZSBfZ2VuZXJhdGVkVG9Tb3VyY2VNYXBzOiAgeyBbaWQ6IHN0cmluZ10gOiBTb3VyY2VNYXA7IH0gPSB7fTtcdC8vIGdlbmVyYXRlZCBmaWxlIC0+IFNvdXJjZU1hcFxuXHRwcml2YXRlIF9zb3VyY2VUb0dlbmVyYXRlZE1hcHM6ICB7IFtpZDogc3RyaW5nXSA6IFNvdXJjZU1hcDsgfSA9IHt9O1x0Ly8gc291cmNlIGZpbGUgLT4gU291cmNlTWFwXG5cdHByaXZhdGUgX2dlbmVyYXRlZENvZGVEaXJlY3Rvcnk6IHN0cmluZztcblxuXG5cdHB1YmxpYyBjb25zdHJ1Y3RvcihzZXNzaW9uOiBOb2RlRGVidWdTZXNzaW9uLCBnZW5lcmF0ZWRDb2RlRGlyZWN0b3J5OiBzdHJpbmcpIHtcblx0XHR0aGlzLl9zZXNzaW9uID0gc2Vzc2lvbjtcblx0XHR0aGlzLl9nZW5lcmF0ZWRDb2RlRGlyZWN0b3J5ID0gZ2VuZXJhdGVkQ29kZURpcmVjdG9yeTtcblx0fVxuXG5cdHB1YmxpYyBNYXBQYXRoRnJvbVNvdXJjZShwYXRoVG9Tb3VyY2U6IHN0cmluZyk6IHN0cmluZyB7XG5cdFx0Y29uc3QgbWFwID0gdGhpcy5fZmluZFNvdXJjZVRvR2VuZXJhdGVkTWFwcGluZyhwYXRoVG9Tb3VyY2UpO1xuXHRcdGlmIChtYXApIHtcblx0XHRcdHJldHVybiBtYXAuZ2VuZXJhdGVkUGF0aCgpO1xuXHRcdH1cblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXG5cdHB1YmxpYyBNYXBQYXRoVG9Tb3VyY2UocGF0aFRvR2VuZXJhdGVkOiBzdHJpbmcsIGNvbnRlbnQ6IHN0cmluZykgOiBzdHJpbmdbXSB7XG5cdFx0Y29uc3QgbWFwID0gdGhpcy5fZmluZEdlbmVyYXRlZFRvU291cmNlTWFwcGluZyhwYXRoVG9HZW5lcmF0ZWQsIGNvbnRlbnQpO1xuXHRcdGlmIChtYXApIHtcblx0XHRcdHJldHVybiBtYXAuc291cmNlcygpO1xuXHRcdH1cblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXG5cdHB1YmxpYyBNYXBGcm9tU291cmNlKHBhdGhUb1NvdXJjZTogc3RyaW5nLCBsaW5lOiBudW1iZXIsIGNvbHVtbjogbnVtYmVyLCBiaWFzPzogQmlhcyk6IE1hcHBpbmdSZXN1bHQge1xuXHRcdGNvbnN0IG1hcCA9IHRoaXMuX2ZpbmRTb3VyY2VUb0dlbmVyYXRlZE1hcHBpbmcocGF0aFRvU291cmNlKTtcblx0XHRpZiAobWFwKSB7XG5cdFx0XHRsaW5lICs9IDE7XHQvLyBzb3VyY2UgbWFwIGltcGwgaXMgMSBiYXNlZFxuXHRcdFx0Y29uc3QgbXIgPSBtYXAuZ2VuZXJhdGVkUG9zaXRpb25Gb3IocGF0aFRvU291cmNlLCBsaW5lLCBjb2x1bW4sIGJpYXMpO1xuXHRcdFx0aWYgKG1yICYmIHR5cGVvZiBtci5saW5lID09PSAnbnVtYmVyJykge1xuXHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdHBhdGg6IG1hcC5nZW5lcmF0ZWRQYXRoKCksXG5cdFx0XHRcdFx0bGluZTogbXIubGluZS0xLFxuXHRcdFx0XHRcdGNvbHVtbjogbXIuY29sdW1uXG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cblx0cHVibGljIE1hcFRvU291cmNlKHBhdGhUb0dlbmVyYXRlZDogc3RyaW5nLCBjb250ZW50OiBzdHJpbmcsIGxpbmU6IG51bWJlciwgY29sdW1uOiBudW1iZXIsIGJpYXM/OiBCaWFzKTogTWFwcGluZ1Jlc3VsdCB7XG5cdFx0Y29uc3QgbWFwID0gdGhpcy5fZmluZEdlbmVyYXRlZFRvU291cmNlTWFwcGluZyhwYXRoVG9HZW5lcmF0ZWQsIGNvbnRlbnQpO1xuXHRcdGlmIChtYXApIHtcblx0XHRcdGxpbmUgKz0gMTtcdC8vIHNvdXJjZSBtYXAgaW1wbCBpcyAxIGJhc2VkXG5cdFx0XHRjb25zdCBtciA9IG1hcC5vcmlnaW5hbFBvc2l0aW9uRm9yKGxpbmUsIGNvbHVtbiwgYmlhcyk7XG5cdFx0XHRpZiAobXIgJiYgbXIuc291cmNlKSB7XG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0cGF0aDogbXIuc291cmNlLFxuXHRcdFx0XHRcdGNvbnRlbnQ6ICg8YW55Pm1yKS5jb250ZW50LFxuXHRcdFx0XHRcdGxpbmU6IG1yLmxpbmUtMSxcblx0XHRcdFx0XHRjb2x1bW46IG1yLmNvbHVtblxuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXG5cdHB1YmxpYyBIYXNTb3VyY2VNYXAoY29udGVudDogc3RyaW5nKSA6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0aGlzLl9maW5kU291cmNlTWFwVXJsSW5GaWxlKG51bGwsIGNvbnRlbnQpICE9PSBudWxsO1xuXHR9XG5cblx0Ly8tLS0tIHByaXZhdGUgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuXHQvKipcblx0ICogVHJpZXMgdG8gZmluZCBhIFNvdXJjZU1hcCBmb3IgdGhlIGdpdmVuIHNvdXJjZS5cblx0ICogVGhpcyBpcyBkaWZmaWN1bHQgYmVjYXVzZSB0aGUgc291cmNlIGRvZXMgbm90IGNvbnRhaW4gYW55IGluZm9ybWF0aW9uIGFib3V0IHdoZXJlXG5cdCAqIHRoZSBnZW5lcmF0ZWQgY29kZSBvciB0aGUgc291cmNlIG1hcCBpcyBsb2NhdGVkLlxuXHQgKiBPdXIgc3RyYXRlZ3kgaXMgYXMgZm9sbG93czpcblx0ICogLSBzZWFyY2ggaW4gYWxsIGtub3duIHNvdXJjZSBtYXBzIHdoZXRoZXIgaWYgcmVmZXJzIHRvIHRoaXMgc291cmNlIGluIHRoZSBzb3VyY2VzIGFycmF5LlxuXHQgKiAtIC4uLlxuXHQgKi9cblx0cHJpdmF0ZSBfZmluZFNvdXJjZVRvR2VuZXJhdGVkTWFwcGluZyhwYXRoVG9Tb3VyY2U6IHN0cmluZyk6IFNvdXJjZU1hcCB7XG5cblx0XHRpZiAoIXBhdGhUb1NvdXJjZSkge1xuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fVxuXHRcdGNvbnN0IHBhdGhUb1NvdXJjZUtleSA9IHBhdGhOb3JtYWxpemUocGF0aFRvU291cmNlKTtcblxuXHRcdC8vIHRyeSB0byBmaW5kIGluIGV4aXN0aW5nXG5cdFx0aWYgKHBhdGhUb1NvdXJjZUtleSBpbiB0aGlzLl9zb3VyY2VUb0dlbmVyYXRlZE1hcHMpIHtcblx0XHRcdHJldHVybiB0aGlzLl9zb3VyY2VUb0dlbmVyYXRlZE1hcHNbcGF0aFRvU291cmNlS2V5XTtcblx0XHR9XG5cblx0XHQvLyBhIHJldmVyc2UgbG9va3VwOiBpbiBhbGwgc291cmNlIG1hcHMgdHJ5IHRvIGZpbmQgcGF0aFRvU291cmNlIGluIHRoZSBzb3VyY2VzIGFycmF5XG5cdFx0Zm9yIChsZXQga2V5IGluIHRoaXMuX2dlbmVyYXRlZFRvU291cmNlTWFwcykge1xuXHRcdFx0Y29uc3QgbSA9IHRoaXMuX2dlbmVyYXRlZFRvU291cmNlTWFwc1trZXldO1xuXHRcdFx0aWYgKG0uZG9lc09yaWdpbmF0ZUZyb20ocGF0aFRvU291cmNlKSkge1xuXHRcdFx0XHR0aGlzLl9zb3VyY2VUb0dlbmVyYXRlZE1hcHNbcGF0aFRvU291cmNlS2V5XSA9IG07XG5cdFx0XHRcdHJldHVybiBtO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIHNlYXJjaCBmb3IgYWxsIG1hcCBmaWxlcyBpbiBnZW5lcmF0ZWRDb2RlRGlyZWN0b3J5XG5cdFx0aWYgKHRoaXMuX2dlbmVyYXRlZENvZGVEaXJlY3RvcnkpIHtcblx0XHRcdHRyeSB7XG5cdFx0XHRcdGxldCBtYXBzID0gRlMucmVhZGRpclN5bmModGhpcy5fZ2VuZXJhdGVkQ29kZURpcmVjdG9yeSkuZmlsdGVyKGUgPT4gUGF0aC5leHRuYW1lKGUudG9Mb3dlckNhc2UoKSkgPT09ICcubWFwJyk7XG5cdFx0XHRcdGZvciAobGV0IG1hcF9uYW1lIG9mIG1hcHMpIHtcblx0XHRcdFx0XHRjb25zdCBtYXBfcGF0aCA9IFBhdGguam9pbih0aGlzLl9nZW5lcmF0ZWRDb2RlRGlyZWN0b3J5LCBtYXBfbmFtZSk7XG5cdFx0XHRcdFx0Y29uc3QgbSA9IHRoaXMuX2xvYWRTb3VyY2VNYXAobWFwX3BhdGgpO1xuXHRcdFx0XHRcdGlmIChtICYmIG0uZG9lc09yaWdpbmF0ZUZyb20ocGF0aFRvU291cmNlKSkge1xuXHRcdFx0XHRcdFx0dGhpcy5fbG9nKGBfZmluZFNvdXJjZVRvR2VuZXJhdGVkTWFwcGluZzogZm91bmQgc291cmNlIG1hcCBmb3Igc291cmNlICR7cGF0aFRvU291cmNlfSBpbiBvdXREaXJgKTtcblx0XHRcdFx0XHRcdHRoaXMuX3NvdXJjZVRvR2VuZXJhdGVkTWFwc1twYXRoVG9Tb3VyY2VLZXldID0gbTtcblx0XHRcdFx0XHRcdHJldHVybiBtO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0Y2F0Y2ggKGUpIHtcblx0XHRcdFx0Ly8gaWdub3JlXG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gbm8gbWFwIGZvdW5kXG5cblx0XHRsZXQgcGF0aFRvR2VuZXJhdGVkID0gcGF0aFRvU291cmNlO1xuXG5cdFx0Y29uc3QgZXh0ID0gUGF0aC5leHRuYW1lKHBhdGhUb1NvdXJjZSk7XG5cdFx0aWYgKGV4dCAhPT0gJy5qcycpIHtcblx0XHRcdC8vIHVzZSBoZXVyaXN0aWM6IGNoYW5nZSBleHRlbnNpb24gdG8gXCIuanNcIiBhbmQgZmluZCBhIG1hcCBmb3IgaXRcblx0XHRcdGNvbnN0IHBvcyA9IHBhdGhUb1NvdXJjZS5sYXN0SW5kZXhPZignLicpO1xuXHRcdFx0aWYgKHBvcyA+PSAwKSB7XG5cdFx0XHRcdHBhdGhUb0dlbmVyYXRlZCA9IHBhdGhUb1NvdXJjZS5zdWJzdHIoMCwgcG9zKSArICcuanMnO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGxldCBtYXAgPSBudWxsO1xuXG5cdFx0Ly8gZmlyc3QgbG9vayBpbnRvIHRoZSBnZW5lcmF0ZWQgY29kZSBkaXJlY3Rvcnlcblx0XHRpZiAodGhpcy5fZ2VuZXJhdGVkQ29kZURpcmVjdG9yeSkge1xuXHRcdFx0bGV0IHJlc3QgPSBQYXRoVXRpbHMubWFrZVJlbGF0aXZlKHRoaXMuX2dlbmVyYXRlZENvZGVEaXJlY3RvcnksIHBhdGhUb0dlbmVyYXRlZCk7XG5cdFx0XHR3aGlsZSAocmVzdCkge1xuXHRcdFx0XHRjb25zdCBwYXRoID0gUGF0aC5qb2luKHRoaXMuX2dlbmVyYXRlZENvZGVEaXJlY3RvcnksIHJlc3QpO1xuXHRcdFx0XHRtYXAgPSB0aGlzLl9maW5kR2VuZXJhdGVkVG9Tb3VyY2VNYXBwaW5nKHBhdGgpO1xuXHRcdFx0XHRpZiAobWFwKSB7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmVzdCA9IFBhdGhVdGlscy5yZW1vdmVGaXJzdFNlZ21lbnQocmVzdCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gVlNDb2RlIGV4dGVuc2lvbiBob3N0IHN1cHBvcnQ6XG5cdFx0Ly8gd2Uga25vdyB0aGF0IHRoZSBwbHVnaW4gaGFzIGFuIFwib3V0XCIgZGlyZWN0b3J5IG5leHQgdG8gdGhlIFwic3JjXCIgZGlyZWN0b3J5XG5cdFx0aWYgKG1hcCA9PT0gbnVsbCkge1xuXHRcdFx0bGV0IHNyY1NlZ21lbnQgPSBQYXRoLnNlcCArICdzcmMnICsgUGF0aC5zZXA7XG5cdFx0XHRpZiAocGF0aFRvR2VuZXJhdGVkLmluZGV4T2Yoc3JjU2VnbWVudCkgPj0gMCkge1xuXHRcdFx0XHRjb25zdCBvdXRTZWdtZW50ID0gUGF0aC5zZXAgKyAnb3V0JyArIFBhdGguc2VwO1xuXHRcdFx0XHRtYXAgPSB0aGlzLl9maW5kR2VuZXJhdGVkVG9Tb3VyY2VNYXBwaW5nKHBhdGhUb0dlbmVyYXRlZC5yZXBsYWNlKHNyY1NlZ21lbnQsIG91dFNlZ21lbnQpKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBpZiBub3QgZm91bmQgbG9vayBpbiB0aGUgc2FtZSBkaXJlY3RvcnkgYXMgdGhlIHNvdXJjZVxuXHRcdGlmIChtYXAgPT09IG51bGwgJiYgcGF0aE5vcm1hbGl6ZShwYXRoVG9HZW5lcmF0ZWQpICE9PSBwYXRoVG9Tb3VyY2VLZXkpIHtcblx0XHRcdG1hcCA9IHRoaXMuX2ZpbmRHZW5lcmF0ZWRUb1NvdXJjZU1hcHBpbmcocGF0aFRvR2VuZXJhdGVkKTtcblx0XHR9XG5cblx0XHRpZiAobWFwKSB7XG5cdFx0XHR0aGlzLl9zb3VyY2VUb0dlbmVyYXRlZE1hcHNbcGF0aFRvU291cmNlS2V5XSA9IG1hcDtcblx0XHRcdHJldHVybiBtYXA7XG5cdFx0fVxuXG5cdFx0Ly8gbm90aGluZyBmb3VuZFxuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRyaWVzIHRvIGZpbmQgYSBTb3VyY2VNYXAgZm9yIHRoZSBnaXZlbiBwYXRoIHRvIGEgZ2VuZXJhdGVkIGZpbGUuXG5cdCAqIFRoaXMgaXMgc2ltcGxlIGlmIHRoZSBnZW5lcmF0ZWQgZmlsZSBoYXMgdGhlICdzb3VyY2VNYXBwaW5nVVJMJyBhdCB0aGUgZW5kLlxuXHQgKiBJZiBub3QsIHdlIGFyZSB1c2luZyBzb21lIGhldXJpc3RpY3MuLi5cblx0ICovXG5cdHByaXZhdGUgX2ZpbmRHZW5lcmF0ZWRUb1NvdXJjZU1hcHBpbmcocGF0aFRvR2VuZXJhdGVkOiBzdHJpbmcsIGNvbnRlbnQ/OiBzdHJpbmcpOiBTb3VyY2VNYXAge1xuXG5cdFx0aWYgKCFwYXRoVG9HZW5lcmF0ZWQpIHtcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblx0XHRjb25zdCBwYXRoVG9HZW5lcmF0ZWRLZXkgPSBwYXRoTm9ybWFsaXplKHBhdGhUb0dlbmVyYXRlZCk7XG5cblx0XHRpZiAocGF0aFRvR2VuZXJhdGVkS2V5IGluIHRoaXMuX2dlbmVyYXRlZFRvU291cmNlTWFwcykge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2dlbmVyYXRlZFRvU291cmNlTWFwc1twYXRoVG9HZW5lcmF0ZWRLZXldO1xuXHRcdH1cblxuXHRcdC8vIHRyeSB0byBmaW5kIGEgc291cmNlIG1hcCBVUkwgaW4gdGhlIGdlbmVyYXRlZCBmaWxlXG5cdFx0bGV0IG1hcF9wYXRoOiBzdHJpbmcgPSBudWxsO1xuXHRcdGNvbnN0IHVyaSA9IHRoaXMuX2ZpbmRTb3VyY2VNYXBVcmxJbkZpbGUocGF0aFRvR2VuZXJhdGVkLCBjb250ZW50KTtcblx0XHRpZiAodXJpKSB7XG5cdFx0XHQvLyBpZiB1cmkgaXMgZGF0YSB1cmwgc291cmNlIG1hcCBpcyBpbmxpbmVkIGluIGdlbmVyYXRlZCBmaWxlXG5cdFx0XHRpZiAodXJpLmluZGV4T2YoJ2RhdGE6YXBwbGljYXRpb24vanNvbicpID49IDApIHtcblx0XHRcdFx0Y29uc3QgcG9zID0gdXJpLmxhc3RJbmRleE9mKCcsJyk7XG5cdFx0XHRcdGlmIChwb3MgPiAwKSB7XG5cdFx0XHRcdFx0Y29uc3QgZGF0YSA9IHVyaS5zdWJzdHIocG9zKzEpO1xuXHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHRjb25zdCBidWZmZXIgPSBuZXcgQnVmZmVyKGRhdGEsICdiYXNlNjQnKTtcblx0XHRcdFx0XHRcdGNvbnN0IGpzb24gPSBidWZmZXIudG9TdHJpbmcoKTtcblx0XHRcdFx0XHRcdGlmIChqc29uKSB7XG5cdFx0XHRcdFx0XHRcdHRoaXMuX2xvZyhgX2ZpbmRHZW5lcmF0ZWRUb1NvdXJjZU1hcHBpbmc6IHN1Y2Nlc3NmdWxseSByZWFkIGlubGluZWQgc291cmNlIG1hcCBpbiAnJHtwYXRoVG9HZW5lcmF0ZWR9J2ApO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gdGhpcy5fcmVnaXN0ZXJTb3VyY2VNYXAobmV3IFNvdXJjZU1hcChwYXRoVG9HZW5lcmF0ZWQsIHBhdGhUb0dlbmVyYXRlZCwganNvbikpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRjYXRjaCAoZSkge1xuXHRcdFx0XHRcdFx0dGhpcy5fbG9nKGBfZmluZEdlbmVyYXRlZFRvU291cmNlTWFwcGluZzogZXhjZXB0aW9uIHdoaWxlIHByb2Nlc3NpbmcgZGF0YSB1cmwgJyR7ZX0nYCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRtYXBfcGF0aCA9IHVyaTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBpZiBwYXRoIGlzIHJlbGF0aXZlIG1ha2UgaXQgYWJzb2x1dGVcblx0XHRpZiAobWFwX3BhdGggJiYgIVBhdGguaXNBYnNvbHV0ZShtYXBfcGF0aCkpIHtcblx0XHRcdG1hcF9wYXRoID0gUGF0aFV0aWxzLm1ha2VQYXRoQWJzb2x1dGUocGF0aFRvR2VuZXJhdGVkLCBtYXBfcGF0aCk7XG5cdFx0fVxuXG5cdFx0aWYgKCFtYXBfcGF0aCB8fCAhRlMuZXhpc3RzU3luYyhtYXBfcGF0aCkpIHtcblx0XHRcdC8vIHRyeSB0byBmaW5kIG1hcCBmaWxlIG5leHQgdG8gdGhlIGdlbmVyYXRlZCBzb3VyY2Vcblx0XHRcdG1hcF9wYXRoID0gcGF0aFRvR2VuZXJhdGVkICsgJy5tYXAnO1xuXHRcdH1cblxuXHRcdGlmIChtYXBfcGF0aCAmJiBGUy5leGlzdHNTeW5jKG1hcF9wYXRoKSkge1xuXHRcdFx0Y29uc3QgbWFwID0gdGhpcy5fbG9hZFNvdXJjZU1hcChtYXBfcGF0aCwgcGF0aFRvR2VuZXJhdGVkKTtcblx0XHRcdGlmIChtYXApIHtcblx0XHRcdFx0cmV0dXJuIG1hcDtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXG5cdC8qKlxuXHQgKiBUcnkgdG8gZmluZCB0aGUgJ3NvdXJjZU1hcHBpbmdVUkwnIGluIHRoZSBmaWxlIHdpdGggdGhlIGdpdmVuIHBhdGguXG5cdCAqIFJldHVybnMgbnVsbCBpZiBubyBzb3VyY2UgbWFwIHVybCBpcyBmb3VuZCBvciBpZiBhbiBlcnJvciBvY2N1cmVkLlxuXHQgKi9cblx0cHJpdmF0ZSBfZmluZFNvdXJjZU1hcFVybEluRmlsZShwYXRoVG9HZW5lcmF0ZWQ6IHN0cmluZywgY29udGVudDogc3RyaW5nKTogc3RyaW5nIHtcblxuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCBjb250ZW50cyA9IGNvbnRlbnQgfHwgRlMucmVhZEZpbGVTeW5jKHBhdGhUb0dlbmVyYXRlZCkudG9TdHJpbmcoKTtcblx0XHRcdGNvbnN0IGxpbmVzID0gY29udGVudHMuc3BsaXQoJ1xcbicpO1xuXHRcdFx0Zm9yIChsZXQgbGluZSBvZiBsaW5lcykge1xuXHRcdFx0XHRjb25zdCBtYXRjaGVzID0gU291cmNlTWFwcy5TT1VSQ0VfTUFQUElOR19NQVRDSEVSLmV4ZWMobGluZSk7XG5cdFx0XHRcdGlmIChtYXRjaGVzICYmIG1hdGNoZXMubGVuZ3RoID09PSAyKSB7XG5cdFx0XHRcdFx0Y29uc3QgdXJpID0gbWF0Y2hlc1sxXS50cmltKCk7XG5cdFx0XHRcdFx0aWYgKHBhdGhUb0dlbmVyYXRlZCkge1xuXHRcdFx0XHRcdFx0dGhpcy5fbG9nKGBfZmluZFNvdXJjZU1hcFVybEluRmlsZTogc291cmNlIG1hcCB1cmwgZm91bmQgYXQgZW5kIG9mIGdlbmVyYXRlZCBmaWxlICcke3BhdGhUb0dlbmVyYXRlZH0nYCk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHRoaXMuX2xvZyhgX2ZpbmRTb3VyY2VNYXBVcmxJbkZpbGU6IHNvdXJjZSBtYXAgdXJsIGZvdW5kIGF0IGVuZCBvZiBnZW5lcmF0ZWQgY29udGVudGApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR1cm4gdXJpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSBjYXRjaCAoZSkge1xuXHRcdFx0Ly8gaWdub3JlIGV4Y2VwdGlvblxuXHRcdH1cblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXG5cdC8qKlxuXHQgKiBMb2FkcyBzb3VyY2UgbWFwIGZyb20gZmlsZSBzeXN0ZW0uXG5cdCAqIElmIG5vIGdlbmVyYXRlZFBhdGggaXMgZ2l2ZW4sIHRoZSAnZmlsZScgYXR0cmlidXRlIG9mIHRoZSBzb3VyY2UgbWFwIGlzIHVzZWQuXG5cdCAqL1xuXHRwcml2YXRlIF9sb2FkU291cmNlTWFwKG1hcF9wYXRoOiBzdHJpbmcsIGdlbmVyYXRlZFBhdGg/OiBzdHJpbmcpOiBTb3VyY2VNYXAge1xuXG5cdFx0Y29uc3QgbWFwUGF0aEtleSA9IHBhdGhOb3JtYWxpemUobWFwX3BhdGgpO1xuXG5cdFx0aWYgKG1hcFBhdGhLZXkgaW4gdGhpcy5fYWxsU291cmNlTWFwcykge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2FsbFNvdXJjZU1hcHNbbWFwUGF0aEtleV07XG5cdFx0fVxuXG5cdFx0dHJ5IHtcblx0XHRcdGNvbnN0IG1wID0gUGF0aC5qb2luKG1hcF9wYXRoKTtcblx0XHRcdGNvbnN0IGNvbnRlbnRzID0gRlMucmVhZEZpbGVTeW5jKG1wKS50b1N0cmluZygpO1xuXG5cdFx0XHRjb25zdCBtYXAgPSBuZXcgU291cmNlTWFwKG1wLCBnZW5lcmF0ZWRQYXRoLCBjb250ZW50cyk7XG5cdFx0XHR0aGlzLl9hbGxTb3VyY2VNYXBzW21hcFBhdGhLZXldID0gbWFwO1xuXG5cdFx0XHR0aGlzLl9yZWdpc3RlclNvdXJjZU1hcChtYXApO1xuXG5cdFx0XHR0aGlzLl9sb2coYF9sb2FkU291cmNlTWFwOiBzdWNjZXNzZnVsbHkgbG9hZGVkIHNvdXJjZSBtYXAgJyR7bWFwX3BhdGh9J2ApO1xuXG5cdFx0XHRyZXR1cm4gbWFwO1xuXHRcdH1cblx0XHRjYXRjaCAoZSkge1xuXHRcdFx0dGhpcy5fbG9nKGBfbG9hZFNvdXJjZU1hcDogbG9hZGluZyBzb3VyY2UgbWFwICcke21hcF9wYXRofScgZmFpbGVkIHdpdGggZXhjZXB0aW9uOiAke2V9YCk7XG5cdFx0fVxuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cblx0cHJpdmF0ZSBfcmVnaXN0ZXJTb3VyY2VNYXAobWFwOiBTb3VyY2VNYXApOiBTb3VyY2VNYXAge1xuXHRcdGNvbnN0IGdwID0gbWFwLmdlbmVyYXRlZFBhdGgoKTtcblx0XHRpZiAoZ3ApIHtcblx0XHRcdHRoaXMuX2dlbmVyYXRlZFRvU291cmNlTWFwc1twYXRoTm9ybWFsaXplKGdwKV0gPSBtYXA7XG5cdFx0fVxuXHRcdHJldHVybiBtYXA7XG5cdH1cblxuXHRwcml2YXRlIF9sb2cobWVzc2FnZTogc3RyaW5nKTogdm9pZCB7XG5cdFx0dGhpcy5fc2Vzc2lvbi5sb2coJ3NtJywgbWVzc2FnZSk7XG5cdH1cbn1cblxuY2xhc3MgU291cmNlTWFwIHtcblxuXHRwcml2YXRlIF9zb3VyY2VtYXBMb2NhdGlvbjogc3RyaW5nO1x0Ly8gdGhlIGRpcmVjdG9yeSB3aGVyZSB0aGlzIHNvdXJjZW1hcCBsaXZlc1xuXHRwcml2YXRlIF9nZW5lcmF0ZWRGaWxlOiBzdHJpbmc7XHRcdC8vIHRoZSBnZW5lcmF0ZWQgZmlsZSB0byB3aGljaCB0aGlzIHNvdXJjZSBtYXAgYmVsb25ncyB0b1xuXHRwcml2YXRlIF9zb3VyY2VzOiBzdHJpbmdbXTtcdFx0XHQvLyB0aGUgc291cmNlcyBvZiB0aGUgZ2VuZXJhdGVkIGZpbGUgKHJlbGF0aXZlIHRvIHNvdXJjZVJvb3QpXG5cdHByaXZhdGUgX3NvdXJjZVJvb3Q6IHN0cmluZztcdFx0XHQvLyB0aGUgY29tbW9uIHByZWZpeCBmb3IgdGhlIHNvdXJjZSAoY2FuIGJlIGEgVVJMKVxuXHRwcml2YXRlIF9zbWM6IFNvdXJjZU1hcENvbnN1bWVyO1x0XHQvLyB0aGUgc291cmNlIG1hcFxuXG5cblx0cHVibGljIGNvbnN0cnVjdG9yKG1hcFBhdGg6IHN0cmluZywgZ2VuZXJhdGVkUGF0aDogc3RyaW5nLCBqc29uOiBzdHJpbmcpIHtcblxuXHRcdHRoaXMuX3NvdXJjZW1hcExvY2F0aW9uID0gdGhpcy5maXhQYXRoKFBhdGguZGlybmFtZShtYXBQYXRoKSk7XG5cblx0XHRjb25zdCBzbSA9IEpTT04ucGFyc2UoanNvbik7XG5cblx0XHRpZiAoIWdlbmVyYXRlZFBhdGgpIHtcblx0XHRcdGxldCBmaWxlID0gc20uZmlsZTtcblx0XHRcdGlmICghUGF0aFV0aWxzLmlzQWJzb2x1dGVQYXRoKGZpbGUpKSB7XG5cdFx0XHRcdGdlbmVyYXRlZFBhdGggPSBQYXRoVXRpbHMubWFrZVBhdGhBYnNvbHV0ZShtYXBQYXRoLCBmaWxlKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHR0aGlzLl9nZW5lcmF0ZWRGaWxlID0gZ2VuZXJhdGVkUGF0aDtcblxuXHRcdC8vIGZpeCBhbGwgcGF0aHMgZm9yIHVzZSB3aXRoIHRoZSBzb3VyY2UtbWFwIG5wbSBtb2R1bGUuXG5cdFx0c20uc291cmNlUm9vdCA9IHRoaXMuZml4UGF0aChzbS5zb3VyY2VSb290LCAnJyk7XG5cblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHNtLnNvdXJjZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHNtLnNvdXJjZXNbaV0gPSB0aGlzLmZpeFBhdGgoc20uc291cmNlc1tpXSk7XG5cdFx0fVxuXG5cdFx0dGhpcy5fc291cmNlUm9vdCA9IHNtLnNvdXJjZVJvb3Q7XG5cblx0XHQvLyB1c2Ugc291cmNlLW1hcCB1dGlsaXRpZXMgdG8gbm9ybWFsaXplIHNvdXJjZXMgZW50cmllc1xuXHRcdHRoaXMuX3NvdXJjZXMgPSBzbS5zb3VyY2VzXG5cdFx0XHQubWFwKHV0aWwubm9ybWFsaXplKVxuXHRcdFx0Lm1hcCgoc291cmNlKSA9PiB7XG5cdFx0XHRcdHJldHVybiB0aGlzLl9zb3VyY2VSb290ICYmIHV0aWwuaXNBYnNvbHV0ZSh0aGlzLl9zb3VyY2VSb290KSAmJiB1dGlsLmlzQWJzb2x1dGUoc291cmNlKVxuXHRcdFx0XHRcdD8gdXRpbC5yZWxhdGl2ZSh0aGlzLl9zb3VyY2VSb290LCBzb3VyY2UpXG5cdFx0XHRcdFx0OiBzb3VyY2U7XG5cdFx0XHR9KTtcblx0XHR0cnkge1xuXHRcdFx0dGhpcy5fc21jID0gbmV3IFNvdXJjZU1hcENvbnN1bWVyKHNtKTtcblx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHQvLyBpZ25vcmUgZXhjZXB0aW9uIGFuZCBsZWF2ZSBfc21jIHVuZGVmaW5lZFxuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBmaXggYSBwYXRoIGZvciB1c2Ugd2l0aCB0aGUgc291cmNlLW1hcCBucG0gbW9kdWxlIGJlY2F1c2U6XG5cdCAqIC0gc291cmNlIG1hcCBzb3VyY2VzIGFyZSBVUkxzLCBzbyBldmVuIG9uIFdpbmRvd3MgdGhleSBzaG91bGQgYmUgdXNpbmcgZm9yd2FyZCBzbGFzaGVzLlxuXHQgKiAtIHRoZSBzb3VyY2UtbWFwIGxpYnJhcnkgZXhwZWN0cyBmb3J3YXJkIHNsYXNoZXMgYW5kIHRoZWlyIHJlbGF0aXZlIHBhdGggbG9naWNcblx0ICogICAoc3BlY2lmaWNhbGx5IHRoZSBcIm5vcm1hbGl6ZVwiIGZ1bmN0aW9uKSBnaXZlcyBpbmNvcnJlY3QgcmVzdWx0cyB3aGVuIHBhc3NpbmcgaW4gYmFja3NsYXNoZXMuXG5cdCAqIC0gcGF0aHMgc3RhcnRpbmcgd2l0aCBkcml2ZSBsZXR0ZXJzIGFyZSBub3QgcmVjb2duaXplZCBhcyBhYnNvbHV0ZSBieSB0aGUgc291cmNlLW1hcCBsaWJyYXJ5LlxuXHQgKi9cblx0cHJpdmF0ZSBmaXhQYXRoKHBhdGg6IHN0cmluZywgZGZsdD86IHN0cmluZykgOiBzdHJpbmcge1xuXHRcdGlmIChwYXRoKSB7XG5cdFx0XHRwYXRoID0gcGF0aC5yZXBsYWNlKC9cXFxcL2csICcvJyk7XG5cblx0XHRcdC8vIGlmIHBhdGggc3RhcnRzIHdpdGggYSBkcml2ZSBsZXR0ZXIgY29udmVydCBwYXRoIHRvIGEgZmlsZSB1cmwgc28gdGhhdCB0aGUgc291cmNlLW1hcCBsaWJyYXJ5IGNhbiBoYW5kbGUgaXRcblx0XHRcdGlmICgvXlthLXpBLVpdXFw6XFwvLy50ZXN0KHBhdGgpKSB7XG5cdFx0XHRcdC8vIFdpbmRvd3MgZHJpdmUgbGV0dGVyIG11c3QgYmUgcHJlZml4ZWQgd2l0aCBhIHNsYXNoXG5cdFx0XHRcdHBhdGggPSBlbmNvZGVVUkkoJ2ZpbGU6Ly8vJyArIHBhdGgpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHBhdGg7XG5cdFx0fVxuXHRcdHJldHVybiBkZmx0O1xuXHR9XG5cblx0LyoqXG5cdCAqIHVuZG8gdGhlIGZpeFxuXHQgKi9cblx0cHJpdmF0ZSB1bmZpeFBhdGgocGF0aDogc3RyaW5nKSA6IHN0cmluZyB7XG5cdFx0Y29uc3QgcHJlZml4ID0gJ2ZpbGU6Ly8nO1xuXHRcdGlmIChwYXRoLmluZGV4T2YocHJlZml4KSA9PT0gMCkge1xuXHRcdFx0cGF0aCA9IHBhdGguc3Vic3RyKHByZWZpeC5sZW5ndGgpO1xuXHRcdFx0cGF0aCA9IGRlY29kZVVSSShwYXRoKTtcblx0XHRcdGlmICgvXlxcL1thLXpBLVpdXFw6XFwvLy50ZXN0KHBhdGgpKSB7XG5cdFx0XHRcdHBhdGggPSBwYXRoLnN1YnN0cigxKTtcdC8vIHJlbW92ZSBhZGRpdGlvbmFsICcvJ1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gcGF0aDtcblx0fVxuXG5cdC8qXG5cdCAqIFRoZSBnZW5lcmF0ZWQgZmlsZSB0aGlzIHNvdXJjZSBtYXAgYmVsb25ncyB0by5cblx0ICovXG5cdHB1YmxpYyBnZW5lcmF0ZWRQYXRoKCk6IHN0cmluZyB7XG5cdFx0cmV0dXJuIHRoaXMuX2dlbmVyYXRlZEZpbGU7XG5cdH1cblxuXHRwdWJsaWMgc291cmNlcygpIDogc3RyaW5nW10ge1xuXHRcdHJldHVybiB0aGlzLl9zb3VyY2VzO1xuXHR9XG5cblx0Lypcblx0ICogUmV0dXJucyB0cnVlIGlmIHRoaXMgc291cmNlIG1hcCBvcmlnaW5hdGVzIGZyb20gdGhlIGdpdmVuIHNvdXJjZS5cblx0ICovXG5cdHB1YmxpYyBkb2VzT3JpZ2luYXRlRnJvbShhYnNQYXRoOiBzdHJpbmcpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gdGhpcy5maW5kU291cmNlKGFic1BhdGgpICE9PSBudWxsO1xuXHR9XG5cblx0LyoqXG5cdCAqIHJldHVybnMgdGhlIGZpcnN0IGVudHJ5IGZyb20gdGhlIHNvdXJjZXMgYXJyYXkgdGhhdCBtYXRjaGVzIHRoZSBnaXZlbiBhYnNQYXRoXG5cdCAqIG9yIG51bGwgb3RoZXJ3aXNlLlxuXHQgKi9cblx0cHJpdmF0ZSBmaW5kU291cmNlKGFic1BhdGg6IHN0cmluZyk6IHN0cmluZyB7XG5cdFx0Ly8gb24gV2luZG93cyBjaGFuZ2UgYmFjayBzbGFzaGVzIHRvIGZvcndhcmQgc2xhc2hlcyBiZWNhdXNlIHRoZSBzb3VyY2UtbWFwIGxpYnJhcnkgcmVxdWlyZXMgdGhpc1xuXHRcdGlmIChwcm9jZXNzLnBsYXRmb3JtID09PSAnd2luMzInKSB7XG5cdFx0XHRhYnNQYXRoID0gYWJzUGF0aC5yZXBsYWNlKC9cXFxcL2csICcvJyk7XG5cdFx0fVxuXHRcdGFic1BhdGggPSBwYXRoTm9ybWFsaXplKGFic1BhdGgpO1xuXHRcdGZvciAobGV0IG5hbWUgb2YgdGhpcy5fc291cmNlcykge1xuXHRcdFx0aWYgKCF1dGlsLmlzQWJzb2x1dGUobmFtZSkpIHtcblx0XHRcdFx0bmFtZSA9IHV0aWwuam9pbih0aGlzLl9zb3VyY2VSb290LCBuYW1lKTtcblx0XHRcdH1cblx0XHRcdGxldCBwYXRoID0gdGhpcy5hYnNvbHV0ZVBhdGgobmFtZSk7XG5cdFx0XHRwYXRoID0gcGF0aE5vcm1hbGl6ZShwYXRoKTtcblx0XHRcdGlmIChhYnNQYXRoID09PSBwYXRoKSB7XG5cdFx0XHRcdHJldHVybiBuYW1lO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXG5cdC8qKlxuXHQgKiBUcmllcyB0byBtYWtlIHRoZSBnaXZlbiBwYXRoIGFic29sdXRlIGJ5IHByZWZpeGluZyBpdCB3aXRoIHRoZSBzb3VyY2UgbWFwcyBsb2NhdGlvbi5cblx0ICogQW55IHVybCBzY2hlbWVzIGFyZSByZW1vdmVkLlxuXHQgKi9cblx0cHJpdmF0ZSBhYnNvbHV0ZVBhdGgocGF0aDogc3RyaW5nKTogc3RyaW5nIHtcblx0XHRpZiAoIXV0aWwuaXNBYnNvbHV0ZShwYXRoKSkge1xuXHRcdFx0cGF0aCA9IHV0aWwuam9pbih0aGlzLl9zb3VyY2VtYXBMb2NhdGlvbiwgcGF0aCk7XG5cdFx0fVxuXHRcdHJldHVybiB0aGlzLnVuZml4UGF0aChwYXRoKTtcblx0fVxuXG5cdC8qXG5cdCAqIEZpbmRzIHRoZSBuZWFyZXN0IHNvdXJjZSBsb2NhdGlvbiBmb3IgdGhlIGdpdmVuIGxvY2F0aW9uIGluIHRoZSBnZW5lcmF0ZWQgZmlsZS5cblx0ICogUmV0dXJucyBudWxsIGlmIHNvdXJjZW1hcCBpcyBpbnZhbGlkLlxuXHQgKi9cblx0cHVibGljIG9yaWdpbmFsUG9zaXRpb25Gb3IobGluZTogbnVtYmVyLCBjb2x1bW46IG51bWJlciwgYmlhczogQmlhcyk6IFNvdXJjZU1hcC5NYXBwZWRQb3NpdGlvbiB7XG5cblx0XHRpZiAoIXRoaXMuX3NtYykge1xuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fVxuXG5cdFx0Y29uc3QgbmVlZGxlID0ge1xuXHRcdFx0bGluZTogbGluZSxcblx0XHRcdGNvbHVtbjogY29sdW1uLFxuXHRcdFx0YmlhczogYmlhcyB8fCBCaWFzLkxFQVNUX1VQUEVSX0JPVU5EXG5cdFx0fTtcblxuXHRcdGNvbnN0IG1wID0gdGhpcy5fc21jLm9yaWdpbmFsUG9zaXRpb25Gb3IobmVlZGxlKTtcblx0XHRpZiAobXAuc291cmNlKSB7XG5cblx0XHRcdC8vIGlmIHNvdXJjZSBtYXAgaGFzIGlubGluZWQgc291cmNlLCByZXR1cm4gaXRcblx0XHRcdGNvbnN0IHNyYyA9IHRoaXMuX3NtYy5zb3VyY2VDb250ZW50Rm9yKG1wLnNvdXJjZSk7XG5cdFx0XHRpZiAoc3JjKSB7XG5cdFx0XHRcdCg8YW55Pm1wKS5jb250ZW50ID0gc3JjO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBtYXAgcmVzdWx0IGJhY2sgdG8gYWJzb2x1dGUgcGF0aFxuXHRcdFx0bXAuc291cmNlID0gdGhpcy5hYnNvbHV0ZVBhdGgobXAuc291cmNlKTtcblxuXHRcdFx0Ly8gb24gV2luZG93cyBjaGFuZ2UgZm9yd2FyZCBzbGFzaGVzIGJhY2sgdG8gYmFjayBzbGFzaGVzXG4gXHRcdFx0aWYgKHByb2Nlc3MucGxhdGZvcm0gPT09ICd3aW4zMicpIHtcblx0XHRcdFx0bXAuc291cmNlID0gbXAuc291cmNlLnJlcGxhY2UoL1xcLy9nLCAnXFxcXCcpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBtcDtcblx0fVxuXG5cdC8qXG5cdCAqIEZpbmRzIHRoZSBuZWFyZXN0IGxvY2F0aW9uIGluIHRoZSBnZW5lcmF0ZWQgZmlsZSBmb3IgdGhlIGdpdmVuIHNvdXJjZSBsb2NhdGlvbi5cblx0ICogUmV0dXJucyBudWxsIGlmIHNvdXJjZW1hcCBpcyBpbnZhbGlkLlxuXHQgKi9cblx0cHVibGljIGdlbmVyYXRlZFBvc2l0aW9uRm9yKGFic1BhdGg6IHN0cmluZywgbGluZTogbnVtYmVyLCBjb2x1bW46IG51bWJlciwgYmlhczogQmlhcyk6IFNvdXJjZU1hcC5Qb3NpdGlvbiB7XG5cblx0XHRpZiAoIXRoaXMuX3NtYykge1xuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fVxuXG5cdFx0Ly8gbWFrZSBzdXJlIHRoYXQgd2UgdXNlIGFuIGVudHJ5IGZyb20gdGhlIFwic291cmNlc1wiIGFycmF5IHRoYXQgbWF0Y2hlcyB0aGUgcGFzc2VkIGFic29sdXRlIHBhdGhcblx0XHRjb25zdCBzb3VyY2UgPSB0aGlzLmZpbmRTb3VyY2UoYWJzUGF0aCk7XG5cdFx0aWYgKHNvdXJjZSkge1xuXHRcdFx0Y29uc3QgbmVlZGxlID0ge1xuXHRcdFx0XHRzb3VyY2U6IHNvdXJjZSxcblx0XHRcdFx0bGluZTogbGluZSxcblx0XHRcdFx0Y29sdW1uOiBjb2x1bW4sXG5cdFx0XHRcdGJpYXM6IGJpYXMgfHwgQmlhcy5MRUFTVF9VUFBFUl9CT1VORFxuXHRcdFx0fTtcblxuXHRcdFx0cmV0dXJuIHRoaXMuX3NtYy5nZW5lcmF0ZWRQb3NpdGlvbkZvcihuZWVkbGUpO1xuXHRcdH1cblxuXHRcdHJldHVybiBudWxsO1xuXHR9XG59XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
