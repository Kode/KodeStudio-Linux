/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
var utils = require('../webkit/utilities');
/**
 * Converts a local path from Code to a path on the target.
 */
var PathTransformer = (function () {
    function PathTransformer() {
        this._clientPathToWebkitUrl = new Map();
        this._webkitUrlToClientPath = new Map();
        this._pendingBreakpointsByPath = new Map();
    }
    PathTransformer.prototype.launch = function (args) {
        this._webRoot = utils.getWebRoot(args);
    };
    PathTransformer.prototype.attach = function (args) {
        this._webRoot = utils.getWebRoot(args);
    };
    PathTransformer.prototype.setBreakpoints = function (args) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (!args.source.path) {
                resolve();
                return;
            }
            if (utils.isURL(args.source.path)) {
                // already a url, use as-is
                utils.Logger.log("Paths.setBP: " + args.source.path + " is already a URL");
                resolve();
                return;
            }
            var url = utils.canonicalizeUrl(args.source.path);
            if (_this._clientPathToWebkitUrl.has(url)) {
                args.source.path = _this._clientPathToWebkitUrl.get(url);
                utils.Logger.log("Paths.setBP: Resolved " + url + " to " + args.source.path);
                resolve();
            }
            else {
                utils.Logger.log("Paths.setBP: No target url cached for client path: " + url + ", waiting for target script to be loaded.");
                args.source.path = url;
                _this._pendingBreakpointsByPath.set(args.source.path, { resolve: resolve, reject: reject, args: args });
            }
        });
    };
    PathTransformer.prototype.clearClientContext = function () {
        this._pendingBreakpointsByPath = new Map();
    };
    PathTransformer.prototype.clearTargetContext = function () {
        this._clientPathToWebkitUrl = new Map();
        this._webkitUrlToClientPath = new Map();
    };
    PathTransformer.prototype.scriptParsed = function (event) {
        var webkitUrl = event.body.scriptUrl;
        var clientPath = utils.webkitUrlToClientPath(this._webRoot, webkitUrl);
        if (!clientPath) {
            utils.Logger.log("Paths.scriptParsed: could not resolve " + webkitUrl + " to a file in the workspace. webRoot: " + this._webRoot);
        }
        else {
            utils.Logger.log("Paths.scriptParsed: resolved " + webkitUrl + " to " + clientPath + ". webRoot: " + this._webRoot);
            this._clientPathToWebkitUrl.set(clientPath, webkitUrl);
            this._webkitUrlToClientPath.set(webkitUrl, clientPath);
            event.body.scriptUrl = clientPath;
        }
        if (this._pendingBreakpointsByPath.has(event.body.scriptUrl)) {
            utils.Logger.log("Paths.scriptParsed: Resolving pending breakpoints for " + event.body.scriptUrl);
            var pendingBreakpoint = this._pendingBreakpointsByPath.get(event.body.scriptUrl);
            this._pendingBreakpointsByPath.delete(event.body.scriptUrl);
            this.setBreakpoints(pendingBreakpoint.args).then(pendingBreakpoint.resolve, pendingBreakpoint.reject);
        }
    };
    PathTransformer.prototype.stackTraceResponse = function (response) {
        var _this = this;
        response.stackFrames.forEach(function (frame) {
            if (frame.source.path) {
                // Try to resolve the url to a path in the workspace. If it's not in the workspace,
                // just use the script.url as-is. It will be resolved or cleared by the SourceMapTransformer.
                var clientPath = _this._webkitUrlToClientPath.has(frame.source.path) ?
                    _this._webkitUrlToClientPath.get(frame.source.path) :
                    utils.webkitUrlToClientPath(_this._webRoot, frame.source.path);
                // Incoming stackFrames have sourceReference and path set. If the path was resolved to a file in the workspace,
                // clear the sourceReference since it's not needed.
                if (clientPath) {
                    frame.source.path = clientPath;
                    frame.source.sourceReference = 0;
                }
            }
        });
    };
    return PathTransformer;
})();
exports.PathTransformer = PathTransformer;

//# sourceMappingURL=pathTransformer.js.map
