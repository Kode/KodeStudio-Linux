/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var os = require('os');
var vscode_debugadapter_1 = require('vscode-debugadapter');
var chromeDebugAdapter_1 = require('./chromeDebugAdapter');
var chromeConnection_1 = require('./chromeConnection');
var chromeTargetDiscoveryStrategy_1 = require('./chromeTargetDiscoveryStrategy');
var logger = require('../logger');
var adapterProxy_1 = require('../adapterProxy');
var lineNumberTransformer_1 = require('../transformers/lineNumberTransformer');
var pathTransformer_1 = require('../transformers/pathTransformer');
var sourceMapTransformer_1 = require('../transformers/sourceMapTransformer');
var ChromeDebugSession = (function (_super) {
    __extends(ChromeDebugSession, _super);
    function ChromeDebugSession(targetLinesStartAt1, isServer, opts) {
        var _this = this;
        if (isServer === void 0) { isServer = false; }
        if (opts === void 0) { opts = {}; }
        _super.call(this, targetLinesStartAt1, isServer);
        var connection = new chromeConnection_1.ChromeConnection(chromeTargetDiscoveryStrategy_1.getChromeTargetWebSocketURL, opts.targetFilter);
        var adapter = opts.adapter || new chromeDebugAdapter_1.ChromeDebugAdapter(connection);
        var logFilePath = opts.logFilePath;
        logger.init(function (msg, level) { return _this.onLog(msg, level); }, logFilePath);
        logVersionInfo();
        process.addListener('unhandledRejection', function (reason) {
            logger.error("******** Error in DebugAdapter - Unhandled promise rejection: " + reason);
        });
        this._adapterProxy = new adapterProxy_1.AdapterProxy([
            new lineNumberTransformer_1.LineNumberTransformer(targetLinesStartAt1),
            new sourceMapTransformer_1.SourceMapTransformer(),
            new pathTransformer_1.PathTransformer()
        ], adapter, function (event) { return _this.sendEvent(event); });
    }
    /**
     * This needs a bit of explanation -
     * We call DebugSession.run to create the connection to VS Code, which takes a Class extending DebugSession,
     * not an instance. That's problematic because a class can't be naturally configured the way an instance
     * would be. So this factory function dynamically creates a class which has 'opts' in a closure and can
     * instantiate ChromeDebugSession with it. Otherwise all consumers would need to subclass ChromeDebugSession
     * in a sort of non-obvious way.
     */
    ChromeDebugSession.getSession = function (opts) {
        // class expression!
        return (function (_super) {
            __extends(class_1, _super);
            function class_1(targetLinesStartAt1, isServer) {
                if (isServer === void 0) { isServer = false; }
                _super.call(this, targetLinesStartAt1, isServer, opts);
            }
            return class_1;
        }(ChromeDebugSession));
    };
    /**
     * Overload sendEvent to log
     */
    ChromeDebugSession.prototype.sendEvent = function (event) {
        if (event.event !== 'output') {
            // Don't create an infinite loop...
            logger.verbose("To client: " + JSON.stringify(event));
        }
        _super.prototype.sendEvent.call(this, event);
    };
    /**
     * Overload sendResponse to log
     */
    ChromeDebugSession.prototype.sendResponse = function (response) {
        logger.verbose("To client: " + JSON.stringify(response));
        _super.prototype.sendResponse.call(this, response);
    };
    ChromeDebugSession.prototype.onLog = function (msg, level) {
        var outputCategory = level === logger.LogLevel.Error ? 'stderr' : undefined;
        this.sendEvent(new vscode_debugadapter_1.OutputEvent("  \u203A" + msg + "\n", outputCategory));
    };
    /**
     * Takes a response and a promise to the response body. If the promise is successful, assigns the response body and sends the response.
     * If the promise fails, sets the appropriate response parameters and sends the response.
     */
    ChromeDebugSession.prototype.sendResponseAsync = function (request, response, responseP) {
        var _this = this;
        responseP.then(function (body) {
            response.body = body;
            _this.sendResponse(response);
        }, function (e) {
            var eStr = e ? e.message : 'Unknown error';
            if (eStr === 'Error: unknowncommand') {
                _this.sendErrorResponse(response, 1014, '[debugger-for-chrome] Unrecognized request: ' + request.command, null, vscode_debugadapter_1.ErrorDestination.Telemetry);
                return;
            }
            if (request.command === 'evaluate') {
                // Errors from evaluate show up in the console or watches pane. Doesn't seem right
                // as it's not really a failed request. So it doesn't need the tag and worth special casing.
                response.message = eStr;
            }
            else {
                // These errors show up in the message bar at the top (or nowhere), sometimes not obvious that they
                // come from the adapter
                response.message = '[debugger-for-chrome] ' + eStr;
                logger.log('Error: ' + e ? e.stack : eStr);
            }
            response.success = false;
            _this.sendResponse(response);
        });
    };
    /**
     * Overload dispatchRequest to dispatch to the adapter proxy instead of debugSession's methods for each request.
     */
    ChromeDebugSession.prototype.dispatchRequest = function (request) {
        var response = new Response(request);
        try {
            logger.verbose("From client: " + request.command + "(" + JSON.stringify(request.arguments) + ")");
            this.sendResponseAsync(request, response, this._adapterProxy.dispatchRequest(request));
        }
        catch (e) {
            this.sendErrorResponse(response, 1104, 'Exception while processing request (exception: {_exception})', { _exception: e.message }, vscode_debugadapter_1.ErrorDestination.Telemetry);
        }
    };
    return ChromeDebugSession;
}(vscode_debugadapter_1.DebugSession));
exports.ChromeDebugSession = ChromeDebugSession;
function logVersionInfo() {
    logger.log("OS: " + os.platform() + " " + os.arch());
    logger.log('Node: ' + process.version);
    logger.log('vscode-chrome-debug-core: ' + require('../../../package.json').version);
}
/**
 * Classes copied from vscode-debugadapter - consider exporting these instead
 */
var Message = (function () {
    function Message(type) {
        this.seq = 0;
        this.type = type;
    }
    return Message;
}());
var Response = (function (_super) {
    __extends(Response, _super);
    function Response(request, message) {
        _super.call(this, 'response');
        this.request_seq = request.seq;
        this.command = request.command;
        if (message) {
            this.success = false;
            this.message = message;
        }
        else {
            this.success = true;
        }
    }
    return Response;
}(Message));
//# sourceMappingURL=chromeDebugSession.js.map