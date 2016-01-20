/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/platform/platform', 'vs/base/common/winjs.base', './thread'], function (require, exports, Platform, winjs_base_1, thread) {
    exports.THREAD_SERVICE_PROPERTY_NAME = '__$$__threadService';
    function findMember(proto, target) {
        for (var i in proto) {
            if (proto[i] === target) {
                return i;
            }
        }
        throw new Error('Member not found in prototype');
    }
    function findThreadService(obj) {
        var threadService = obj[exports.THREAD_SERVICE_PROPERTY_NAME];
        if (!threadService) {
            throw new Error('Objects that use thread attributes must be instantiated with the thread service');
        }
        return threadService;
    }
    function MainThreadAttr(type, target) {
        var methodName = findMember(type.prototype, target);
        type.prototype[methodName] = function () {
            var param = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                param[_i - 0] = arguments[_i];
            }
            return findThreadService(this).MainThread(this, methodName, target, param);
        };
    }
    exports.MainThreadAttr = MainThreadAttr;
    function OneWorkerFn(type, target, conditionOrAffinity, affinity) {
        if (affinity === void 0) { affinity = thread.ThreadAffinity.None; }
        var methodName = findMember(type.prototype, target), condition;
        if (typeof conditionOrAffinity === 'function') {
            condition = conditionOrAffinity;
        }
        else if (typeof conditionOrAffinity !== 'undefined') {
            affinity = conditionOrAffinity;
        }
        type.prototype[methodName] = function () {
            var param = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                param[_i - 0] = arguments[_i];
            }
            if (!condition) {
                return findThreadService(this).OneWorker(this, methodName, target, param, affinity);
            }
            else {
                var that = this, promise = condition.call(that);
                if (!winjs_base_1.TPromise.is(promise)) {
                    promise = winjs_base_1.TPromise.as(promise);
                }
                return promise.then(function () {
                    return findThreadService(that).OneWorker(that, methodName, target, param, affinity);
                });
            }
        };
    }
    exports.OneWorkerAttr = OneWorkerFn;
    function AllWorkersAttr(type, target) {
        var methodName = findMember(type.prototype, target);
        type.prototype[methodName] = function () {
            var param = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                param[_i - 0] = arguments[_i];
            }
            return findThreadService(this).AllWorkers(this, methodName, target, param);
        };
    }
    exports.AllWorkersAttr = AllWorkersAttr;
    function EverywhereAttr(type, target) {
        var methodName = findMember(type.prototype, target);
        type.prototype[methodName] = function () {
            var param = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                param[_i - 0] = arguments[_i];
            }
            return findThreadService(this).Everywhere(this, methodName, target, param);
        };
    }
    exports.EverywhereAttr = EverywhereAttr;
    var SynchronizableObjectsRegistry = (function () {
        function SynchronizableObjectsRegistry() {
            this._list = [];
            this._list = [];
        }
        SynchronizableObjectsRegistry.prototype.register = function (obj) {
            this._list.push(obj);
        };
        SynchronizableObjectsRegistry.prototype.read = function () {
            return this._list;
        };
        return SynchronizableObjectsRegistry;
    })();
    exports.Extensions = {
        SynchronizableObjects: 'SynchronizableObjects'
    };
    Platform.Registry.add(exports.Extensions.SynchronizableObjects, new SynchronizableObjectsRegistry());
    function registerThreadSynchronizableObject(obj) {
        var registry = Platform.Registry.as(exports.Extensions.SynchronizableObjects);
        registry.register(obj);
    }
    exports.registerThreadSynchronizableObject = registerThreadSynchronizableObject;
    function readThreadSynchronizableObjects() {
        var registry = Platform.Registry.as(exports.Extensions.SynchronizableObjects);
        return registry.read();
    }
    exports.readThreadSynchronizableObjects = readThreadSynchronizableObjects;
});
//# sourceMappingURL=threadService.js.map