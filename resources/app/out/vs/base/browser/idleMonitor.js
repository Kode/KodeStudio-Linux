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
define(["require", "exports", 'vs/base/browser/dom', 'vs/base/common/lifecycle', 'vs/base/common/eventEmitter', 'vs/base/browser/browserService'], function (require, exports, DomUtils, Lifecycle, EventEmitter, BrowserService) {
    (function (UserStatus) {
        UserStatus[UserStatus["Idle"] = 0] = "Idle";
        UserStatus[UserStatus["Active"] = 1] = "Active";
    })(exports.UserStatus || (exports.UserStatus = {}));
    var UserStatus = exports.UserStatus;
    exports.DEFAULT_IDLE_TIME = 60 * 60 * 1000; // 60 minutes
    var IdleMonitor = (function () {
        function IdleMonitor(idleTime) {
            var _this = this;
            if (idleTime === void 0) { idleTime = exports.DEFAULT_IDLE_TIME; }
            this.instance = ReferenceCountedIdleMonitor.INSTANCE;
            this.instance.increment();
            this.status = null;
            this.idleCheckTimeout = -1;
            this.lastActiveTime = -1;
            this.idleTime = idleTime;
            this.toDispose = [];
            this.eventEmitter = new EventEmitter.EventEmitter();
            this.toDispose.push(this.eventEmitter);
            this.toDispose.push({ dispose: this.instance.addListener(function () { return _this.onUserActive(); }) });
            this.onUserActive();
        }
        IdleMonitor.prototype.addOneTimeActiveListener = function (callback) {
            return this.eventEmitter.addOneTimeDisposableListener('onActive', callback);
        };
        IdleMonitor.prototype.addOneTimeIdleListener = function (callback) {
            return this.eventEmitter.addOneTimeDisposableListener('onIdle', callback);
        };
        IdleMonitor.prototype.getStatus = function () {
            return this.status;
        };
        IdleMonitor.prototype.dispose = function () {
            this.cancelIdleCheck();
            this.toDispose = Lifecycle.disposeAll(this.toDispose);
            this.instance.decrement();
        };
        IdleMonitor.prototype.onUserActive = function () {
            this.lastActiveTime = (new Date()).getTime();
            if (this.status !== UserStatus.Active) {
                this.status = UserStatus.Active;
                this.scheduleIdleCheck();
                this.eventEmitter.emit('onActive');
            }
        };
        IdleMonitor.prototype.onUserIdle = function () {
            if (this.status !== UserStatus.Idle) {
                this.status = UserStatus.Idle;
                this.eventEmitter.emit('onIdle');
            }
        };
        IdleMonitor.prototype.scheduleIdleCheck = function () {
            var _this = this;
            if (this.idleCheckTimeout === -1) {
                var minimumTimeWhenUserCanBecomeIdle = this.lastActiveTime + this.idleTime;
                this.idleCheckTimeout = setTimeout(function () {
                    _this.idleCheckTimeout = -1;
                    _this.checkIfUserIsIdle();
                }, minimumTimeWhenUserCanBecomeIdle - (new Date()).getTime());
            }
        };
        IdleMonitor.prototype.cancelIdleCheck = function () {
            if (this.idleCheckTimeout !== -1) {
                clearTimeout(this.idleCheckTimeout);
                this.idleCheckTimeout = -1;
            }
        };
        IdleMonitor.prototype.checkIfUserIsIdle = function () {
            var actualIdleTime = (new Date()).getTime() - this.lastActiveTime;
            if (actualIdleTime >= this.idleTime) {
                this.onUserIdle();
            }
            else {
                this.scheduleIdleCheck();
            }
        };
        return IdleMonitor;
    })();
    exports.IdleMonitor = IdleMonitor;
    var ReferenceCountedObject = (function () {
        function ReferenceCountedObject() {
            this.referenceCount = 0;
        }
        ReferenceCountedObject.prototype.increment = function () {
            if (this.referenceCount === 0) {
                this.construct();
            }
            this.referenceCount++;
        };
        ReferenceCountedObject.prototype.decrement = function () {
            if (this.referenceCount > 0) {
                this.referenceCount--;
                if (this.referenceCount === 0) {
                    this.dispose();
                }
            }
        };
        ReferenceCountedObject.prototype.construct = function () {
            throw new Error('Implement me');
        };
        ReferenceCountedObject.prototype.dispose = function () {
            throw new Error('Implement me');
        };
        return ReferenceCountedObject;
    })();
    var ReferenceCountedIdleMonitor = (function (_super) {
        __extends(ReferenceCountedIdleMonitor, _super);
        function ReferenceCountedIdleMonitor() {
            _super.apply(this, arguments);
        }
        ReferenceCountedIdleMonitor.prototype.construct = function () {
            var _this = this;
            this.toDispose = [];
            this.eventEmitter = new EventEmitter.EventEmitter();
            this.toDispose.push(this.eventEmitter);
            this.toDispose.push(DomUtils.addDisposableListener(BrowserService.getService().document, 'mousemove', function () { return _this.onUserActive(); }));
            this.toDispose.push(DomUtils.addDisposableListener(BrowserService.getService().document, 'keydown', function () { return _this.onUserActive(); }));
            this.onUserActive();
        };
        ReferenceCountedIdleMonitor.prototype.dispose = function () {
            this.toDispose = Lifecycle.disposeAll(this.toDispose);
        };
        ReferenceCountedIdleMonitor.prototype.onUserActive = function () {
            this.eventEmitter.emit('onActive');
        };
        ReferenceCountedIdleMonitor.prototype.addListener = function (callback) {
            return this.eventEmitter.addListener('onActive', callback);
        };
        ReferenceCountedIdleMonitor.INSTANCE = new ReferenceCountedIdleMonitor();
        return ReferenceCountedIdleMonitor;
    })(ReferenceCountedObject);
});
//# sourceMappingURL=idleMonitor.js.map