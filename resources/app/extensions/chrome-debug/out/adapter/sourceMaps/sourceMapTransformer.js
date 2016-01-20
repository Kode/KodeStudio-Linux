/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
var path = require('path');
var sourceMaps_1 = require('./sourceMaps');
var utils = require('../../webkit/utilities');
/**
 * If sourcemaps are enabled, converts from source files on the client side to runtime files on the target side
 */
var SourceMapTransformer = (function () {
    function SourceMapTransformer() {
        this._pendingBreakpointsByPath = new Map();
    }
    SourceMapTransformer.prototype.launch = function (args) {
        this.init(args);
    };
    SourceMapTransformer.prototype.attach = function (args) {
        this.init(args);
    };
    SourceMapTransformer.prototype.init = function (args) {
        if (args.sourceMaps) {
            this._webRoot = utils.getWebRoot(args);
            this._sourceMaps = new sourceMaps_1.SourceMaps(this._webRoot);
            this._requestSeqToSetBreakpointsArgs = new Map();
            this._allRuntimeScriptPaths = new Set();
            this._authoredPathsToMappedBPLines = new Map();
            this._authoredPathsToMappedBPCols = new Map();
        }
    };
    SourceMapTransformer.prototype.clearTargetContext = function () {
        this._allRuntimeScriptPaths = new Set();
    };
    /**
     * Apply sourcemapping to the setBreakpoints request path/lines
     */
    SourceMapTransformer.prototype.setBreakpoints = function (args, requestSeq) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this._sourceMaps && args.source.path) {
                var argsPath = args.source.path;
                var mappedPath = _this._sourceMaps.MapPathFromSource(argsPath);
                if (mappedPath) {
                    utils.Logger.log("SourceMaps.setBP: Mapped " + argsPath + " to " + mappedPath);
                    args.authoredPath = argsPath;
                    args.source.path = mappedPath;
                    // DebugProtocol doesn't send cols, but they need to be added from sourcemaps
                    var mappedCols = [];
                    var mappedLines = args.lines.map(function (line, i) {
                        var mapped = _this._sourceMaps.MapFromSource(argsPath, line, /*column=*/ 0);
                        if (mapped) {
                            utils.Logger.log("SourceMaps.setBP: Mapped " + argsPath + ":" + line + ":0 to " + mappedPath + ":" + mapped.line + ":" + mapped.column);
                            mappedCols[i] = mapped.column;
                            return mapped.line;
                        }
                        else {
                            utils.Logger.log("SourceMaps.setBP: Mapped " + argsPath + " but not line " + line + ", column 0");
                            mappedCols[i] = 0;
                            return line;
                        }
                    });
                    _this._authoredPathsToMappedBPLines.set(argsPath, mappedLines);
                    _this._authoredPathsToMappedBPCols.set(argsPath, mappedCols);
                    // Include BPs from other files that map to the same file. Ensure the current file's breakpoints go first
                    args.lines = mappedLines;
                    args.cols = mappedCols;
                    _this._sourceMaps.AllMappedSources(mappedPath).forEach(function (sourcePath) {
                        if (sourcePath === argsPath) {
                            return;
                        }
                        var sourceBPLines = _this._authoredPathsToMappedBPLines.get(sourcePath);
                        var sourceBPCols = _this._authoredPathsToMappedBPCols.get(sourcePath);
                        if (sourceBPLines && sourceBPCols) {
                            // Don't modify the cached array
                            args.lines = args.lines.concat(sourceBPLines);
                            args.cols = args.cols.concat(sourceBPCols);
                        }
                    });
                }
                else if (_this._allRuntimeScriptPaths.has(argsPath)) {
                    // It's a generated file which is loaded
                    utils.Logger.log("SourceMaps.setBP: SourceMaps are enabled but " + argsPath + " is a runtime script");
                }
                else {
                    // Source (or generated) file which is not loaded, need to wait
                    utils.Logger.log("SourceMaps.setBP: " + argsPath + " can't be resolved to a loaded script.");
                    _this._pendingBreakpointsByPath.set(argsPath, { resolve: resolve, reject: reject, args: args, requestSeq: requestSeq });
                    return;
                }
                _this._requestSeqToSetBreakpointsArgs.set(requestSeq, JSON.parse(JSON.stringify(args)));
                resolve();
            }
            else {
                resolve();
            }
        });
    };
    /**
     * Apply sourcemapping back to authored files from the response
     */
    SourceMapTransformer.prototype.setBreakpointsResponse = function (response, requestSeq) {
        var _this = this;
        if (this._sourceMaps && this._requestSeqToSetBreakpointsArgs.has(requestSeq)) {
            var args = this._requestSeqToSetBreakpointsArgs.get(requestSeq);
            if (args.authoredPath) {
                var sourceBPLines = this._authoredPathsToMappedBPLines.get(args.authoredPath);
                if (sourceBPLines) {
                    // authoredPath is set, so the file was mapped to source.
                    // Remove breakpoints from files that map to the same file, and map back to source.
                    response.breakpoints = response.breakpoints.filter(function (_, i) { return i < sourceBPLines.length; });
                    response.breakpoints.forEach(function (bp) {
                        var mapped = _this._sourceMaps.MapToSource(args.source.path, bp.line, bp.column);
                        if (mapped) {
                            utils.Logger.log("SourceMaps.setBP: Mapped " + args.source.path + ":" + bp.line + ":" + bp.column + " to " + mapped.path + ":" + mapped.line);
                            bp.line = mapped.line;
                        }
                        else {
                            utils.Logger.log("SourceMaps.setBP: Can't map " + args.source.path + ":" + bp.line + ":" + bp.column + ", keeping the line number as-is.");
                        }
                        _this._requestSeqToSetBreakpointsArgs.delete(requestSeq);
                    });
                }
            }
        }
        // Cleanup column, which is passed in here in case it's needed for sourcemaps, but isn't actually
        // part of the DebugProtocol
        response.breakpoints.forEach(function (bp) {
            delete bp.column;
        });
    };
    /**
     * Apply sourcemapping to the stacktrace response
     */
    SourceMapTransformer.prototype.stackTraceResponse = function (response) {
        var _this = this;
        if (this._sourceMaps) {
            response.stackFrames.forEach(function (stackFrame) {
                var mapped = _this._sourceMaps.MapToSource(stackFrame.source.path, stackFrame.line, stackFrame.column);
                if (mapped && utils.existsSync(mapped.path)) {
                    // Script was mapped to a valid path
                    stackFrame.source.path = utils.canonicalizeUrl(mapped.path);
                    stackFrame.source.sourceReference = 0;
                    stackFrame.source.name = path.basename(mapped.path);
                    stackFrame.line = mapped.line;
                    stackFrame.column = mapped.column;
                }
                else if (utils.existsSync(stackFrame.source.path)) {
                    // Script could not be mapped, but does exist on disk. Keep it and clear the sourceReference.
                    stackFrame.source.sourceReference = 0;
                }
                else {
                    // Script could not be mapped and doesn't exist on disk. Clear the path, use sourceReference.
                    stackFrame.source.path = undefined;
                }
            });
        }
        else {
            response.stackFrames.forEach(function (stackFrame) {
                // PathTransformer needs to leave the frame in an unfinished state because it doesn't know whether sourcemaps are enabled
                if (stackFrame.source.path && stackFrame.source.sourceReference) {
                    stackFrame.source.path = undefined;
                }
            });
        }
    };
    SourceMapTransformer.prototype.scriptParsed = function (event) {
        var _this = this;
        if (this._sourceMaps) {
            if (!event.body.sourceMapURL) {
                return;
            }
            this._sourceMaps.ProcessNewSourceMap(event.body.scriptUrl, event.body.sourceMapURL).then(function () {
                _this._allRuntimeScriptPaths.add(event.body.scriptUrl);
                var sources = _this._sourceMaps.AllMappedSources(event.body.scriptUrl);
                if (sources) {
                    utils.Logger.log("SourceMaps.scriptParsed: " + event.body.scriptUrl + " was just loaded and has mapped sources: " + JSON.stringify(sources));
                    sources.forEach(function (sourcePath) {
                        // If there's a setBreakpoints request waiting on this script, go through setBreakpoints again
                        if (_this._pendingBreakpointsByPath.has(sourcePath)) {
                            utils.Logger.log("SourceMaps.scriptParsed: Resolving pending breakpoints for " + sourcePath);
                            var pendingBreakpoint = _this._pendingBreakpointsByPath.get(sourcePath);
                            _this._pendingBreakpointsByPath.delete(sourcePath);
                            _this.setBreakpoints(pendingBreakpoint.args, pendingBreakpoint.requestSeq)
                                .then(pendingBreakpoint.resolve, pendingBreakpoint.reject);
                        }
                    });
                }
            });
        }
    };
    return SourceMapTransformer;
})();
exports.SourceMapTransformer = SourceMapTransformer;

//# sourceMappingURL=sourceMapTransformer.js.map
