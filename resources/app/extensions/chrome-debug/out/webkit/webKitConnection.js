/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var WebSocket = require('ws');
var events_1 = require('events');
var utils = require('./utilities');
var utilities_1 = require('./utilities');
/**
 * Implements a Request/Response API on top of a WebSocket for messages that are marked with an `id` property.
 * Emits `message.method` for messages that don't have `id`.
 */
var ResReqWebSocket = (function (_super) {
    __extends(ResReqWebSocket, _super);
    function ResReqWebSocket() {
        _super.apply(this, arguments);
        this._pendingRequests = new Map();
    }
    /**
     * Attach to the given websocket url
     */
    ResReqWebSocket.prototype.attach = function (wsUrl) {
        var _this = this;
        this._wsAttached = new Promise(function (resolve, reject) {
            var ws;
            try {
                ws = new WebSocket(wsUrl);
            }
            catch (e) {
                // invalid url e.g.
                reject(e.message);
                return;
            }
            // WebSocket will try to connect for 20+ seconds before timing out.
            // Implement a shorter timeout here
            setTimeout(function () { return reject('WebSocket connection timed out'); }, 10000);
            // if 'error' is fired while connecting, reject the promise
            ws.on('error', reject);
            ws.on('open', function () {
                // Replace the promise-rejecting handler
                ws.removeListener('error', reject);
                ws.on('error', function (e) {
                    utilities_1.Logger.log('Websocket error: ' + e.toString());
                    _this.emit('error', e);
                });
                resolve(ws);
            });
            ws.on('message', function (msgStr) {
                utilities_1.Logger.log('From target: ' + msgStr);
                _this.onMessage(JSON.parse(msgStr));
            });
            ws.on('close', function () {
                utilities_1.Logger.log('Websocket closed');
                _this.emit('close');
            });
        });
        return this._wsAttached;
    };
    ResReqWebSocket.prototype.close = function () {
        if (this._wsAttached) {
            this._wsAttached.then(function (ws) { return ws.close(); });
        }
    };
    /**
     * Send a message which must have an id. Ok to call immediately after attach. Messages will be queued until
     * the websocket actually attaches.
     */
    ResReqWebSocket.prototype.sendMessage = function (message) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this._pendingRequests.set(message.id, resolve);
            _this._wsAttached.then(function (ws) {
                var msgStr = JSON.stringify(message);
                utilities_1.Logger.log('To target: ' + msgStr);
                ws.send(msgStr);
            });
        });
    };
    ResReqWebSocket.prototype.onMessage = function (message) {
        if (message.id) {
            if (this._pendingRequests.has(message.id)) {
                // Resolve the pending request with this response
                this._pendingRequests.get(message.id)(message);
                this._pendingRequests.delete(message.id);
            }
            else {
                console.error("Got a response with id " + message.id + " for which there is no pending request, weird.");
            }
        }
        else if (message.method) {
            this.emit(message.method, message.params);
        }
    };
    return ResReqWebSocket;
})(events_1.EventEmitter);
/**
 * Connects to a target supporting the webkit protocol and sends and receives messages
 */
