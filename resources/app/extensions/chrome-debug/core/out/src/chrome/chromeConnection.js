/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var WebSocket = require('ws');
var events_1 = require('events');
var utils = require('../utils');
var logger = require('../logger');
var chromeUtils = require('./chromeUtils');
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
    Object.defineProperty(ResReqWebSocket.prototype, "isOpen", {
        get: function () { return !!this._wsAttached; },
        enumerable: true,
        configurable: true
    });
    /**
     * Attach to the given websocket url
     */
    ResReqWebSocket.prototype.open = function (wsUrl) {
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
                    logger.log('Websocket error: ' + e.toString());
                    _this.emit('error', e);
                });
                resolve(ws);
            });
            ws.on('message', function (msgStr) {
                var msgObj = JSON.parse(msgStr);
                if (msgObj
                    && !(msgObj.method === 'Debugger.scriptParsed' && msgObj.params && msgObj.params.isContentScript)
                    && !(msgObj.params && msgObj.params.url && msgObj.params.url.indexOf('extensions::') === 0)) {
                    // Not really the right place to examine the content of the message, but don't log annoying extension script notifications.
                    logger.verbose('From target: ' + msgStr);
                }
                _this.onMessage(msgObj);
            });
            ws.on('close', function () {
                logger.log('Websocket closed');
                _this.emit('close');
            });
        });
        return this._wsAttached;
    };
    ResReqWebSocket.prototype.close = function () {
        if (this._wsAttached) {
            this._wsAttached.then(function (ws) { return ws.close(); });
            this._wsAttached = null;
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
                logger.verbose('To target: ' + msgStr);
                ws.send(msgStr);
            });
        });
    };
    /**
     * Wrap EventEmitter.emit in try/catch and log, for errors thrown in subscribers
     */
    ResReqWebSocket.prototype.emit = function (event) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        try {
            return _super.prototype.emit.apply(this, arguments);
        }
        catch (e) {
            logger.error('Error while handling target event: ' + e.stack);
        }
    };
    ResReqWebSocket.prototype.onMessage = function (message) {
        if (typeof message.id === 'number') {
            if (this._pendingRequests.has(message.id)) {
                // Resolve the pending request with this response
                this._pendingRequests.get(message.id)(message);
                this._pendingRequests.delete(message.id);
            }
            else {
                logger.error("Got a response with id " + message.id + " for which there is no pending request.");
            }
        }
        else if (message.method) {
            this.emit(message.method, message.params);
        }
        else {
            // Message is malformed - safely stringify and log it
            var messageStr = void 0;
            try {
                messageStr = JSON.stringify(message);
            }
            catch (e) {
                messageStr = '' + message;
            }
            logger.error("Got a response with no id nor method property: " + messageStr);
        }
    };
    return ResReqWebSocket;
}(events_1.EventEmitter));
/**
 * Connects to a target supporting the Chrome Debug Protocol and sends and receives messages
 */
