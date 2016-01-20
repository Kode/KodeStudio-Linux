/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/base/common/winjs.base', 'vs/base/common/remote', 'vs/base/common/types', 'vs/platform/thread/common/thread', 'vs/platform/thread/common/threadService', 'vs/platform/instantiation/common/descriptors'], function (require, exports, winjs_base_1, remote, Types, thread_1, threadService_1, descriptors_1) {
    var DynamicProxy = (function () {
        function DynamicProxy(proxyDefinition, disposeDelegate) {
            this._proxyDefinition = proxyDefinition;
            this._disposeDelegate = disposeDelegate;
        }
        DynamicProxy.prototype.dispose = function () {
            return this._disposeDelegate();
        };
        DynamicProxy.prototype.getProxyDefinition = function () {
            return this._proxyDefinition;
        };
        return DynamicProxy;
    })();
    var AbstractThreadService = (function () {
        function AbstractThreadService(isInMainThread) {
            this.isInMainThread = isInMainThread;
            this._boundObjects = {};
            this._pendingObjects = [];
            this._localObjMap = Object.create(null);
            this._proxyObjMap = Object.create(null);
        }
        AbstractThreadService.generateDynamicProxyId = function () {
            return String(++this._LAST_DYNAMIC_PROXY_ID);
        };
        AbstractThreadService.prototype.setInstantiationService = function (service) {
            this._instantiationService = service;
        };
        AbstractThreadService.prototype.createInstance = function () {
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i - 0] = arguments[_i];
            }
            return this._doCreateInstance(params);
        };
        AbstractThreadService.prototype._doCreateInstance = function (params) {
            var _this = this;
            var instanceOrPromise = this._instantiationService.createInstance.apply(this._instantiationService, params);
            if (winjs_base_1.TPromise.is(instanceOrPromise)) {
                var objInstantiated;
                objInstantiated = instanceOrPromise.then(function (instance) {
                    if (instance.asyncCtor) {
                        var initPromise = instance.asyncCtor();
                        if (winjs_base_1.TPromise.is(initPromise)) {
                            return initPromise.then(function () {
                                return instance;
                            });
                        }
                    }
                    return instance;
                });
                this._pendingObjects.push(objInstantiated);
                return objInstantiated.then(function (instance) {
                    var r = _this._finishInstance(instance);
                    for (var i = 0; i < _this._pendingObjects.length; i++) {
                        if (_this._pendingObjects[i] === objInstantiated) {
                            _this._pendingObjects.splice(i, 1);
                            break;
                        }
                    }
                    return r;
                });
            }
            return this._finishInstance(instanceOrPromise);
        };
        AbstractThreadService.prototype._finishInstance = function (instance) {
            instance[threadService_1.THREAD_SERVICE_PROPERTY_NAME] = this;
            this._boundObjects[instance.getId()] = instance;
            if (instance.creationDone) {
                instance.creationDone();
            }
            return instance;
        };
        AbstractThreadService.prototype.registerInstance = function (instance) {
            this._finishInstance(instance);
        };
        AbstractThreadService.prototype.handle = function (rpcId, method, args) {
            if (!this._localObjMap[rpcId]) {
                throw new Error('Unknown actor ' + rpcId);
            }
            var actor = this._localObjMap[rpcId];
            return actor[method].apply(actor, args);
        };
        AbstractThreadService.prototype._getOrCreateProxyInstance = function (remoteCom, id, descriptor) {
            if (this._proxyObjMap[id]) {
                return this._proxyObjMap[id];
            }
            var result = remote.createProxyFromCtor(remoteCom, id, descriptor.ctor);
            this._proxyObjMap[id] = result;
            return result;
        };
        AbstractThreadService.prototype._registerLocalInstance = function (id, obj) {
            this._localObjMap[id] = obj;
        };
        AbstractThreadService.prototype._getOrCreateLocalInstance = function (id, descriptor) {
            if (this._localObjMap[id]) {
                return this._localObjMap[id];
            }
            var result = this._instantiationService.createInstance(descriptor);
            this._registerLocalInstance(id, result);
            return result;
        };
        AbstractThreadService.prototype.createDynamicProxyFromMethods = function (obj) {
            var _this = this;
            var id = AbstractThreadService.generateDynamicProxyId();
            var proxyDefinition = this._proxifyMethods(id, obj);
            return new DynamicProxy(proxyDefinition, function () {
                delete _this._localObjMap[id];
            });
        };
        AbstractThreadService.prototype.createDynamicProxyFromMembers = function (obj, allowedMembers) {
            var _this = this;
            var id = AbstractThreadService.generateDynamicProxyId();
            var proxyDefinition = this._proxifyMembers(id, obj, allowedMembers);
            return new DynamicProxy(proxyDefinition, function () {
                delete _this._localObjMap[id];
            });
        };
        AbstractThreadService.prototype._proxifyMethods = function (uniqueIdentifier, obj) {
            if (!Types.isObject(obj)) {
                return null;
            }
            this._localObjMap[uniqueIdentifier] = obj;
            var r = {
                $__CREATE__PROXY__REQUEST: uniqueIdentifier
            };
            for (var prop in obj) {
                if (typeof obj[prop] === 'function') {
                    r[prop] = obj[prop].bind(obj);
                }
            }
            return r;
        };
        AbstractThreadService.prototype._proxifyMembers = function (uniqueIdentifier, obj, allowedMembers) {
            if (!Types.isObject(obj)) {
                return null;
            }
            this._localObjMap[uniqueIdentifier] = obj;
            var r = {
                $__CREATE__PROXY__REQUEST: uniqueIdentifier
            };
            for (var prop in obj) {
                if (allowedMembers.indexOf(prop) === -1) {
                    continue;
                }
                if (typeof obj[prop] === 'function') {
                    r[prop] = obj[prop].bind(obj);
                }
                else {
                    r[prop] = obj[prop];
                }
            }
            return r;
        };
        AbstractThreadService.prototype.isProxyObject = function (obj) {
            return obj && !!(obj.$__IS_REMOTE_OBJ);
        };
        AbstractThreadService.prototype.getRemotable = function (ctor) {
            var id = thread_1.Remotable.getId(ctor);
            if (!id) {
                throw new Error('Unknown Remotable: <<' + id + '>>');
            }
            var desc = descriptors_1.createSyncDescriptor(ctor);
            if (thread_1.Remotable.Registry.MainContext[id]) {
                return this._registerAndInstantiateMainProcessActor(id, desc);
            }
            if (thread_1.Remotable.Registry.PluginHostContext[id]) {
                return this._registerAndInstantiatePluginHostActor(id, desc);
            }
            if (thread_1.Remotable.Registry.WorkerContext[id]) {
                return this._registerAndInstantiateWorkerActor(id, desc, thread_1.Remotable.Registry.WorkerContext[id].affinity);
            }
            throw new Error('Unknown Remotable: <<' + id + '>>');
        };
        AbstractThreadService.prototype.registerRemotableInstance = function (ctor, instance) {
            var id = thread_1.Remotable.getId(ctor);
            if (!id) {
                throw new Error('Unknown Remotable: <<' + id + '>>');
            }
            if (thread_1.Remotable.Registry.MainContext[id]) {
                return this._registerMainProcessActor(id, instance);
            }
            if (thread_1.Remotable.Registry.PluginHostContext[id]) {
                return this._registerPluginHostActor(id, instance);
            }
            if (thread_1.Remotable.Registry.WorkerContext[id]) {
                return this._registerWorkerActor(id, instance);
            }
            throw new Error('Unknown Remotable: <<' + id + '>>');
        };
        AbstractThreadService._LAST_DYNAMIC_PROXY_ID = 0;
        return AbstractThreadService;
    })();
    exports.AbstractThreadService = AbstractThreadService;
});
//# sourceMappingURL=abstractThreadService.js.map