var WebKitConnection = (function () {
    function WebKitConnection() {
        this._nextId = 1;
        this._socket = new ResReqWebSocket();
    }
    WebKitConnection.prototype.on = function (eventName, handler) {
        this._socket.on(eventName, handler);
    };
    /**
     * Attach the websocket to the first available tab in the chrome instance with the given remote debugging port number.
     */
    WebKitConnection.prototype.attach = function (port, url) {
        var _this = this;
        utilities_1.Logger.log('Attempting to attach on port ' + port);
        return utils.retryAsync(function () { return _this._attach(port, url); }, 6000)
            .then(function () { return _this.sendMessage('Debugger.enable'); })
            .then(function () { return _this.sendMessage('Console.enable'); })
            .then(function () { });
    };
    WebKitConnection.prototype._attach = function (port, url) {
        var _this = this;
        return utils.getURL("http://127.0.0.1:" + port + "/json").then(function (jsonResponse) {
            // Validate every step of processing the response
            try {
                var responseArray = JSON.parse(jsonResponse);
                if (Array.isArray(responseArray)) {
                    // Filter out extension targets and other things
                    var pages = responseArray.filter(function (target) { return target && target.type === 'page'; });
                    // If a url was specified (launch mode), try to filter to that url
                    if (url) {
                        var urlPages = pages.filter(function (page) { return utils.canonicalizeUrl(page.url) === utils.canonicalizeUrl(url); });
                        if (!urlPages.length) {
                            utilities_1.Logger.log("Warning: Can't find a page with url: " + url + ". Available pages: " + JSON.stringify(pages.map(function (page) { return page.url; })), true);
                        }
                        else {
                            pages = urlPages;
                        }
                    }
                    if (pages.length) {
                        if (pages.length > 1) {
                            utilities_1.Logger.log('Warning: Found more than one valid target page. Attaching to the first one. Available pages: ' + JSON.stringify(pages.map(function (page) { return page.url; })), true);
                        }
                        var wsUrl = pages[0].webSocketDebuggerUrl;
                        if (wsUrl) {
                            return _this._socket.attach(wsUrl);
                        }
                    }
                }
            }
            catch (e) {
            }
            return utils.errP('Got response from target app, but no valid target pages found');
        }, function (e) {
            return utils.errP('Cannot connect to the target: ' + e.message);
        });
    };
    WebKitConnection.prototype.close = function () {
        this._socket.close();
    };
    WebKitConnection.prototype.debugger_setBreakpoint = function (location, condition) {
        return this.sendMessage('Debugger.setBreakpoint', { location: location, condition: condition });
    };
    WebKitConnection.prototype.debugger_setBreakpointByUrl = function (url, lineNumber, columnNumber) {
        return this.sendMessage('Debugger.setBreakpointByUrl', { url: url, lineNumber: lineNumber, columnNumber: columnNumber });
    };
    WebKitConnection.prototype.debugger_removeBreakpoint = function (breakpointId) {
        return this.sendMessage('Debugger.removeBreakpoint', { breakpointId: breakpointId });
    };
    WebKitConnection.prototype.debugger_stepOver = function () {
        return this.sendMessage('Debugger.stepOver');
    };
    WebKitConnection.prototype.debugger_stepIn = function () {
        return this.sendMessage('Debugger.stepInto');
    };
    WebKitConnection.prototype.debugger_stepOut = function () {
        return this.sendMessage('Debugger.stepOut');
    };
    WebKitConnection.prototype.debugger_resume = function () {
        return this.sendMessage('Debugger.resume');
    };
    WebKitConnection.prototype.debugger_pause = function () {
        return this.sendMessage('Debugger.pause');
    };
    WebKitConnection.prototype.debugger_evaluateOnCallFrame = function (callFrameId, expression, objectGroup, returnByValue) {
        if (objectGroup === void 0) { objectGroup = 'dummyObjectGroup'; }
        return this.sendMessage('Debugger.evaluateOnCallFrame', { callFrameId: callFrameId, expression: expression, objectGroup: objectGroup, returnByValue: returnByValue });
    };
    WebKitConnection.prototype.debugger_setPauseOnExceptions = function (state) {
        return this.sendMessage('Debugger.setPauseOnExceptions', { state: state });
    };
    WebKitConnection.prototype.debugger_getScriptSource = function (scriptId) {
        return this.sendMessage('Debugger.getScriptSource', { scriptId: scriptId });
    };
    WebKitConnection.prototype.runtime_getProperties = function (objectId, ownProperties, accessorPropertiesOnly) {
        return this.sendMessage('Runtime.getProperties', { objectId: objectId, ownProperties: ownProperties, accessorPropertiesOnly: accessorPropertiesOnly });
    };
    WebKitConnection.prototype.runtime_evaluate = function (expression, objectGroup, contextId, returnByValue) {
        if (objectGroup === void 0) { objectGroup = 'dummyObjectGroup'; }
        if (returnByValue === void 0) { returnByValue = false; }
        return this.sendMessage('Runtime.evaluate', { expression: expression, objectGroup: objectGroup, contextId: contextId, returnByValue: returnByValue });
    };
    WebKitConnection.prototype.page_setOverlayMessage = function (message) {
        return this.sendMessage('Page.setOverlayMessage', { message: message });
    };
    WebKitConnection.prototype.page_clearOverlayMessage = function () {
        return this.sendMessage('Page.setOverlayMessage');
    };
    WebKitConnection.prototype.sendMessage = function (method, params) {
        return this._socket.sendMessage({
            id: this._nextId++,
            method: method,
            params: params
        });
    };
    return WebKitConnection;
})();
exports.WebKitConnection = WebKitConnection;

//# sourceMappingURL=webKitConnection.js.map
