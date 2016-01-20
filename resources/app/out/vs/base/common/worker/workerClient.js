/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/base/common/winjs.base', 'vs/base/common/timer', 'vs/base/common/errors', 'vs/base/common/worker/workerProtocol', 'vs/base/common/remote', 'vs/base/common/marshalling'], function (require, exports, winjs_base_1, timer, errors, protocol, remote, marshalling) {
    var WorkerClient = (function () {
        function WorkerClient(workerFactory, moduleId, decodeMessageName, onCrashCallback, workerId) {
            var _this = this;
            if (workerId === void 0) { workerId = ++WorkerClient.LAST_WORKER_ID; }
            this._decodeMessageName = decodeMessageName;
            this._lastMessageId = 0;
            this._promises = {};
            this._messageHandlers = {};
            this._messagesQueue = [];
            this._processQueueTimeout = -1;
            this._waitingForWorkerReply = false;
            this._lastTimerEvent = null;
            this._workerId = workerId;
            this._worker = workerFactory.create(workerId, function (msg) { return _this._onSerializedMessage(msg); }, function () {
                onCrashCallback(_this);
            });
            var loaderConfiguration = null;
            var globalRequire = window.require;
            if (typeof globalRequire.getConfig === 'function') {
                // Get the configuration from the Monaco AMD Loader
                loaderConfiguration = globalRequire.getConfig();
            }
            else if (typeof window.requirejs !== 'undefined') {
                // Get the configuration from requirejs
                loaderConfiguration = window.requirejs.s.contexts._.config;
            }
            var MonacoEnvironment = window.MonacoEnvironment || null;
            this.onModuleLoaded = this._sendMessage(protocol.MessageType.INITIALIZE, {
                id: this._worker.getId(),
                moduleId: moduleId,
                loaderConfiguration: loaderConfiguration,
                MonacoEnvironment: MonacoEnvironment
            });
            this.onModuleLoaded.then(null, function () { return _this._onError('Worker failed to load ' + moduleId); });
            this._remoteCom = new protocol.RemoteCom(this);
            this._proxiesMarshalling = new remote.ProxiesMarshallingContribution(this._remoteCom);
        }
        WorkerClient.prototype.getRemoteCom = function () {
            return this._remoteCom;
        };
        Object.defineProperty(WorkerClient.prototype, "workerId", {
            get: function () {
                return this._workerId;
            },
            enumerable: true,
            configurable: true
        });
        WorkerClient.prototype.getQueueSize = function () {
            return this._messagesQueue.length + (this._waitingForWorkerReply ? 1 : 0);
        };
        WorkerClient.prototype.request = function (requestName, payload, forceTimestamp) {
            var _this = this;
            if (requestName.charAt(0) === '$') {
                throw new Error('Illegal requestName: ' + requestName);
            }
            var shouldCancelPromise = false, messagePromise;
            return new winjs_base_1.TPromise(function (c, e, p) {
                // hide the initialize promise inside this
                // promise so that it won't be canceled by accident
                _this.onModuleLoaded.then(function () {
                    if (!shouldCancelPromise) {
                        messagePromise = _this._sendMessage(requestName, payload, forceTimestamp).then(c, e, p);
                    }
                }, e, p);
            }, function () {
                // forward cancel to the proper promise
                if (messagePromise) {
                    messagePromise.cancel();
                }
                else {
                    shouldCancelPromise = true;
                }
            });
        };
        WorkerClient.prototype.destroy = function () {
            this.dispose();
        };
        WorkerClient.prototype.dispose = function () {
            var promises = Object.keys(this._promises);
            if (promises.length > 0) {
                console.warn('Terminating a worker with ' + promises.length + ' pending promises:');
                console.warn(this._promises);
                for (var id in this._promises) {
                    if (promises.hasOwnProperty(id)) {
                        this._promises[id].error('Worker forcefully terminated');
                    }
                }
            }
            this._worker.terminate();
        };
        WorkerClient.prototype.addMessageHandler = function (message, handler) {
            this._messageHandlers[message] = handler;
        };
        WorkerClient.prototype.removeMessageHandler = function (message) {
            delete this._messageHandlers[message];
        };
        WorkerClient.prototype._sendMessage = function (type, payload, forceTimestamp) {
            var _this = this;
            if (forceTimestamp === void 0) { forceTimestamp = (new Date()).getTime(); }
            var msg = {
                id: ++this._lastMessageId,
                type: type,
                timestamp: forceTimestamp,
                payload: payload
            };
            var pc, pe, pp;
            var promise = new winjs_base_1.TPromise(function (c, e, p) {
                pc = c;
                pe = e;
                pp = p;
            }, function () {
                _this._removeMessage(msg.id);
            });
            this._promises[msg.id] = {
                complete: pc,
                error: pe,
                progress: pp,
                type: type,
                payload: payload
            };
            this._enqueueMessage(msg);
            return promise;
        };
        WorkerClient.prototype._enqueueMessage = function (msg) {
            var lastIndexSmallerOrEqual = -1, i;
            // Find the right index to insert at - keep the queue ordered by timestamp
            for (i = this._messagesQueue.length - 1; i >= 0; i--) {
                if (this._messagesQueue[i].timestamp <= msg.timestamp) {
                    lastIndexSmallerOrEqual = i;
                    break;
                }
            }
            this._messagesQueue.splice(lastIndexSmallerOrEqual + 1, 0, msg);
            this._processMessagesQueue();
        };
        WorkerClient.prototype._removeMessage = function (msgId) {
            for (var i = 0, len = this._messagesQueue.length; i < len; i++) {
                if (this._messagesQueue[i].id === msgId) {
                    if (this._promises.hasOwnProperty(String(msgId))) {
                        delete this._promises[String(msgId)];
                    }
                    this._messagesQueue.splice(i, 1);
                    this._processMessagesQueue();
                    return;
                }
            }
        };
        WorkerClient.prototype._processMessagesQueue = function () {
            var _this = this;
            if (this._processQueueTimeout !== -1) {
                clearTimeout(this._processQueueTimeout);
                this._processQueueTimeout = -1;
            }
            if (this._messagesQueue.length === 0) {
                return;
            }
            if (this._waitingForWorkerReply) {
                return;
            }
            var delayUntilNextMessage = this._messagesQueue[0].timestamp - (new Date()).getTime();
            delayUntilNextMessage = Math.max(0, delayUntilNextMessage);
            this._processQueueTimeout = setTimeout(function () {
                _this._processQueueTimeout = -1;
                if (_this._messagesQueue.length === 0) {
                    return;
                }
                _this._waitingForWorkerReply = true;
                var msg = _this._messagesQueue.shift();
                _this._lastTimerEvent = timer.start(timer.Topic.WORKER, _this._decodeMessageName(msg));
                _this._postMessage(msg);
            }, delayUntilNextMessage);
        };
        WorkerClient.prototype._postMessage = function (msg) {
            this._worker.postMessage(marshalling.marshallObject(msg, this._proxiesMarshalling));
        };
        WorkerClient.prototype._onSerializedMessage = function (msg) {
            var message = null;
            try {
                message = marshalling.demarshallObject(msg, this._proxiesMarshalling);
            }
            catch (e) {
            }
            if (message) {
                this._onmessage(message);
            }
        };
        WorkerClient.prototype._onmessage = function (msg) {
            if (!msg.monacoWorker) {
                return;
            }
            if (msg.from && msg.from !== this._worker.getId()) {
                return;
            }
            switch (msg.type) {
                case protocol.MessageType.REPLY:
                    var serverReplyMessage = msg;
                    this._waitingForWorkerReply = false;
                    if (this._lastTimerEvent) {
                        this._lastTimerEvent.stop();
                    }
                    if (!this._promises.hasOwnProperty(String(serverReplyMessage.id))) {
                        this._onError('Received unexpected message from Worker:', msg);
                        return;
                    }
                    switch (serverReplyMessage.action) {
                        case protocol.ReplyType.COMPLETE:
                            this._promises[serverReplyMessage.id].complete(serverReplyMessage.payload);
                            delete this._promises[serverReplyMessage.id];
                            break;
                        case protocol.ReplyType.ERROR:
                            this._onError('Main Thread sent to worker the following message:', {
                                type: this._promises[serverReplyMessage.id].type,
                                payload: this._promises[serverReplyMessage.id].payload
                            });
                            this._onError('And the worker replied with an error:', serverReplyMessage.payload);
                            errors.onUnexpectedError(serverReplyMessage.payload);
                            this._promises[serverReplyMessage.id].error(serverReplyMessage.payload);
                            delete this._promises[serverReplyMessage.id];
                            break;
                        case protocol.ReplyType.PROGRESS:
                            this._promises[serverReplyMessage.id].progress(serverReplyMessage.payload);
                            break;
                    }
                    break;
                case protocol.MessageType.PRINT:
                    var serverPrintMessage = msg;
                    this._consoleLog(serverPrintMessage.level, serverPrintMessage.payload);
                    break;
                default:
                    this._dispatchRequestFromWorker(msg);
            }
            this._processMessagesQueue();
        };
        WorkerClient.prototype._dispatchRequestFromWorker = function (msg) {
            var _this = this;
            this._handleWorkerRequest(msg).then(function (result) {
                var reply = {
                    id: 0,
                    type: protocol.MessageType.REPLY,
                    timestamp: (new Date()).getTime(),
                    seq: msg.req,
                    payload: (result instanceof Error ? errors.transformErrorForSerialization(result) : result),
                    err: null
                };
                _this._postMessage(reply);
            }, function (err) {
                var reply = {
                    id: 0,
                    type: protocol.MessageType.REPLY,
                    timestamp: (new Date()).getTime(),
                    seq: msg.req,
                    payload: null,
                    err: (err instanceof Error ? errors.transformErrorForSerialization(err) : err)
                };
                _this._postMessage(reply);
            });
        };
        WorkerClient.prototype._handleWorkerRequest = function (msg) {
            if (msg.type === '_proxyObj') {
                return this._remoteCom.handleMessage(msg.payload);
            }
            if (typeof this[msg.type] === 'function') {
                return this._invokeHandler(this[msg.type], this, msg.payload);
            }
            if (typeof this._messageHandlers[msg.type] === 'function') {
                return this._invokeHandler(this._messageHandlers[msg.type], null, msg.payload);
            }
            this._onError('Received unexpected message from Worker:', msg);
            return winjs_base_1.TPromise.wrapError(new Error('No handler found'));
        };
        WorkerClient.prototype._invokeHandler = function (handler, handlerCtx, payload) {
            try {
                return winjs_base_1.TPromise.as(handler.call(handlerCtx, payload));
            }
            catch (err) {
                return winjs_base_1.TPromise.wrapError(err);
            }
        };
        WorkerClient.prototype._consoleLog = function (level, payload) {
            switch (level) {
                case protocol.PrintType.LOG:
                    console.log(payload);
                    break;
                case protocol.PrintType.DEBUG:
                    console.info(payload);
                    break;
                case protocol.PrintType.INFO:
                    console.info(payload);
                    break;
                case protocol.PrintType.WARN:
                    console.warn(payload);
                    break;
                case protocol.PrintType.ERROR:
                    console.error(payload);
                    break;
                default:
                    this._onError('Received unexpected message from Worker:', payload);
            }
        };
        WorkerClient.prototype._onError = function (message, error) {
            console.error(message);
            console.info(error);
        };
        WorkerClient.LAST_WORKER_ID = 0;
        return WorkerClient;
    })();
    exports.WorkerClient = WorkerClient;
});
//# sourceMappingURL=workerClient.js.map