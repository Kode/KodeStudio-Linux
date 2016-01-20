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
define(["require", "exports", 'vs/base/common/winjs.base', './abstractThreadService', 'vs/platform/thread/common/threadService', 'vs/platform/thread/common/thread'], function (require, exports, winjs_base_1, abstractThreadService, threadService_1, thread_1) {
    var PluginHostThreadService = (function (_super) {
        __extends(PluginHostThreadService, _super);
        function PluginHostThreadService(remoteCom) {
            var _this = this;
            _super.call(this, false);
            this.serviceId = thread_1.IThreadService;
            this._remoteCom = remoteCom;
            this._remoteCom.registerBigHandler(this);
            // Register all statically instantiated synchronizable objects
            threadService_1.readThreadSynchronizableObjects().forEach(function (obj) { return _this.registerInstance(obj); });
        }
        PluginHostThreadService.prototype.MainThread = function (obj, methodName, target, params) {
            return target.apply(obj, params);
        };
        PluginHostThreadService.prototype.OneWorker = function (obj, methodName, target, params, affinity) {
            return winjs_base_1.TPromise.as(null);
        };
        PluginHostThreadService.prototype.AllWorkers = function (obj, methodName, target, params) {
            return winjs_base_1.TPromise.as(null);
        };
        PluginHostThreadService.prototype.Everywhere = function (obj, methodName, target, params) {
            return target.apply(obj, params);
        };
        PluginHostThreadService.prototype.ensureWorkers = function () {
            // Nothing to do
        };
        PluginHostThreadService.prototype.addStatusListener = function (listener) {
            // Nothing to do
        };
        PluginHostThreadService.prototype.removeStatusListener = function (listener) {
            // Nothing to do
        };
        PluginHostThreadService.prototype._registerAndInstantiateMainProcessActor = function (id, descriptor) {
            return this._getOrCreateProxyInstance(this._remoteCom, id, descriptor);
        };
        PluginHostThreadService.prototype._registerMainProcessActor = function (id, actor) {
            throw new Error('Not supported in this runtime context!');
        };
        PluginHostThreadService.prototype._registerAndInstantiatePluginHostActor = function (id, descriptor) {
            return this._getOrCreateLocalInstance(id, descriptor);
        };
        PluginHostThreadService.prototype._registerPluginHostActor = function (id, actor) {
            this._registerLocalInstance(id, actor);
        };
        PluginHostThreadService.prototype._registerAndInstantiateWorkerActor = function (id, descriptor, whichWorker) {
            throw new Error('Not supported in this runtime context! Cannot communicate directly from Plugin Host to Worker!');
        };
        PluginHostThreadService.prototype._registerWorkerActor = function (id, actor) {
            throw new Error('Not supported in this runtime context!');
        };
        return PluginHostThreadService;
    })(abstractThreadService.AbstractThreadService);
    exports.PluginHostThreadService = PluginHostThreadService;
});
//# sourceMappingURL=pluginHostThreadService.js.map