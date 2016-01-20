/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'vs/base/common/winjs.base', 'vs/base/common/worker/workerClient', 'vs/platform/thread/common/abstractThreadService', 'vs/base/common/flags', 'vs/base/common/platform', 'vs/base/common/errors', 'vs/base/common/timer', 'vs/platform/thread/common/threadService', 'vs/platform/thread/common/thread', 'vs/base/worker/defaultWorkerFactory'], function (require, exports, winjs_base_1, Worker, abstractThreadService, Env, Platform, errors, Timer, threadService_1, thread_1, defaultWorkerFactory_1) {
    var MainThreadService = (function (_super) {
        __extends(MainThreadService, _super);
        function MainThreadService(contextService, workerModuleId) {
            var _this = this;
            _super.call(this, true);
            this.serviceId = thread_1.IThreadService;
            this._contextService = contextService;
            this._workerModuleId = workerModuleId;
            this._workerFactory = new defaultWorkerFactory_1.DefaultWorkerFactory();
            if (!this.isInMainThread) {
                throw new Error('Incorrect Service usage: this service must be used only in the main thread');
            }
            this._workerPool = [];
            this._affinityScrambler = {};
            this._listeners = [];
            this._workersCreatedPromise = new winjs_base_1.TPromise(function (c, e, p) {
                _this._triggerWorkersCreatedPromise = c;
            }, function () {
                // Not cancelable
            });
            // Register all statically instantiated synchronizable objects
            threadService_1.readThreadSynchronizableObjects().forEach(function (obj) { return _this.registerInstance(obj); });
            // If nobody asks for workers to be created in 5s, the workers are created automatically
            winjs_base_1.TPromise.timeout(MainThreadService.MAXIMUM_WORKER_CREATION_DELAY).then(function () { return _this.ensureWorkers(); });
        }
        MainThreadService.prototype.ensureWorkers = function () {
            if (this._triggerWorkersCreatedPromise) {
                // Workers not created yet
                var createCount = Env.workersCount;
                if (!Platform.hasWebWorkerSupport()) {
                    // Create at most 1 compatibility worker
                    createCount = Math.min(createCount, 1);
                }
                for (var i = 0; i < createCount; i++) {
                    this._createWorker();
                }
                var complete = this._triggerWorkersCreatedPromise;
                this._triggerWorkersCreatedPromise = null;
                complete(null);
            }
        };
        MainThreadService.prototype.addStatusListener = function (listener) {
            for (var i = 0; i < this._listeners.length; i++) {
                if (this._listeners[i] === listener) {
                    // listener is already in
                    return;
                }
            }
            this._listeners.push(listener);
        };
        MainThreadService.prototype.removeStatusListener = function (listener) {
            for (var i = 0; i < this._listeners.length; i++) {
                if (this._listeners[i] === listener) {
                    this._listeners.splice(i, 1);
                    return;
                }
            }
        };
        MainThreadService.prototype._afterWorkers = function () {
            var _this = this;
            var shouldCancelPromise = false;
            return new winjs_base_1.TPromise(function (c, e, p) {
                // hide the initialize promise inside this
                // promise so that it won't be canceled by accident
                _this._workersCreatedPromise.then(function () {
                    if (!shouldCancelPromise) {
                        c(null);
                    }
                }, e, p);
            }, function () {
                // mark that this promise is canceled
                shouldCancelPromise = true;
            });
        };
        MainThreadService.prototype._createWorker = function () {
            this._workerPool.push(this._doCreateWorker());
        };
        MainThreadService.prototype._shortName = function (major, minor) {
            return major.substring(major.length - 14) + '.' + minor.substr(0, 14);
        };
        MainThreadService.prototype._doCreateWorker = function (workerId) {
            var _this = this;
            var worker = new Worker.WorkerClient(this._workerFactory, this._workerModuleId, function (msg) {
                if (msg.type === 'threadService') {
                    return _this._shortName(msg.payload[0], msg.payload[1]);
                }
                return msg.type;
            }, function (crashed) {
                var index = 0;
                for (; index < _this._workerPool.length; index++) {
                    if (crashed === _this._workerPool[index]) {
                        break;
                    }
                }
                var newWorker = _this._doCreateWorker(crashed.workerId);
                if (crashed === _this._workerPool[index]) {
                    _this._workerPool[index] = newWorker;
                }
                else {
                    _this._workerPool.push(newWorker);
                }
            }, workerId);
            worker.getRemoteCom().registerBigHandler(this);
            worker.onModuleLoaded = worker.request('initialize', {
                threadService: this._getRegisteredObjectsData(),
                contextService: {
                    workspace: this._contextService.getWorkspace(),
                    configuration: this._contextService.getConfiguration(),
                    options: this._contextService.getOptions()
                }
            });
            worker.addMessageHandler('threadService', function (msg) {
                var identifier = msg.identifier;
                var memberName = msg.memberName;
                var args = msg.args;
                if (!_this._boundObjects.hasOwnProperty(identifier)) {
                    throw new Error('Object ' + identifier + ' was not found on the main thread.');
                }
                var obj = _this._boundObjects[identifier];
                return winjs_base_1.TPromise.as(obj[memberName].apply(obj, args));
            });
            return worker;
        };
        MainThreadService.prototype._getRegisteredObjectsData = function () {
            var _this = this;
            var r = {};
            Object.keys(this._boundObjects).forEach(function (identifier) {
                var obj = _this._boundObjects[identifier];
                if (obj.getSerializableState) {
                    r[identifier] = obj.getSerializableState();
                }
            });
            return r;
        };
        MainThreadService.prototype.MainThread = function (obj, methodName, target, params) {
            return target.apply(obj, params);
        };
        MainThreadService.prototype._getWorkerIndex = function (obj, affinity) {
            if (affinity === thread_1.ThreadAffinity.None) {
                var winners = [0], winnersQueueSize = this._workerPool[0].getQueueSize();
                for (var i = 1; i < this._workerPool.length; i++) {
                    var queueSize = this._workerPool[i].getQueueSize();
                    if (queueSize < winnersQueueSize) {
                        winnersQueueSize = queueSize;
                        winners = [i];
                    }
                    else if (queueSize === winnersQueueSize) {
                        winners.push(i);
                    }
                }
                return winners[Math.floor(Math.random() * winners.length)];
            }
            var scramble = 0;
            if (this._affinityScrambler.hasOwnProperty(obj.getId())) {
                scramble = this._affinityScrambler[obj.getId()];
            }
            else {
                scramble = Math.floor(Math.random() * this._workerPool.length);
                this._affinityScrambler[obj.getId()] = scramble;
            }
            return (scramble + affinity) % this._workerPool.length;
        };
        MainThreadService.prototype.OneWorker = function (obj, methodName, target, params, affinity) {
            var _this = this;
            return this._afterWorkers().then(function () {
                if (_this._workerPool.length === 0) {
                    throw new Error('Cannot fulfill request...');
                }
                var workerIdx = _this._getWorkerIndex(obj, affinity);
                return _this._remoteCall(_this._workerPool[workerIdx], obj, methodName, params);
            });
        };
        MainThreadService.prototype.AllWorkers = function (obj, methodName, target, params) {
            var _this = this;
            return this._afterWorkers().then(function () {
                return winjs_base_1.TPromise.join(_this._workerPool.map(function (w) {
                    return _this._remoteCall(w, obj, methodName, params);
                }));
            });
        };
        MainThreadService.prototype.Everywhere = function (obj, methodName, target, params) {
            var _this = this;
            this._afterWorkers().then(function () {
                _this._workerPool.forEach(function (w) {
                    _this._remoteCall(w, obj, methodName, params).done(null, errors.onUnexpectedError);
                });
            });
            return target.apply(obj, params);
        };
        MainThreadService.prototype._remoteCall = function (worker, obj, methodName, params) {
            var _this = this;
            var id = obj.getId();
            if (!id) {
                throw new Error('Synchronizable Objects must have an identifier');
            }
            var timerEvent = Timer.start(Timer.Topic.LANGUAGES, this._shortName(id, methodName));
            var stopTimer = function () {
                timerEvent.stop();
                //			console.log(timerEvent.timeTaken(), this._workerPool.indexOf(worker), obj.getId() + ' >>> ' + methodName + ': ', params);
                _this._pingListenersIfNecessary();
            };
            var r = winjs_base_1.decoratePromise(worker.request('threadService', [id, methodName, params]), stopTimer, stopTimer);
            this._pingListenersIfNecessary();
            return r;
        };
        MainThreadService.prototype._pingListenersIfNecessary = function () {
            if (this._listeners.length > 0) {
                var status = this._buildStatus();
                var listeners = this._listeners.slice(0);
                try {
                    for (var i = 0; i < listeners.length; i++) {
                        listeners[i].onThreadServiceStatus(status);
                    }
                }
                catch (e) {
                    errors.onUnexpectedError(e);
                }
            }
        };
        MainThreadService.prototype._buildStatus = function () {
            var queueSizes = this._workerPool.map(function (worker) {
                return {
                    queueSize: worker.getQueueSize()
                };
            });
            return {
                workers: queueSizes
            };
        };
        MainThreadService.prototype._registerAndInstantiateMainProcessActor = function (id, descriptor) {
            return this._getOrCreateLocalInstance(id, descriptor);
        };
        MainThreadService.prototype._registerMainProcessActor = function (id, actor) {
            this._registerLocalInstance(id, actor);
        };
        MainThreadService.prototype._registerAndInstantiatePluginHostActor = function (id, descriptor) {
            throw new Error('Not supported in this runtime context: Cannot communicate to non-existant Plugin Host!');
        };
        MainThreadService.prototype._registerPluginHostActor = function (id, actor) {
            throw new Error('Not supported in this runtime context!');
        };
        MainThreadService.prototype._registerAndInstantiateWorkerActor = function (id, descriptor, whichWorker) {
            var helper = this._createWorkerProxyHelper(whichWorker);
            return this._getOrCreateProxyInstance(helper, id, descriptor);
        };
        MainThreadService.prototype._registerWorkerActor = function (id, actor) {
            throw new Error('Not supported in this runtime context!');
        };
        MainThreadService.prototype._createWorkerProxyHelper = function (whichWorker) {
            var _this = this;
            return {
                callOnRemote: function (proxyId, path, args) {
                    return _this._callOnWorker(whichWorker, proxyId, path, args);
                }
            };
        };
        MainThreadService.prototype._callOnWorker = function (whichWorker, proxyId, path, args) {
            var _this = this;
            if (whichWorker === thread_1.ThreadAffinity.None) {
                return winjs_base_1.TPromise.as(null);
            }
            return this._afterWorkers().then(function () {
                if (whichWorker === thread_1.ThreadAffinity.All) {
                    var promises = _this._workerPool.map(function (w) { return w.getRemoteCom(); }).map(function (rCom) { return rCom.callOnRemote(proxyId, path, args); });
                    return winjs_base_1.TPromise.join(promises);
                }
                var workerIdx = whichWorker % _this._workerPool.length;
                var worker = _this._workerPool[workerIdx];
                return worker.getRemoteCom().callOnRemote(proxyId, path, args);
            });
        };
        MainThreadService.MAXIMUM_WORKER_CREATION_DELAY = 500; // 500ms
        return MainThreadService;
    })(abstractThreadService.AbstractThreadService);
    exports.MainThreadService = MainThreadService;
});
//# sourceMappingURL=mainThreadService.js.map