var ChromeConnection = (function () {
    function ChromeConnection(targetFilter) {
        // Take the custom targetFilter, default to returning all targets
        this._targetFilter = targetFilter || (function (target) { return true; });
        // this._socket should exist before attaching so consumers can call on() before attach, which fires events
        this.reset();
    }
    Object.defineProperty(ChromeConnection.prototype, "isAttached", {
        get: function () { return this._socket.isOpen; },
        enumerable: true,
        configurable: true
    });
    ChromeConnection.prototype.on = function (eventName, handler) {
        this._socket.on(eventName, handler);
    };
    /**
     * Attach the websocket to the first available tab in the chrome instance with the given remote debugging port number.
     */
    ChromeConnection.prototype.attach = function (port, url, address) {
        var _this = this;
        return utils.retryAsync(function () { return _this._attach(port, url, address); }, /*timeoutMs*/ 6000)
            .then(function () { return _this.sendMessage('Debugger.enable'); })
            .then(function () { return _this.sendMessage('Console.enable'); })
            .then(function () { });
    };
    ChromeConnection.prototype._attach = function (port, targetUrl, address) {
        var _this = this;
        address = address || '127.0.0.1';
        logger.log("Attempting to attach on " + address + ":" + port);
        return utils.getURL("http://" + address + ":" + port + "/json").then(function (jsonResponse) {
            // Validate every step of processing the response
            try {
                var responseArray = JSON.parse(jsonResponse);
                if (Array.isArray(responseArray)) {
                    // Filter out some targets as specified by the extension
                    var targets = responseArray.filter(_this._targetFilter);
                    if (targetUrl) {
                        // If a url was specified, try to filter to that url
                        var filteredTargets = chromeUtils.getMatchingTargets(targets, targetUrl);
                        if (filteredTargets.length) {
                            targets = filteredTargets;
                        }
                        else {
                            logger.error("Warning: Can't find a target that matches: " + targetUrl + ". Available pages: " + JSON.stringify(targets.map(function (target) { return target.url; })));
                        }
                    }
                    if (targets.length) {
                        if (targets.length > 1) {
                            logger.error('Warning: Found more than one valid target page. Attaching to the first one. Available pages: ' + JSON.stringify(targets.map(function (target) { return target.url; })));
                        }
                        var wsUrl = targets[0].webSocketDebuggerUrl;
                        logger.verbose("WebSocket Url: " + wsUrl);
                        if (wsUrl) {
                            return _this._socket.open(wsUrl);
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
    ChromeConnection.prototype.close = function () {
        this._socket.close();
        this.reset();
    };
    ChromeConnection.prototype.reset = function () {
        this._nextId = 1;
        this._socket = new ResReqWebSocket();
    };
    ChromeConnection.prototype.debugger_setBreakpoint = function (location, condition) {
        return this.sendMessage('Debugger.setBreakpoint', { location: location, condition: condition });
    };
    ChromeConnection.prototype.debugger_setBreakpointByUrl = function (url, lineNumber, columnNumber) {
        return this.sendMessage('Debugger.setBreakpointByUrl', { url: url, lineNumber: lineNumber, columnNumber: columnNumber });
    };
    ChromeConnection.prototype.debugger_removeBreakpoint = function (breakpointId) {
        return this.sendMessage('Debugger.removeBreakpoint', { breakpointId: breakpointId });
    };
    ChromeConnection.prototype.debugger_stepOver = function () {
        return this.sendMessage('Debugger.stepOver');
    };
    ChromeConnection.prototype.debugger_stepIn = function () {
        return this.sendMessage('Debugger.stepInto');
    };
    ChromeConnection.prototype.debugger_stepOut = function () {
        return this.sendMessage('Debugger.stepOut');
    };
    ChromeConnection.prototype.debugger_resume = function () {
        return this.sendMessage('Debugger.resume');
    };
    ChromeConnection.prototype.debugger_pause = function () {
        return this.sendMessage('Debugger.pause');
    };
    ChromeConnection.prototype.debugger_evaluateOnCallFrame = function (callFrameId, expression, objectGroup, returnByValue) {
        if (objectGroup === void 0) { objectGroup = 'dummyObjectGroup'; }
        return this.sendMessage('Debugger.evaluateOnCallFrame', { callFrameId: callFrameId, expression: expression, objectGroup: objectGroup, returnByValue: returnByValue });
    };
    ChromeConnection.prototype.debugger_setPauseOnExceptions = function (state) {
        return this.sendMessage('Debugger.setPauseOnExceptions', { state: state });
    };
    ChromeConnection.prototype.debugger_getScriptSource = function (scriptId) {
        return this.sendMessage('Debugger.getScriptSource', { scriptId: scriptId });
    };
    ChromeConnection.prototype.runtime_getProperties = function (objectId, ownProperties, accessorPropertiesOnly) {
        return this.sendMessage('Runtime.getProperties', { objectId: objectId, ownProperties: ownProperties, accessorPropertiesOnly: accessorPropertiesOnly });
    };
    ChromeConnection.prototype.runtime_evaluate = function (expression, objectGroup, contextId, returnByValue) {
        if (objectGroup === void 0) { objectGroup = 'dummyObjectGroup'; }
        if (returnByValue === void 0) { returnByValue = false; }
        return this.sendMessage('Runtime.evaluate', { expression: expression, objectGroup: objectGroup, contextId: contextId, returnByValue: returnByValue });
    };
    ChromeConnection.prototype.page_setOverlayMessage = function (message) {
        return this.sendMessage('Page.setOverlayMessage', { message: message });
    };
    ChromeConnection.prototype.page_clearOverlayMessage = function () {
        return this.sendMessage('Page.setOverlayMessage');
    };
    ChromeConnection.prototype.sendMessage = function (method, params) {
        return this._socket.sendMessage({
            id: this._nextId++,
            method: method,
            params: params
        });
    };
    return ChromeConnection;
}());
exports.ChromeConnection = ChromeConnection;

//# sourceMappingURL=chromeConnection.js.map
