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
define(["require", "exports", 'vs/base/common/winjs.base', './threadService', 'vs/platform/thread/common/abstractThreadService', 'vs/platform/thread/common/thread'], function (require, exports, winjs_base_1, threadService_1, abstractThreadService, thread_1) {
    var WorkerThreadService = (function (_super) {
        __extends(WorkerThreadService, _super);
        function WorkerThreadService(mainThreadData, remoteCom, workerPublisher) {
            var _this = this;
            _super.call(this, false);
            this.serviceId = thread_1.IThreadService;
            this._mainThreadData = mainThreadData;
            this._remoteCom = remoteCom;
            this._remoteCom.registerBigHandler(this);
            this._publisher = workerPublisher;
            // Register all statically instantiated synchronizable objects
            threadService_1.readThreadSynchronizableObjects().forEach(function (obj) { return _this.registerInstance(obj); });
        }
        WorkerThreadService.prototype._handleRequest = function (identifier, memberName, args) {
            var _this = this;
            if (!this._boundObjects.hasOwnProperty(identifier)) {
                // Wait until all objects are constructed
                return winjs_base_1.TPromise.join(this._pendingObjects.slice(0)).then(function () {
                    if (!_this._boundObjects.hasOwnProperty(identifier)) {
                        return winjs_base_1.TPromise.wrapError(new Error('Bound object `' + identifier + '` was not found.'));
                    }
                    //					console.log(identifier + ' > ' + memberName);
                    var obj = _this._boundObjects[identifier];
                    return winjs_base_1.TPromise.as(obj[memberName].apply(obj, args));
                });
            }
            //			console.log(identifier + ' > ' + memberName);
            var obj = this._boundObjects[identifier];
            return winjs_base_1.TPromise.as(obj[memberName].apply(obj, args));
        };
        WorkerThreadService.prototype.dispatch = function (data) {
            try {
                var args = data.payload;
                var result = this._handleRequest(args[0], args[1], args[2]);
                return winjs_base_1.TPromise.is(result) ? result : winjs_base_1.TPromise.as(result);
            }
            catch (e) {
                // handler error
                return winjs_base_1.TPromise.wrapError(e);
            }
        };
        WorkerThreadService.prototype._finishInstance = function (instance) {
            var id = instance.getId();
            if (this._mainThreadData.hasOwnProperty(id)) {
                var dataValue = this._mainThreadData[id];
                delete this._mainThreadData[id];
                if (!instance.setData) {
                    console.log('BROKEN INSTANCE!!! ' + id);
                }
                instance.setData(dataValue);
            }
            return _super.prototype._finishInstance.call(this, instance);
        };
        WorkerThreadService.prototype.MainThread = function (obj, methodName, target, params) {
            return this._publisher('threadService', {
                identifier: obj.getId(),
                memberName: methodName,
                args: params
            });
        };
        WorkerThreadService.prototype.OneWorker = function (obj, methodName, target, params, affinity) {
            return target.apply(obj, params);
        };
        WorkerThreadService.prototype.AllWorkers = function (obj, methodName, target, params) {
            return target.apply(obj, params);
        };
        WorkerThreadService.prototype.Everywhere = function (obj, methodName, target, params) {
            return target.apply(obj, params);
        };
        WorkerThreadService.prototype.ensureWorkers = function () {
            // Nothing to do
        };
        WorkerThreadService.prototype.addStatusListener = function (listener) {
            // Nothing to do
        };
        WorkerThreadService.prototype.removeStatusListener = function (listener) {
            // Nothing to do
        };
        WorkerThreadService.prototype._registerAndInstantiateMainProcessActor = function (id, descriptor) {
            return this._getOrCreateProxyInstance(this._remoteCom, id, descriptor);
        };
        WorkerThreadService.prototype._registerMainProcessActor = function (id, actor) {
            throw new Error('Not supported in this runtime context!');
        };
        WorkerThreadService.prototype._registerAndInstantiatePluginHostActor = function (id, descriptor) {
            throw new Error('Not supported in this runtime context: Cannot communicate from Worker directly to Plugin Host!');
        };
        WorkerThreadService.prototype._registerPluginHostActor = function (id, actor) {
            throw new Error('Not supported in this runtime context!');
        };
        WorkerThreadService.prototype._registerAndInstantiateWorkerActor = function (id, descriptor, whichWorker) {
            return this._getOrCreateLocalInstance(id, descriptor);
        };
        WorkerThreadService.prototype._registerWorkerActor = function (id, actor) {
            this._registerLocalInstance(id, actor);
        };
        return WorkerThreadService;
    })(abstractThreadService.AbstractThreadService);
    exports.WorkerThreadService = WorkerThreadService;
});
//# sourceMappingURL=workerThreadService.js.map