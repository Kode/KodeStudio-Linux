/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var v8Protocol_1 = require('../common/v8Protocol');
var debugSession_1 = require('../common/debugSession');
var debugSession_2 = require('../common/debugSession');
var webKitDebugAdapter_1 = require('./webKitDebugAdapter');
var utilities_1 = require('./utilities');
var adapterProxy_1 = require('../adapter/adapterProxy');
var lineNumberTransformer_1 = require('../adapter/lineNumberTransformer');
var pathTransformer_1 = require('../adapter/pathTransformer');
var sourceMapTransformer_1 = require('../adapter/sourceMaps/sourceMapTransformer');
var WebKitDebugSession = (function (_super) {
    __extends(WebKitDebugSession, _super);
    function WebKitDebugSession(targetLinesStartAt1, isServer) {
        var _this = this;
        if (isServer === void 0) { isServer = false; }
        _super.call(this, targetLinesStartAt1, isServer);
        utilities_1.Logger.init(isServer, function (msg) { return _this.sendEvent(new debugSession_1.OutputEvent("  \u203A" + msg + "\n")); });
        process.addListener('unhandledRejection', function (reason) {
            utilities_1.Logger.log("******** ERROR! Unhandled promise rejection: " + reason);
        });
        this._adapterProxy = new adapterProxy_1.AdapterProxy([
            new lineNumberTransformer_1.LineNumberTransformer(targetLinesStartAt1),
            new sourceMapTransformer_1.SourceMapTransformer(),
            new pathTransformer_1.PathTransformer()
        ], new webKitDebugAdapter_1.WebKitDebugAdapter(), function (event) { return _this.sendEvent(event); });
    }
    /**
     * Overload sendEvent to log
     */
    WebKitDebugSession.prototype.sendEvent = function (event) {
        if (event.event !== 'output') {
            // Don't create an infinite loop...
            utilities_1.Logger.log("To client: " + JSON.stringify(event));
        }
        _super.prototype.sendEvent.call(this, event);
    };
    /**
     * Overload sendResponse to log
     */
    WebKitDebugSession.prototype.sendResponse = function (response) {
        utilities_1.Logger.log("To client: " + JSON.stringify(response));
        _super.prototype.sendResponse.call(this, response);
    };
    /**
     * Takes a response and a promise to the response body. If the promise is successful, assigns the response body and sends the response.
     * If the promise fails, sets the appropriate response parameters and sends the response.
     */
    WebKitDebugSession.prototype.sendResponseAsync = function (request, response, responseP) {
        var _this = this;
        responseP.then(function (body) {
            response.body = body;
            _this.sendResponse(response);
        }, function (e) {
            var eStr = e ? e.message : 'Unknown error';
            if (eStr === 'Error: unknowncommand') {
                _this.sendErrorResponse(response, 1014, '[webkit-debug-adapter] Unrecognized request: ' + request.command, null, debugSession_2.ErrorDestination.Telemetry);
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
                response.message = '[webkit-debug-adapter] ' + eStr;
                utilities_1.Logger.log('Error: ' + e ? e.stack : eStr);
            }
            response.success = false;
            _this.sendResponse(response);
        });
    };
    /**
     * Overload dispatchRequest to dispatch to the adapter proxy instead of debugSession's methods for each request.
     */
    WebKitDebugSession.prototype.dispatchRequest = function (request) {
        var response = new v8Protocol_1.Response(request);
        try {
            utilities_1.Logger.log("From client: " + request.command + "(" + JSON.stringify(request.arguments) + ")");
            this.sendResponseAsync(request, response, this._adapterProxy.dispatchRequest(request));
        }
        catch (e) {
            this.sendErrorResponse(response, 1104, 'Exception while processing request (exception: {_exception})', { _exception: e.message }, debugSession_2.ErrorDestination.Telemetry);
        }
    };
    return WebKitDebugSession;
})(debugSession_2.DebugSession);
exports.WebKitDebugSession = WebKitDebugSession;

//# sourceMappingURL=webKitDebugSession.js.map
