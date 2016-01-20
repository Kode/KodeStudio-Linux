/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(["require", "exports", 'getmac', 'crypto', 'vs/platform/telemetry/browser/mainTelemetryService', 'vs/platform/storage/common/storage', 'vs/base/common/errors', 'vs/base/common/uuid'], function (require, exports, getmac, crypto, mainTelemetryService_1, storage_1, errors, uuid) {
    var StorageKeys = (function () {
        function StorageKeys() {
        }
        StorageKeys.MachineId = 'telemetry.machineId';
        StorageKeys.InstanceId = 'telemetry.instanceId';
        return StorageKeys;
    })();
    var ElectronTelemetryService = (function (_super) {
        __extends(ElectronTelemetryService, _super);
        function ElectronTelemetryService(storageService, config) {
            _super.call(this, config);
            this.storageService = storageService;
            this.setupInstanceId();
            this.setupMachineId();
        }
        ElectronTelemetryService.prototype.setupInstanceId = function () {
            var instanceId = this.storageService.get(StorageKeys.InstanceId);
            if (!instanceId) {
                instanceId = uuid.generateUuid();
                this.storageService.store(StorageKeys.InstanceId, instanceId);
            }
            this.instanceId = instanceId;
        };
        ElectronTelemetryService.prototype.setupMachineId = function () {
            var _this = this;
            var machineId = this.storageService.get(StorageKeys.MachineId);
            if (machineId) {
                this.machineId = machineId;
            }
            else {
                try {
                    // add a unique machine id as a hash of the macAddress
                    getmac.getMac(function (error, macAddress) {
                        if (!error) {
                            // crypt machine id
                            machineId = crypto.createHash('sha256').update(macAddress, 'utf8').digest('hex');
                        }
                        else {
                            // generate a UUID
                            machineId = uuid.generateUuid();
                        }
                        _this.machineId = machineId;
                        _this.storageService.store(StorageKeys.MachineId, machineId);
                    });
                }
                catch (err) {
                    errors.onUnexpectedError(err);
                    // generate a UUID
                    machineId = uuid.generateUuid();
                    this.machineId = machineId;
                    this.storageService.store(StorageKeys.MachineId, machineId);
                }
            }
        };
        ElectronTelemetryService = __decorate([
            __param(0, storage_1.IStorageService)
        ], ElectronTelemetryService);
        return ElectronTelemetryService;
    })(mainTelemetryService_1.MainTelemetryService);
    exports.ElectronTelemetryService = ElectronTelemetryService;
});
//# sourceMappingURL=electronTelemetryService.js.map