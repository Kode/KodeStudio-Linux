/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
define(["require", "exports", 'vs/base/common/eventEmitter'], function (require, exports, EventEmitter) {
    var ViewEventDispatcher = (function () {
        function ViewEventDispatcher(eventHandlerGateKeeper) {
            this.eventHandlerGateKeeper = eventHandlerGateKeeper;
            this.eventHandlers = [];
            this.eventQueue = [];
            this.isConsumingQueue = false;
        }
        ViewEventDispatcher.prototype.addEventHandler = function (eventHandler) {
            for (var i = 0, len = this.eventHandlers.length; i < len; i++) {
                if (this.eventHandlers[i] === eventHandler) {
                    console.warn('Detected duplicate listener in ViewEventDispatcher', eventHandler);
                }
            }
            this.eventHandlers.push(eventHandler);
        };
        ViewEventDispatcher.prototype.removeEventHandler = function (eventHandler) {
            for (var i = 0; i < this.eventHandlers.length; i++) {
                if (this.eventHandlers[i] === eventHandler) {
                    this.eventHandlers.splice(i, 1);
                    break;
                }
            }
        };
        ViewEventDispatcher.prototype.emit = function (eventType, data) {
            this.eventQueue.push(new EventEmitter.EmitterEvent(eventType, data));
            if (!this.isConsumingQueue) {
                this.consumeQueue();
            }
        };
        ViewEventDispatcher.prototype.emitMany = function (events) {
            this.eventQueue = this.eventQueue.concat(events);
            if (!this.isConsumingQueue) {
                this.consumeQueue();
            }
        };
        ViewEventDispatcher.prototype.consumeQueue = function () {
            var _this = this;
            this.eventHandlerGateKeeper(function () {
                try {
                    _this.isConsumingQueue = true;
                    var i, len, eventHandlers, events;
                    while (_this.eventQueue.length > 0) {
                        // Empty event queue, as events might come in while sending these off
                        events = _this.eventQueue;
                        _this.eventQueue = [];
                        // Use a clone of the event handlers list, as they might remove themselves
                        eventHandlers = _this.eventHandlers.slice(0);
                        for (i = 0, len = eventHandlers.length; i < len; i++) {
                            eventHandlers[i].handleEvents(events);
                        }
                    }
                }
                finally {
                    _this.isConsumingQueue = false;
                }
            });
        };
        return ViewEventDispatcher;
    })();
    exports.ViewEventDispatcher = ViewEventDispatcher;
});
//# sourceMappingURL=viewEventDispatcher.js.map